const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string"); // => generates the "secretCode"(=random string)
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
const { BUTTON_TEXT } = require("../shared-datas/button-friendships-text");
const moment = require("moment");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
        //callback(null, "/uploads");
    },
    filename: function (req, file, callback) {
        // unique id (24) generated
        uidSafe(24)
            .then(function (uid) {
                callback(null, uid + path.extname(file.originalname));
                //callback(null, `${uid} ${path.extname(file.originalname)}`);
            })
            .catch((err) => {
                callback("err (index.js) catch diskStorage/filename: ", err);
            });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        // limit to prevent DOS attack
        fileSize: 2097152, //2MB
    },
});

app.use(compression());

app.use(
    express.json({
        extended: false,
    })
);

// NB: socket.io needs cookies in order to work
//app.use(
//cookieSession({
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 7 * 6,
});
//);

// must be after cookieSession
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// must be after cookieSession
app.use(csurf());

app.use(function (req, res, next) {
    //console.log("mytoken [csurf middleware]: ", req.csrfToken());
    res.cookie("mytoken", req.csrfToken());
    next();
});

// path.join => just another way to write it
app.use(express.static(path.join(__dirname, "..", "client", "public")));

/*
 ************************* < WELCOME > *************************
 */
// NB: this code won't work without the cookie sessione middleware
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;

    if (first == "" && last && email && password) {
        console.log("First field empty!");
        res.json({
            success: false,
            error: "!(first)",
        });
    } else if (last == "" && first && email && password) {
        console.log("Last field empty!");
        res.json({
            success: false,
            error: "!(last)",
        });
    } else if (email == "" && first && last && password) {
        console.log("Email field empty!");
        res.json({
            success: false,
            error: "!(email)",
        });
    } else if (password == "" && first && last && email) {
        console.log("First field empty!");
        res.json({
            success: false,
            error: "!(password)",
        });
    } else if (first && last && email && password) {
        hash(password)
            .then((hash) => {
                db.addUser(first, last, email, hash)
                    .then(({ rows }) => {
                        req.session.userId = rows[0].id;
                        //res.json({ error: false });
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        //console.log("err.constrain: ", err.constraint);
                        if (err.constraint == "users_email_check") {
                            console.log("Please enter a valid email!");
                            res.json({
                                success: false,
                                error: err.constraint,
                            });
                        } else if (err.constraint == "users_email_key") {
                            console.log(
                                "error in db.addUser catch: ",
                                err.constraint
                            );
                            res.json({
                                success: false,
                                error: err.constraint,
                            });
                        } else {
                            console.error("error in db.addUser catch: ", err);
                            //res.json({ error: true });
                            res.json({ success: false });
                        }
                    });
            })
            .catch((err) => {
                console.error("error in hash POST /registration: ", err);
                //res.json({ error: true });
                res.json({ success: false });
            });
    } else {
        console.log("!(first && last && email && password)");
        res.json({
            success: false,
            error: "!(first && last && email && password)",
        });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email) {
        db.getUserInfo(email)
            .then(({ rows }) => {
                if (rows.length > 0) {
                    compare(password, rows[0].password)
                        .then((result) => {
                            if (result) {
                                req.session.userId = rows[0].id;
                                res.json({
                                    success: true,
                                });
                            } else {
                                res.json({
                                    success: false,
                                    error: "!password || incorrect",
                                });
                            }
                        })
                        .catch((err) => {
                            console.log(
                                "error in compare POST /login catch: ",
                                err
                            );
                            res.json({
                                success: false,
                                error: "true",
                            });
                        });
                } else {
                    res.json({
                        success: false,
                        error: "!email || incorrect",
                    });
                }
            })
            .catch((err) => {
                console.error(
                    "error in POST /login db.getUserInfo catch: ",
                    err
                );
                res.json({
                    success: false,
                    error: "true",
                });
            });
    } else if (password) {
        res.json({
            success: false,
            error: "!email || incorrect",
        });
    } else {
        res.json({
            success: false,
            error: "!(email && password)",
        });
    }
});

app.post("/reset/password", (req, res) => {
    console.log("post(/reset/password req.body: ", req.body);
    const { email } = req.body;
    db.checkUserByEmail(email)
        .then(({ rows }) => {
            if (rows.length > 0) {
                // this is the code for generating the secretCode (=>random string)
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                //console.log("random string: ", secretCode);
                db.addSecretCodeEmail(email, secretCode)
                    .then(() => {
                        ses.sendEmail(
                            // `${email}`,
                            "lorenzomariaguerrini+socialnetwork@gmail.com",
                            `
Dear user, 


please enter this code in order to reset your password: ${secretCode}.
    

Sincerely, 

The Developers Network Services Team
                            `,
                            "Code to reset your password"
                        );
                        res.json({
                            error: false,
                            component: 2,
                        });
                    })
                    .catch((err) => {
                        console.error(
                            "error in db.addSecretCodeEmail catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                res.json({
                    error: true,
                    component: 1,
                });
            }
        })
        .catch((err) => {
            console.error("error in POST /login db.getUserInfo catch: ", err);
            res.json({
                error: true,
                component: 1,
            });
        });
});

app.post("/reset/password/verify", (req, res) => {
    const { code } = req.body;
    db.getCodeByEmail(code)
        .then(({ rows }) => {
            const codeEntered = code;
            const codeSentByEmail = rows.slice(-1)[0].code;
            if (codeSentByEmail === codeEntered) {
                const { password } = req.body;
                hash(password)
                    .then((hash) => {
                        const userEmail = rows[0].email;
                        db.updatePassword(userEmail, hash)
                            .then(() => {
                                console.log("reset-psw success!");
                                res.json({
                                    error: false,
                                    component: 3,
                                });
                            })
                            .catch((err) => {
                                console.error(
                                    "error in hash db.updatePassword catch: ",
                                    err
                                );
                                res.json({ error: true });
                            });
                    })
                    .catch((err) => {
                        console.error(
                            "error in hash POST(/reset/password/verify): ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                console.log("POST(/reset/password/verify ELSE");
                res.json({
                    error: true,
                    component: 2,
                });
            }
        })
        .catch((err) => {
            console.error(
                "error in POST(/reset/password/verify) db.getCodeByEmail catch: ",
                err
            );
            res.json({
                error: true,
                component: 1,
            });
        });
});

/*
 ************************* < APP > *************************
 */
/* app.get("/user/info", (req, res) => {
    //console.log("id: ", req.session.userId);
    const id = req.session.userId;
    db.getUserProfile(id)
        .then(({ rows }) => {
            //console.log("rows[0]: ", rows[0]);
            res.json(rows);
        })
        .catch((err) => {
            console.error(
                "error in GET/upload db.getUserProfile catch: ",
                err
            );
            //res.json({ error: true });
        });
}); */

// asyn fn
app.get("/user/info", async (req, res) => {
    try {
        const id = req.session.userId;
        //let result = await db.getUserProfile(id);
        const [result1, result2] = await Promise.all([
            db.getUserProfile(id),
            db.getUserProfileExtraInfos(id),
        ]);
        if (result2.rows.length > 0) {
            if (result2.rows[0].github != undefined) {
                result2.rows[0].gitHub = result2.rows[0].github;
                delete result2.rows[0].github;
            }
            if (result2.rows[0].linkedin != undefined) {
                result2.rows[0].linkedIn = result2.rows[0].linkedin;
                delete result2.rows[0].linkedin;
            }
        }

        const finalResult = {
            ...result1.rows[0],
            ...result2.rows[0],
        };
        //res.json(result.rows[0]);
        res.json(finalResult);
    } catch (err) {
        console.error("error in GET/upload db.getUserProfile catch: ", err);
        res.json({ error: true });
    }
});

app.post("/user/edit", (req, res) => {
    const userId = req.session.userId;
    const { first, last, email, password } = req.body;

    if (!password) {
        if (first == "" && last && email) {
            console.log("First field empty!");
            res.json({
                success: false,
                error: "!(first)",
            });
        } else if (last == "" && first && email) {
            console.log("Last field empty!");
            res.json({
                success: false,
                error: "!(last)",
            });
        } else if (email == "" && first && last) {
            console.log("Email field empty!");
            res.json({
                success: false,
                error: "!(email)",
            });
        } else {
            db.editUser(userId, first, last, email)
                .then(() => res.json({ success: true }))
                .catch((err) => {
                    /* console.log("error in db.editUser catch: ", err);
                res.json({ success: false, error: true }); */

                    if (err.constraint == "users_email_check") {
                        console.log("Please enter a valid email!");
                        res.json({
                            success: false,
                            error: err.constraint,
                        });
                    } else if (err.constraint == "users_email_key") {
                        console.log(
                            "error in db.editUser catch: ",
                            err.constraint
                        );
                        res.json({
                            success: false,
                            error: err.constraint,
                        });
                    } else {
                        console.error("error in db.editUser catch: ", err);
                        //res.json({ success: false, error: true });
                        res.json({
                            success: false,
                            error:
                                "Ops, something went wrong! \nPlease try again",
                        });
                    }
                });
        }
    } else {
        hash(password).then((hash) => {
            db.editUserPsw(userId, first, last, email, hash)
                .then(() => res.json({ success: true }))
                .catch((err) => {
                    console.error("error in db.editUserPsw catch: ", err);
                    //res.json({ success: false, error: true });
                    res.json({
                        success: false,
                        error:
                            "Ops, something went wrong while inserting the new password! \nPlease try again",
                    });
                });
        });
    }
});

app.post("/user/delete", (req, res) => {
    const id = req.session.userId;

    s3.deleteIdFolder(id)
        .then(() => {
            console.log("user s3 folder deleted!");
            db.deleteUserFromWall(id)
                .then(() => {
                    console.log("user deleted from wall table!");
                    db.deleteUserFromPrivateMessages(id)
                        .then(() => {
                            console.log(
                                "user deleted from private_messages table!"
                            );
                            db.deleteUserFromChatMessages(id)
                                .then(() => {
                                    console.log(
                                        "user deleted from chat_messages table!"
                                    );
                                    db.deleteUserFromFriendships(id)
                                        .then(() => {
                                            console.log(
                                                "user deleted from friendships table!"
                                            );
                                            db.deleteUserFromUsers(id)
                                                .then(() => {
                                                    //console.log("delete user rows: ", rows[0]);
                                                    console.log(
                                                        "user deleted from users table!"
                                                    );
                                                    /* console.log(
                                                "substr delete: ",
                                                rows[0].profile_pic.substr(49)
                                                );
                                                if (rows[0].profile_pic) {
                                                //const lastProfPic = rows[0].profile_pic;
                                            } */
                                                    res.json({ success: true });
                                                })
                                                .catch((err) => {
                                                    console.error(
                                                        "error in POST/user/delete db.deleteUserFromUsers catch: ",
                                                        err
                                                    );
                                                    res.json({ error: true });
                                                });
                                        })
                                        .catch((err) => {
                                            console.error(
                                                "error in POST/user/delete db.deleteUserFromFriendships catch: ",
                                                err
                                            );
                                            res.json({ error: true });
                                        });
                                })
                                .catch((err) => {
                                    console.error(
                                        "error in POST/user/delete db.deleteUserFromChatMessages catch: ",
                                        err
                                    );
                                    res.json({ error: true });
                                });
                        })
                        .catch((err) => {
                            console.error(
                                "error in POST/user/delete db.deleteUserFromPrivateMessages catch: ",
                                err
                            );
                            res.json({ error: true });
                        });
                })
                .catch((err) => {
                    console.error(
                        "error in POST/user/delete db.deleteUserFromWall catch: ",
                        err
                    );
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.error(
                "error in POST/user/delete s3.deleteIdFolder catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    const id = req.session.userId;
    // we can construct the URL needed to be able to see our image
    //const url = `${s3Url}${req.file.filename}`; // before making userId=s3-folder
    const { filename } = req.file;
    const url = s3Url + `${req.session.userId}/` + filename;
    if (req.file) {
        db.updateProfilePic(id, url)
            .then(({ rows }) => {
                //console.log("update rows:", rows[0].profile_pic);
                //console.log("substr upload: ", rows[0].profile_pic.substr(49));
                /* if (rows[0].profile_pic) {
                    const penultimateProfPic = rows[0].profile_pic.substr(49);
                    console.log(
                        "penultimateProfPic from server: ",
                        penultimateProfPic
                    );
                    const promise = s3
                        .deleteObject({
                            Bucket: "lorenzoimageboardbucket", 
                            Key: penultimateProfPic,
                        })
                        .promise(); 

                    promise
                        .then(() => {
                            console.log(
                                "(s3-promise/then): image deletion from AWS complete!"
                            );
                            next();
                            // optional clean up:
                            //fs.unlink(path, () => {});
                            //this is called a "noop (no operation) function"
                        })
                        .catch((err) => {
                            console.log(
                                "Something went wrong in deleting from S3!: ",
                                err
                            );
                            res.sendStatus(404); // (?)
                        }); */
                //s3.delete(penultimateProfPic);

                /* res.json({ error: false, profile_pic: url }); */
                res.json(rows[0]);
                //}
            })
            .catch((err) => {
                console.error(
                    "error in POST/upload db.updateProfilePic catch: ",
                    err
                );
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});

app.post("/delete", s3.delete, (req, res) => {
    const id = req.session.userId;
    const urlNull = null;
    db.updateProfilePic(id, urlNull)
        .then(() => {
            res.json({ error: false, profile_pic: urlNull });
        })
        .catch((err) => {
            console.error(
                "error in POST/delete db.updateProfilePic catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/edit/bio", (req, res) => {
    console.log("server bio body :", req.body);
    const id = req.session.userId;
    const { draftBio } = req.body;
    console.log("íd, draftLocation :", id, draftBio);
    db.updateBio(id, draftBio)
        .then(() => {
            //console.log("post(/edit/bio rows[0].bio:", rows[0].bio);
            res.json({ error: false, bio: draftBio });
        })
        .catch((err) => {
            console.error("error in POST/edit/bio db.updateBio catch: ", err);
            //res.json({ error: true });
        });
});

app.post("/edit/location", (req, res) => {
    const id = req.session.userId;
    const { draftLocation } = req.body;
    //console.log("íd, draftLocation :", id, draftLocation);
    let userExtraInfos = 0;

    db.getUserProfileExtraInfos(id)
        .then((rows) => {
            for (const obj of rows.rows) {
                if (obj) userExtraInfos++;
            }

            if (userExtraInfos > 0) {
                db.updateLocation(id, draftLocation)
                    .then(() => {
                        res.json({ error: false, location: draftLocation });
                        console.log("new location updated!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/location db.updateLocation catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                db.insertLocation(id, draftLocation)
                    .then((rows) => {
                        //console.log("post(/edit/location rows:", rows);
                        console.log("post(/edit/location rows[0]:", rows[0]);
                        res.json({ error: false, location: draftLocation });
                        console.log("location inserted!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/location db.insertLocation catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            }

            console.log(userExtraInfos);
            //res.json({ error: false, location: draftLocation });
        })
        .catch((err) => {
            console.error(
                "error in POST/edit/location db.getUserProfileExtraInfos catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/edit/education", (req, res) => {
    const id = req.session.userId;
    const { draftEducation } = req.body;
    let userExtraInfos = 0;

    db.getUserProfileExtraInfos(id)
        .then((rows) => {
            for (const obj of rows.rows) {
                if (obj) userExtraInfos++;
            }

            if (userExtraInfos > 0) {
                db.updateEducation(id, draftEducation)
                    .then(() => {
                        res.json({ error: false, education: draftEducation });
                        console.log("new education updated!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/education db.updateEducation catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                db.insertEducation(id, draftEducation)
                    .then(() => {
                        res.json({ error: false, education: draftEducation });
                        console.log("education inserted!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/education db.insertEducation catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.error(
                "error in POST/edit/education db.getUserProfileExtraInfos catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/edit/skills", (req, res) => {
    const id = req.session.userId;
    const { draftSkills } = req.body;
    let userExtraInfos = 0;

    db.getUserProfileExtraInfos(id)
        .then((rows) => {
            for (const obj of rows.rows) {
                if (obj) userExtraInfos++;
            }

            if (userExtraInfos > 0) {
                db.updateSkills(id, draftSkills)
                    .then(() => {
                        res.json({ error: false, skills: draftSkills });
                        console.log("new skills updated!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/skills db.updateSkills catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                db.insertSkills(id, draftSkills)
                    .then(() => {
                        res.json({ error: false, skills: draftSkills });
                        console.log("skills inserted!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/skills db.insertSkills catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.error(
                "error in POST/edit/skills db.getUserProfileExtraInfos catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/edit/work", (req, res) => {
    const id = req.session.userId;
    const { draftWork } = req.body;
    let userExtraInfos = 0;

    db.getUserProfileExtraInfos(id)
        .then((rows) => {
            for (const obj of rows.rows) {
                if (obj) userExtraInfos++;
            }

            if (userExtraInfos > 0) {
                db.updateWork(id, draftWork)
                    .then(() => {
                        res.json({ error: false, work: draftWork });
                        console.log("new work updated!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/work db.updateWork catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                db.insertWork(id, draftWork)
                    .then(() => {
                        res.json({ error: false, work: draftWork });
                        console.log("work inserted!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/work db.insertWork catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.error(
                "error in POST/edit/work db.getUserProfileExtraInfos catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/edit/gitHub", (req, res) => {
    const id = req.session.userId;
    const { draftGitHub } = req.body;
    let userExtraInfos = 0;

    db.getUserProfileExtraInfos(id)
        .then((rows) => {
            for (const obj of rows.rows) {
                if (obj) userExtraInfos++;
            }

            if (userExtraInfos > 0) {
                db.updateGitHub(id, draftGitHub)
                    .then(() => {
                        res.json({ error: false, gitHub: draftGitHub });
                        console.log("new GitHub link updated!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/gitHub db.updateGitHub catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                db.insertGitHub(id, draftGitHub)
                    .then(() => {
                        res.json({ error: false, gitHub: draftGitHub });
                        console.log("GitHub link inserted!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/gitHub db.insertGitHub catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.error(
                "error in POST/edit/gitHub db.getUserProfileExtraInfos catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/edit/linkedIn", (req, res) => {
    const id = req.session.userId;
    const { draftLinkedIn } = req.body;
    let userExtraInfos = 0;

    db.getUserProfileExtraInfos(id)
        .then((rows) => {
            for (const obj of rows.rows) {
                if (obj) userExtraInfos++;
            }

            if (userExtraInfos > 0) {
                db.updateLinkedIn(id, draftLinkedIn)
                    .then(() => {
                        res.json({ error: false, linkedIn: draftLinkedIn });
                        console.log("new LinkedIn link updated!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/linkedIn db.updateLinkedIn catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                db.insertLinkedIn(id, draftLinkedIn)
                    .then(() => {
                        res.json({ error: false, linkedIn: draftLinkedIn });
                        console.log("LinkedIn link inserted!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/linkedIn db.insertLinkedIn catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.error(
                "error in POST/edit/linkedIn db.getUserProfileExtraInfos catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/edit/languages", (req, res) => {
    const id = req.session.userId;
    const { draftLanguages } = req.body;
    let userExtraInfos = 0;

    db.getUserProfileExtraInfos(id)
        .then((rows) => {
            for (const obj of rows.rows) {
                if (obj) userExtraInfos++;
            }

            if (userExtraInfos > 0) {
                db.updateLanguages(id, draftLanguages)
                    .then(() => {
                        res.json({ error: false, languages: draftLanguages });
                        console.log("new languages updated!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/languages db.updateLanguages catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                db.insertLanguages(id, draftLanguages)
                    .then(() => {
                        res.json({ error: false, languages: draftLanguages });
                        console.log("languages inserted!");
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/edit/languages db.insertLanguages catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.error(
                "error in POST/edit/languages db.getUserProfileExtraInfos catch: ",
                err
            );
            res.json({ error: true });
        });
});

/* app.get("/other-user/info/:id", (req, res) => {
    const id = req.session.userId;
    const requestedId = req.params.id;
    if (requestedId == id) {
        res.json({ requestedInvalidId: true, error: true });
    }
    db.getOtherUserInfo(requestedId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error(
                "error in POST/upload db.getOtherUserInfo catch: ",
                err
            );
            res.json({ error: true });
        });
}); */

// asyn fn
app.get("/other-user/info/:id", async (req, res) => {
    try {
        const userId = req.session.userId;
        const otherUserId = req.params.id;
        if (otherUserId == userId) {
            res.json({ requestedInvalidId: true, error: true });
        }
        const [result1, result2] = await Promise.all([
            db.getOtherUserInfo(otherUserId),
            db.getUserProfileExtraInfos(otherUserId),
        ]);
        if (result2.rows.length > 0) {
            if (result2.rows[0].github != undefined) {
                result2.rows[0].gitHub = result2.rows[0].github;
                delete result2.rows[0].github;
            }
            if (result2.rows[0].linkedin != undefined) {
                result2.rows[0].linkedIn = result2.rows[0].linkedin;
                delete result2.rows[0].linkedin;
            }
        }

        const finalResult = {
            ...result1.rows[0],
            ...result2.rows[0],
        };
        //res.json(result.rows[0]);
        res.json(finalResult);
    } catch (err) {
        console.error("error in GET/upload db.getUserProfile catch: ", err);
        res.json({ error: true });
    }
});

app.get("/users/latest", (req, res) => {
    db.getLatestUsers()
        .then(({ rows }) => {
            //console.log("GET 3 last users: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.error("error in GET/upload db.getLatestUsers catch: ", err);
            res.json({ error: true });
        });
});

app.get("/users/search/:query", (req, res) => {
    const searchedUser = req.params.query;
    db.getUsersPatternMatching(searchedUser)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error in GET/upload db.getLatestUsers catch: ", err);
            res.json({ error: true });
        });
});

app.get("/friendship/status/:id", (req, res) => {
    const { id: recipientId } = req.params;
    const senderId = req.session.userId;
    let senderUser = false;
    db.getFriendshipStatus(senderId, recipientId)
        .then(({ rows }) => {
            if (!rows.length > 0) {
                res.json({ friendship: false });
            } else if (rows[0].accepted) {
                res.json({ friendship: true });
            } else if (!rows[0].accepted) {
                if (senderId == rows[0].sender_id) {
                    senderUser = true;
                }
                res.json({ senderUser: senderUser, friendshipRequest: true });
            }
        })
        .catch((err) => {
            console.error(
                "error in GET/friendship/status/:id db.getFriendshipStatus catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/friendship/action", (req, res) => {
    const senderId = req.session.userId;
    const { action, recipientId } = req.body;
    if (action == BUTTON_TEXT.SEND_REQUEST) {
        db.sendFriendshipRequest(senderId, recipientId)
            .then(() => {
                res.json({ buttonValue: BUTTON_TEXT.REFUSE_REQUEST });
            })
            .catch((err) => {
                console.error(
                    "error in POST(/friendship/action db.sendFriendshipRequest catch: ",
                    err
                );
                res.json({ error: true });
            });
    } else if (action == BUTTON_TEXT.ACCEPT_REQUEST) {
        db.acceptFriendshipRequest(senderId, recipientId)
            .then(() => {
                res.json({ buttonValue: BUTTON_TEXT.UNFRIEND });
            })
            .catch((err) => {
                console.error(
                    "error in POST(/friendship/action db.acceptFriendshipRequest catch: ",
                    err
                );
                res.json({ error: true });
            });
    } else if (action == BUTTON_TEXT.REFUSE_REQUEST) {
        db.refuseFriendshipRequest(senderId, recipientId)
            .then(() => {
                res.json({ buttonValue: BUTTON_TEXT.SEND_REQUEST });
            })
            .catch((err) => {
                console.error(
                    "error in POST(/friendship/action db.refuseFriendshipRequest catch: ",
                    err
                );
                res.json({ error: true });
            });
    } else if (action == BUTTON_TEXT.UNFRIEND) {
        db.deleteFriendship(senderId, recipientId)
            .then(() => {
                res.json({ buttonValue: BUTTON_TEXT.SEND_REQUEST });
            })
            .catch((err) => {
                console.error(
                    "error in POST(/friendship/action db.deleteFriendship catch: ",
                    err
                );
                res.json({ error: true });
            });
    }
});

app.get("/friends-wannabes", function (req, res) {
    const id = req.session.userId;
    db.getFriendsWannabes(id)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.error(
                "error in GET/friends-wannabes db.getFriendsWannabes catch: ",
                err
            );
            res.json({ error: true });
        });
});

/* app.get("/message/private/:id", function (req, res) {
    const senderId = req.session.userId;
    const recipientId = req.params.id;
    console.log("/privatemessage/:id: ", senderId, recipientId);

    db.getMostRecentPrivateMessages(senderId, recipientId)
        .then(({ rows }) => {
            //console.log("rows get privatemessage: ", rows);

            const newRows = rows
                .map((obj) => ({
                    senderIdPM: senderId,
                    recipientIdPM: recipientId,
                    messageId: obj.id,
                    senderNamePM: obj.first + " " + obj.last,
                    senderProfile_picPM: obj.profile_pic,
                    privateMessage: obj.message,
                    privateMessageDateTime:
                        "on " +
                        ("" + obj.created_at + "").substring(0, 15) +
                        " at " +
                        ("" + obj.created_at + "").substring(16, 24),
                }))
                .reverse();
            //console.log("GET newRows: ", newRows.reverse());

            res.json({ newRows });
        })
        .catch((err) => {
            console.error(
                "error in GET/privatemessage/:id db.getMostRecentPrivateMessages catch: ",
                err
            );
            res.json({ error: true });
        });
}); */

//app.post("/message/private", function (req, res) {
/* app.post("/privatemessage", function (req, res) {
    const senderId = req.session.userId;
    //console.log("senderId ", senderId);
    const { recipientId, message } = req.body;
    //console.log("recipientId ", recipientId);
    //console.log("message ", message);

    db.insertNewPrivateMessage(senderId, recipientId, message)
        .then(({ rows }) => {
            //console.log("rows post insertNewPrivateMessage: ", rows);
            const messageId = rows[0].id;
            //console.log("message Id: ", messageId);

            db.getNewPrivateMessageInfo(messageId)
                .then(({ rows }) => {
                    //console.log("rows post getNewPrivateMessage: ", rows);

                    const newRows = rows.map((obj) => ({
                        name: obj.first + " " + obj.last,
                        profile_pic: obj.profile_pic,
                        message: obj.message,
                        timestamp:
                            "on " +
                            ("" + obj.created_at + "").substring(0, 15) +
                            " at " +
                            ("" + obj.created_at + "").substring(16, 24),
                    }));
                    //console.log("POST newRows: ", newRows);

                    res.json({ newRows });
                })
                .catch((err) => {
                    console.error(
                        "error in POST/message/private db.insertNewPrivateMessage catch: ",
                        err
                    );
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.error(
                "error in POST/message/private db.insertNewPrivateMessage catch: ",
                err
            );
            res.json({ error: true });
        });
}); */

/* app.post("/privatemessage/delete", function (req, res) {
    console.log('app.post("/privatemessage/delete"');
    const privateMessageId = req.body.message;
    console.log("Server req.body :", req.body);
    console.log("Server req.body.message :", req.body.message);
    db.deletePrivateMessage(privateMessageId)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.error(
                "error in POST/privatemessage/delete db.deletePrivateMessage catch: ",
                err
            );
            res.json({ error: true });
        });
}); */

/* app.post("/message/delete", function (req, res) {
    const messageId = req.body.message;
    db.deleteMessage(messageId)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.error(
                "error in POST/message/delete db.deleteMessage catch: ",
                err
            );
            res.json({ error: true });
        });
}); */

app.get("/wall/posts/:id", function (req, res) {
    //console.log("GET wall post params: ", req.params);
    //console.log("id: ", req.params.id);
    const { id } = req.params;
    db.getWallPosts(id)
        .then(({ rows }) => {
            //console.log("GET wall post rows: ", rows);

            const newRows = rows.map((obj) => ({
                id: obj.id,
                userId: obj.user_id,
                image: obj.url,
                title: obj.description,
                timestamp:
                    "on " +
                    ("" + obj.created_at + "").substring(0, 15) +
                    " at " +
                    ("" + obj.created_at + "").substring(16, 24),
                dateTime: obj.created_at,
            }));
            //console.log("GET wall posts newRows: ", newRows);
            res.json({ newRows });
        })
        .catch((err) => {
            console.error(
                "error in GET/wall/post/:id db.getWallPosts catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.post("/wall/posts", uploader.single("image"), s3.upload, (req, res) => {
    //console.log("POST wall post req.body: ", req.body);
    //console.log("POST wall post description: ", req.body.description); // insert
    const id = req.session.userId;
    //console.log("id POST: ", id);
    // we can construct the URL needed to be able to see our image
    //console.log("POST req.file.filename: ", req.file.filename);
    //const url = `${s3Url}${req.file.filename}`;
    const { filename } = req.file;
    const url = s3Url + `${req.session.userId}/` + filename;
    console.log("url POST/wall: ", url);
    const description = req.body.description;
    //console.log("description POST: ", description);
    if (req.file) {
        db.postWallPost(id, url, description)
            .then(({ rows }) => {
                //console.log("POST wall post rows: ", rows[0]);

                const mappedRows = rows.map((obj) => ({
                    id: obj.id,
                    userId: obj.user_id,
                    image: obj.url,
                    title: obj.description,
                    timestamp:
                        "on " +
                        ("" + obj.created_at + "").substring(0, 15) +
                        " at " +
                        ("" + obj.created_at + "").substring(16, 24),
                }));
                const newRows = mappedRows[0];
                //console.log("POST newRows: ", newRows);
                res.json({ newRows });
            })
            .catch((err) => {
                console.error(
                    "error in POST/wall/posts db.postWallPost catch: ",
                    err
                );
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});

app.post("/post/delete", function (req, res) {
    const postId = req.body.postId;
    let postHasReplies = false;
    let postHasComments = false;

    db.getWallPostCommentsRepliesByPostId(postId)
        .then(({ rows: postReplies }) => {
            console.log("postReplies rows: ", postReplies);
            console.log("postReplies rows: ", postReplies.length);
            if (postReplies.length > 0) {
                postHasReplies = true;
            }

            db.getWallPostCommentsByPostId(postId)
                .then(({ rows: postComments }) => {
                    console.log("postComments rows: ", postComments);
                    console.log("postComments rows: ", postComments.length);
                    if (postComments.length > 0) {
                        postHasComments = true;
                    }

                    if (postHasReplies) {
                        // Delete replies
                        db.deleteAllWallPostCommentsRepliesByPostId(postId)
                            .then(({ rows }) => {
                                console.log(
                                    "replie(s) deleted: ",
                                    rows
                                );
                                // Delete comments
                                db.deleteWallPostCommentsByPostId(postId)
                                    .then(({ rows }) => {
                                        console.log(
                                            "comment(s) deleted: ",
                                            rows
                                        );
                                        res.json(rows);
                                        // Delete post
                                        db.deleteWallPostByPostId(postId)
                                            .then(({ rows }) => {
                                                console.log(
                                                    "post deleted: ",
                                                    rows
                                                );
                                                res.json(rows);
                                            })
                                            .catch((err) => {
                                                console.error(
                                                    "error in POST/post/delete db.deleteWallPostByPostId catch: ",
                                                    err
                                                );
                                                res.json({ error: true });
                                            });
                                    })
                                    .catch((err) => {
                                        console.error(
                                            "error in POST/post/delete db.deleteWallPostCommentsByPostId catch: ",
                                            err
                                        );
                                        res.json({ error: true });
                                    });
                            })
                            .catch((err) => {
                                console.error(
                                    "error in POST/post/delete db.deleteAllWallPostCommentsRepliesByPostId catch: ",
                                    err
                                );
                                res.json({ error: true });
                            });
                    } else if (postHasComments) {
                        // Delete comments
                        db.deleteWallPostCommentsByPostId(postId)
                            .then(({ rows }) => {
                                console.log(
                                    "comment(s) deleted: ",
                                    rows
                                );
                                // Delete post
                                db.deleteWallPostByPostId(postId)
                                    .then(({ rows }) => {
                                        console.log(
                                            "post deleted: ",
                                            rows
                                        );
                                        res.json(rows);
                                    })
                                    .catch((err) => {
                                        console.error(
                                            "error in POST/post/delete db.deleteWallPostByPostId catch: ",
                                            err
                                        );
                                        res.json({ error: true });
                                    });
                            })
                            .catch((err) => {
                                console.error(
                                    "error in POST/post/delete db.deleteWallPostCommentsByPostId catch: ",
                                    err
                                );
                                res.json({ error: true });
                            });
                    } else {
                        // Delete post
                        db.deleteWallPostByPostId(postId)
                            .then(({ rows }) => {
                                console.log("post deleted: ", rows);
                                res.json(rows);
                            })
                            .catch((err) => {
                                console.error(
                                    "error in POST/post/delete db.deleteWallPostByPostId catch: ",
                                    err
                                );
                                res.json({ error: true });
                            });
                    }
                })
                .catch((err) => {
                    console.error(
                        "error in POST/post/delete db.getWallPostCommentsByPostId catch: ",
                        err
                    );
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.error(
                "error in POST/post/delete db.getWallPostCommentsRepliesByPostId catch: ",
                err
            );
            res.json({ error: true });
        });
});

//app.get("/wall/post/comments/:id/:postid", (req, res) => {
app.get("/wall/post/comments/:id", (req, res) => {
    const userWallId = Number(req.params.id);

    db.getWallPostComments()
        .then(({ rows: firstRows }) => {
            //console.log("firstRows: ", firstRows.slice(0, 5));
            db.getWallPostCommentsUserId().then(({ rows: secondRows }) => {
                //console.log("secondRows: ", secondRows.slice(0, 5));

                let thirdRows = firstRows.map((item, i) =>
                    Object.assign({}, item, secondRows[i])
                );
                /* let thirdRows = [];

                for (let i = 0; i < firstRows.length; i++) {
                    thirdRows.push({
                        ...secondRows[i],
                        ...firstRows[i],
                    });
                } */
                //console.log("thirdRows: ", thirdRows.slice(0, 5));

                const newRows = thirdRows
                    .map((obj) => ({
                        userWallId: userWallId,
                        commentPostId: obj.post_id,
                        commentAuthorId: obj.author_id,
                        commentAuthorName: obj.first + " " + obj.last,
                        commentAuthorProfile_pic: obj.profile_pic,
                        commentId: obj.id,
                        comment: obj.comment,
                        commentTimeStamp:
                            "on " +
                            ("" + obj.created_at + "").substring(0, 15) +
                            " at " +
                            ("" + obj.created_at + "").substring(16, 24),
                        createdAtFromNow: moment(obj.created_at).fromNow(),
                        commentDateTime: obj.created_at,
                    }))
                    .reverse();
                //console.log("newRows: ", newRows.slice(0, 3));

                res.json(newRows);
            });
        })
        .catch((err) => {
            console.error(`error in GET db.getWallPostComments catch: `, err);
        });
});

app.post("/wall/post/comments", (req, res) => {
    const userWallId = req.body.id;
    const newComment = req.body.newWallPostComment;
    const authorId = req.session.userId;
    const postId = req.body.postId;

    db.addWallPostComment(userWallId, authorId, postId, newComment)
        .then(({ rows }) => {
            //console.log("POST new comment rows: ", rows);
            const newRows = rows.map((obj) => ({
                commentId: obj.id,
                commentPostId: obj.post_id,
                commentAuthorId: obj.author_id,
                comment: obj.comment,
                commentTimeStamp:
                    "on " +
                    ("" + obj.created_at + "").substring(0, 15) +
                    " at " +
                    ("" + obj.created_at + "").substring(16, 24),
                commentDateTime: obj.created_at,
            }));
            //console.log("POST new comment newRows: ", newRows);
            //res.json(newRows);

            db.getUserProfile(authorId)
                .then(({ rows }) => {
                    //console.log("rows: ", rows);
                    const finalRows = newRows.map((obj) => ({
                        ...obj,
                        commentAuthorName: rows[0].first + " " + rows[0].last,
                        commentAuthorProfile_pic: rows[0].profile_pic,
                    }));
                    //console.log("POST post comment finalRows: ", finalRows);
                    res.json(finalRows);
                })
                .catch((err) => {
                    console.error(
                        "error in POST/wall/post/comments db.getUserProfile catch: ",
                        err
                    );
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.error(`error in POST db.addWallPostComment catch: `, err);
            res.json({ error: true });
        });
});

app.post("/comment/delete", function (req, res) {
    const commentId = req.body.commentId;
    let commentHasReplies = false;

    db.getWallPostCommentsRepliesByCommentId(commentId)
        .then(({ rows }) => {
            //console.log("commentHasReplies rows: ", rows);
            if (rows.length > 0) {
                commentHasReplies = true;
            }

            if (commentHasReplies) {
                db.deleteAllWallPostCommentsRepliesByCommentId(commentId)
                    .then(({ rows }) => {
                        console.log(
                            "deleteAllWallPostCommentsRepliesByCommentId rows: ",
                            rows
                        );

                        db.deleteWallPostComment(commentId)
                            .then(({ rows }) => {
                                console.log("comment delte rows: ", rows);
                                res.json(rows);
                            })
                            .catch((err) => {
                                console.error(
                                    "error in POST/comment/delete db.deleteWallPostComment catch: ",
                                    err
                                );
                                res.json({ error: true });
                            });
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/comment/delete db.deleteAllWallPostCommentsRepliesByCommentId catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            } else {
                db.deleteWallPostComment(commentId)
                    .then(({ rows }) => {
                        console.log("comment delete rows: ", rows);
                        res.json(rows);
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/comment/delete db.deleteWallPostComment catch: ",
                            err
                        );
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.error(
                "error in POST/comment/delete db.getWallPostCommentsRepliesByCommentId catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.get("/wall/post/comments-replies/:id", (req, res) => {
    const userWallId = Number(req.params.id);

    db.getWallPostCommentsReplies()
        .then(({ rows: firstRows }) => {
            //console.log("firstRows: ", firstRows.slice(0, 5));
            db.getWallPostCommentsRepliesUserId().then(
                ({ rows: secondRows }) => {
                    //console.log("secondRows: ", secondRows.slice(0, 5));

                    let thirdRows = firstRows.map((item, i) =>
                        Object.assign({}, item, secondRows[i])
                    );
                    /* let thirdRows = [];
                    for (let i = 0; i < firstRows.length; i++) {
                        thirdRows.push({
                            ...secondRows[i],
                            ...firstRows[i],
                        });
                    } */
                    //console.log("thirdRows: ", thirdRows.slice(0, 5));

                    const newRows = thirdRows
                        .map((obj) => ({
                            userWallId: userWallId,
                            replyAuthorId: obj.author_id,
                            replyPostId: obj.post_id,
                            replyCommentId: obj.comment_id,
                            replyAuthorName: obj.first + " " + obj.last,
                            replyAuthorProfile_pic: obj.profile_pic,
                            replyId: obj.id,
                            reply: obj.reply,
                            replyTimeStamp:
                                "on " +
                                ("" + obj.created_at + "").substring(0, 15) +
                                " at " +
                                ("" + obj.created_at + "").substring(16, 24),
                            createdAtFromNow: moment(obj.created_at).fromNow(),
                            replyDateTime: obj.created_at,
                        }))
                        .reverse();
                    //console.log("newRows: ", newRows.slice(0, 3));
                    //console.log("GET comments-replies newRows.length: ", newRows.length);

                    res.json(newRows);
                }
            );
        })
        .catch((err) => {
            console.error(
                `error in GET db.getWallPostCommentsReplies catch: `,
                err
            );
        });
});

app.post("/wall/post/comments-replies", (req, res) => {
    const userWallId = req.body.userWallId;
    const newReply = req.body.newWallPostCommentReply;
    const authorId = req.session.userId;
    const postId = req.body.postId;
    const commentId = req.body.commentId;

    db.addWallPostCommentReply(
        userWallId,
        authorId,
        postId,
        commentId,
        newReply
    )
        .then(({ rows }) => {
            //console.log("POST new comment rows: ", rows);
            const newRows = rows.map((obj) => ({
                replyId: obj.id,
                replyCommentId: obj.comment_id,
                replyPostId: obj.post_id,
                replyAuthorId: obj.author_id,
                reply: obj.reply,
                replyTimeStamp:
                    "on " +
                    ("" + obj.created_at + "").substring(0, 15) +
                    " at " +
                    ("" + obj.created_at + "").substring(16, 24),
                replyDateTime: obj.created_at,
            }));
            //console.log("POST new comment reply newRows: ", newRows);
            //res.json(newRows);

            db.getUserProfile(authorId)
                .then(({ rows }) => {
                    //console.log("rows: ", rows);
                    const finalRows = newRows.map((obj) => ({
                        ...obj,
                        replyAuthorName: rows[0].first + " " + rows[0].last,
                        replyAuthorProfile_pic: rows[0].profile_pic,
                    }));
                    //console.log("POST post comment reply finalRows: ", finalRows);
                    res.json(finalRows);
                })
                .catch((err) => {
                    console.error(
                        "error in POST/wall/post/comments-replies db.getUserProfile catch: ",
                        err
                    );
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.error(
                `error in POST db.addWallPostCommentReply catch: `,
                err
            );
            res.json({ error: true });
        });
});

app.post("/comment-reply/delete", function (req, res) {
    const replyId = req.body.replyId;
    db.deleteWallPostCommentReply(replyId)
        .then(({ rows }) => {
            console.log("POST post comment reply delete rows: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.error(
                "error in POST/comment-reply/delete db.deleteWallPostCommentReply catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.get("/active/user/infos", (req, res) => {
    const activeUserId = req.session.userId;

    db.getUserProfile(activeUserId)
        .then(({ rows }) => {
            //console.log("rows[0]: ", rows[0]);
            res.json(rows);
        })
        .catch((err) => {
            console.error(
                "error in GET/active/user/infos db.getUserProfile catch: ",
                err
            );
            res.json({ error: true });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.sendStatus(200);
});

// NB: always at the end, after the other routes!
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        //NB: never comment this line of code out!!!
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

//app.listen(process.env.PORT || 3001, function () {
// in order for the socket messages to come through (:"server" instead of "app"):
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening..");
});

// ******************************** socket.io ******************************** \\
//server-side socket code all writeten down here:

let onlineUsersPlusOpenTabs = [];
let onlineUsers = []; // keeps track of all users currently online
let socketToIds = {};
let recipientOnlinePM = false;
let recipientIdPM;
let nameRequester;
//let createdAtFromNowPM;
let createdAtFromNowFR;

io.on("connection", (socket) => {
    // => event listener
    console.log(
        `socket with socket-id "${socket.id}" and userId "${socket.request.session.userId}" just connected!`
    );
    socketToIds[socket.id] = socket.request.session.userId;
    // NB: "socket.id" = not "user.id"
    // => it will be assigned from socket.io to every user
    // userId: that's the ID we assign to users when they register/login
    //      => (socket.request.session.userId)
    //console.log("socket-id: ", socket.id);
    //console.log("userId: ", socket.request.session.userId);
    const userId = socket.request.session.userId;

    if (!userId) {
        return socket.disconnect(true);
    }

    // add user who just connected (ie logged in)
    onlineUsersPlusOpenTabs.push(userId);
    //console.log("online Users / Open Tabs: ", onlineUsersPlusOpenTabs);

    // remove duplicate elements from the array
    onlineUsers = [...new Set(onlineUsersPlusOpenTabs)];

    db.getOnlineUsers(onlineUsers)
        .then(({ rows }) => {
            const newRows = rows.map((obj) => ({
                id: obj.id,
                name: obj.first + " " + obj.last,
                profile_pic: obj.profile_pic,
            }));
            //console.log("newRows: ", newRows);

            // sending to all connected users
            io.sockets.emit("online users", newRows);
        })
        .catch((err) => {
            console.error(
                `error in io.on("online users") db.getOnlineUsers catch: `,
                err
            );
        });

    // runs when a user disconnects - ie logs off or closes browser/tab
    socket.on("disconnect", () => {
        delete socketToIds[socket.id];
        const disconnectedUserOrTab = userId;
        //console.log("disconnected User Or Tab: ", disconnectedUserOrTab);

        //console.log("onlineUsersPlusOpenTabs B: ", onlineUsersPlusOpenTabs);
        const indexOfDisconnectedUserOrTab = onlineUsersPlusOpenTabs.indexOf(
            disconnectedUserOrTab
        );

        if (indexOfDisconnectedUserOrTab !== -1) {
            onlineUsersPlusOpenTabs.splice(indexOfDisconnectedUserOrTab, 1);
        }
        //console.log("onlineUsersPlusOpenTabs A: ", onlineUsersPlusOpenTabs);

        db.getOnlineUsers(onlineUsersPlusOpenTabs)
            .then(({ rows }) => {
                const newRows = rows.map((obj) => ({
                    id: obj.id,
                    name: obj.first + " " + obj.last,
                    profile_pic: obj.profile_pic,
                }));
                //console.log("newRows: ", newRows);

                io.sockets.emit("online users", newRows);
            })
            .catch((err) => {
                console.error(
                    `error in socket.on("disconnect") db.getOnlineUsers catch: `,
                    err
                );
            });
    });

    socket.on("notification friend request", (recipientId) => {
        db.getUserProfile(userId)
            .then(({ rows }) => {
                //console.log("notification/getUserProfile rows: ", rows);
                const name = rows[0].first + " " + rows[0].last;
                //console.log("notification/getUserProfile name: ", name);

                for (const key in socketToIds) {
                    if (socketToIds[key] == recipientId) {
                        io.sockets.sockets
                            .get(key)
                            .emit("notification friend request", {
                                senderId: socket.request.session.userId,
                                senderName: name,
                            });
                    }
                }
            })
            .catch((err) => {
                console.error(
                    `error in socket.on("notification friend requestq") db.getUserProfile catch: `,
                    err
                );
            });
    });

    socket.on("notification friend request revoked", (recipientId) => {
        db.getUserProfile(userId)
            .then(({ rows }) => {
                //console.log("notification/getUserProfile rows: ", rows);
                const name = rows[0].first + " " + rows[0].last;
                //console.log("notification/getUserProfile name: ", name);

                for (const key in socketToIds) {
                    if (socketToIds[key] == recipientId) {
                        io.sockets.sockets
                            .get(key)
                            .emit("notification friend request revoked", {
                                senderId: socket.request.session.userId,
                                senderName: name,
                            });
                    }
                }
            })
            .catch((err) => {
                console.error(
                    `error in socket.on("notification friend requestq revoked") db.getUserProfile catch: `,
                    err
                );
            });
    });

    db.getMostRecentMessages()
        .then(({ rows: firstRows }) => {
            //console.log("firstRows: ", firstRows.slice(0, 5));
            db.getChatMessageUserId().then(({ rows: secondRows }) => {
                //console.log("secondRows: ", secondRows.slice(0, 5));

                let thirdRows = firstRows.map((item, i) =>
                    Object.assign({}, item, secondRows[i])
                );
                /* let thirdRows = [];

                for (let i = 0; i < firstRows.length; i++) {
                    thirdRows.push({
                        ...secondRows[i],
                        ...firstRows[i],
                    });
                } */
                //console.log("thirdRows: ", thirdRows.slice(0, 5));

                const newRows = thirdRows.map((obj) => ({
                    senderId: obj.userid,
                    recipientId: userId,
                    chatMessageId: obj.id,
                    senderName: obj.first + " " + obj.last,
                    profile_pic: obj.profile_pic,
                    message: obj.message,
                    chatMessageDateTime:
                        "on " +
                        ("" + obj.created_at + "").substring(0, 15) +
                        " at " +
                        ("" + obj.created_at + "").substring(16, 24),
                    createdAtFromNow: moment(obj.created_at).fromNow(),
                }));
                //console.log("newRows: ", newRows.slice(0, 3));

                socket.emit("most recent chat messages", newRows);
            });
        })
        .catch((err) => {
            console.error(
                `error in [io.on] db.getMostRecentMessages catch: `,
                err
            );
        });

    //server-side socket code all written down here:
    socket.on("new chat message", (message) => {
        // message = e.target.value(chat.js/handlekeyDown)
        // this will run whenever user posts a new chat message (e.key === "Enter")
        // console.log("new message just written: ", message);
        // 1. INSERT new mesage into new "chat_messages" table
        db.insertNewMessage(userId, message)
            .then(({ rows }) => {
                const chatMessageId = rows[0].id;
                const created_atStringify = "" + rows[0].created_at + "";
                const createdAtFromNow = moment(rows[0].created_at).fromNow();

                const date = created_atStringify.substring(0, 15);
                const time = created_atStringify.substring(16, 24);
                const createdAt = "on " + date + " at " + time;
                //console.log("createdAt: ", createdAt); // on Mon Jan 18 2021 at 12:00:00
                db.getUserProfile(userId)
                    .then(({ rows }) => {
                        //console.log("getUserProfile rows: ", rows);
                        const senderName = rows[0].first + " " + rows[0].last;

                        // 2. emit a message back to the client
                        io.sockets.emit("new message and user profile", {
                            message,
                            chatMessageId,
                            profile_pic: rows[0].profile_pic,
                            senderName,
                            chatMessageDateTime: createdAt,
                            createdAtFromNow,
                        });

                        // sends a notification to all sockets EXCEPT your own
                        socket.broadcast.emit("notification new chat message", {
                            senderId: socket.request.session.userId,
                            senderName,
                        });
                    })
                    .catch((err) => {
                        console.error(
                            `error in socket.on("new chat message") db.getUserProfile catch: `,
                            err
                        );
                    });
            })
            .catch((err) => {
                console.error(
                    `error in socket.on("new chat message") db.insertNewMessage catch: `,
                    err
                );
            });
    });

    socket.on("delete chat message", async (chatMessageIdDateTime) => {
        //console.log("Server DELETE PM :", chatMessageIdDateTime);
        const chatMessageId = chatMessageIdDateTime.chatMessageId;
        const chatMessageDateTime = chatMessageIdDateTime.chatMessageDateTime;

        try {
            let results = await db.getUserProfile(userId);
            //console.log("ASYNC results: ", results);
            for (const rows in results) {
                if (rows == "rows") {
                    //console.log("rows :", results.rows[0].first);
                    nameRequester = results.rows[0].first;
                }
            }
        } catch (err) {
            console.error(
                `error in socket.on("delete private message") db.getUserProfile catch: `,
                err
            );
            socket.emit("notification general ERR", {
                senderName: nameRequester,
            });
        }

        if (chatMessageId) {
            db.deleteMessage(chatMessageId)
                .then(() => {
                    io.sockets.emit("delete chat message", {
                        chatMessageId,
                    });
                    socket.emit("notification delete chat message", {
                        senderName: nameRequester,
                        chatMessageDateTime,
                    });
                })
                .catch((err) => {
                    console.error(
                        "error in socket.on('delete chat message') db.deleteMessage catch: ",
                        err
                    );
                    socket.emit("notification general ERR", {
                        senderName: nameRequester,
                    });
                });
        } else {
            console.log(
                "Server DELETE PM: failed! 'chatMessageId' = undefined!"
            );

            socket.emit("notification ERR delete chat message", {
                senderName: nameRequester,
            });
        }
    });

    /* var users = {};
    users[userId] = socket.id;
    console.log("users: ", users); */
    /* console.log("onliners: ", onlineUsers);
    const myUserId = onlineUsers[0];
    const otherUserId = onlineUsers[1];
    console.log("myUserId: ", myUserId);
    console.log("otherUserId: ", otherUserId); */

    socket.on("get most recent private messages", (recipientId) => {
        recipientIdPM = recipientId;
        const senderIdPM = userId;
        console.log(
            "Server senderIdPM->recipientId: ",
            senderIdPM,
            recipientIdPM
        );
        db.getMostRecentPrivateMessages(senderIdPM, recipientIdPM)
            .then(({ rows }) => {
                //console.log("rows getMostRecentPrivateMessages: ", rows);

                const newRows = rows
                    .map((obj) => ({
                        privateMessageId: obj.id,
                        recipientIdPM,
                        senderIdPM,
                        senderNamePM: obj.first + " " + obj.last,
                        senderProfile_picPM: obj.profile_pic,
                        privateMessage: obj.message,
                        privateMessageDateTime:
                            "on " +
                            ("" + obj.created_at + "").substring(0, 15) +
                            " at " +
                            ("" + obj.created_at + "").substring(16, 24),
                        privateMessageDateTimeFromNow: moment(
                            obj.created_at
                        ).fromNow(),
                    }))
                    .reverse();
                //console.log("newRows: ", newRows);
                socket.emit("most recent private messages", newRows);

                // message to a specific socket
                /* for (const key in socketToIds) {
                    //console.log("key: ", key);
                    if (socketToIds[key] == recipientIdPM) {
                        io.sockets.sockets
                            .get(key)
                            .emit("most recent private messages", newRows);
                    }
                } */
            })
            .catch((err) => {
                console.error(
                    `error in [io.on] db.getMostRecentPrivateMessages catch: `,
                    err
                );
            });
    });

    socket.on("new private message", (message) => {
        const messagePM = message.message;
        const senderIdPM = userId;
        const recipientIdPM = message.recipientId;
        const newNotificationPM = message.newNotificationPM;
        db.insertNewPrivateMessage(senderIdPM, recipientIdPM, messagePM)
            .then(({ rows }) => {
                const created_atStringify = "" + rows[0].created_at + "";
                const date = created_atStringify.substring(0, 15);
                const time = created_atStringify.substring(16, 24);
                const createdAt = "on " + date + " at " + time;
                //const createdAtFromNow = moment(rows[0].created_at).fromNow();
                const messageId = Number(rows[0].id);

                //console.log("createdAt: ", createdAt); // on Mon Jan 18 2021 at 12:00:00
                /* const privateMessageId = rows[0].id;
                db.getNewPrivateMessageInfo(privateMessageId)
                    .then(({ rows }) => {
                        console.log("rows post getNewPrivateMessage: ", rows);

                        const newRows = rows
                            .map((obj) => ({
                                privateMessageId: obj.id,
                                recipientIdPM: Number(recipientIdPM),
                                senderIdPM,
                                senderNamePM: obj.first + " " + obj.last,
                                senderProfile_picPM: obj.profile_pic,
                                privateMessage: obj.message,
                                privateMessageDateTime:
                                    "on " +
                                    ("" + obj.created_at + "").substring(
                                        0,
                                        15
                                    ) +
                                    " at " +
                                    ("" + obj.created_at + "").substring(
                                        16,
                                        24
                                    ),
                            }))
                            .reverse();
                        console.log("newRows: ", newRows);

                        // message to a specific socket
                        for (const key in socketToIds) {
                            //console.log("key: ", key);
                            if (socketToIds[key] == recipientIdPM) {
                                io.sockets.emit(
                                    "new private message and users profiles",
                                    newRows[0]
                                );
                            }
                        }
                    })
                    .catch((err) => {
                        console.error(
                            "error in POST/message/private db.insertNewPrivateMessage catch: ",
                            err
                        );
                        //res.json({ error: true });
                    }); */

                db.getUserProfile(senderIdPM)
                    .then(({ rows }) => {
                        //console.log("getUserProfile rows: ", rows);
                        const name = rows[0].first + " " + rows[0].last;

                        // emit a message back to the client

                        /* io.sockets.emit(
                            "new private message and users profiles",
                            {
                                message,
                                id: rows[0].id,
                                profile_pic: rows[0].profile_pic,
                                name,
                                timestamp: createdAt,
                            }
                        ); */

                        //console.log("socket.id(senderIdPM): ", socket.id);

                        for (const key in socketToIds) {
                            /* console.log(
                                "socketToIds[key] == recipientIdPM: ",
                                key,
                                socketToIds[key],
                                recipientIdPM
                            ); */
                            if (socketToIds[key] == recipientIdPM) {
                                /* console.log(
                                    "new private message :",
                                    senderIdPM,
                                    recipientIdPM,
                                    message.message,
                                    messageId,
                                    createdAt,
                                    name,
                                    rows[0].profile_pic
                                ); */
                                recipientOnlinePM = true;
                                io.sockets.emit(
                                    "new private message and users profiles",
                                    {
                                        privateMessageId: messageId,
                                        privateMessage: message.message,
                                        recipientIdPM,
                                        senderProfile_picPM:
                                            rows[0].profile_pic,
                                        privateMessageDateTime: createdAt,
                                        senderIdPM,
                                        senderNamePM: name,
                                        privateMessageDateTimeFromNow: moment(
                                            rows[0].created_at
                                        ).fromNow(),
                                    }
                                );
                                // sends a notification to a specific socket
                                io.sockets.sockets
                                    .get(key)
                                    .emit(
                                        "notification new private chat message",
                                        {
                                            privateMessageId: messageId,
                                            senderIdPM:
                                                socket.request.session.userId,
                                            senderNamePM: name,
                                            privateMessageDateTimeFromNow: moment(
                                                rows[0].created_at
                                            ).fromNow(),
                                            senderProfile_picPM:
                                                rows[0].profile_pic,
                                            newNotificationPM,
                                        }
                                    );
                            } else if (recipientOnlinePM == false) {
                                /* console.log(
                                    "Info(recipientOnlinePM == false): recipient not online when PM sent: socket.emit()"
                                ); */
                                socket.emit(
                                    "new private message and users profiles",
                                    {
                                        privateMessageId: messageId,
                                        privateMessage: message.message,
                                        recipientIdPM,
                                        senderProfile_picPM:
                                            rows[0].profile_pic,
                                        privateMessageDateTime: createdAt,
                                        senderIdPM,
                                        senderNamePM: name,
                                    }
                                );
                            }
                        }

                        // message to a specific socket
                        /* for (const key in socketToIds) {
                            //console.log("key: ", key);
                            if (socketToIds[key] == recipientIdPM) {
                                io.sockets.sockets
                                    .get(key)
                                    .emit(
                                        "new private message and users profiles",
                                        {
                                            privateMessage: message.message,
                                            recipientIdPM,
                                            senderProfile_picPM:
                                                rows[0].profile_pic,
                                            privateMessageDateTime: createdAt,
                                            senderIdPM,
                                            senderNamePM: name,
                                        }
                                    );
                            }
                        } */

                        /* io.sockets.sockets
                            .get(socket.id)
                            .emit("new private message and user profile", {
                                message,
                                id: rows[0].id,
                                profile_pic: rows[0].profile_pic,
                                name,
                                timestamp: createdAt,
                            }); */

                        // sending to individual socketid (private message)
                        /* io.to(socket.id).emit(
                            "new private message and user profile",
                            {
                                message,
                                id: rows[0].id,
                                profile_pic: rows[0].profile_pic,
                                name,
                                timestamp: createdAt,
                            }
                        ); */
                    })
                    .catch((err) => {
                        console.error(
                            `error in socket.on("new chat message") db.getUserProfile catch: `,
                            err
                        );
                    });
            })
            .catch((err) => {
                console.error(
                    `error in socket.on("new private message") db.insertNewPrivateMessage catch: `,
                    err
                );
            });
    });

    socket.on(
        "get most recent notifications",
        async (recipientIdNotifications) => {
            try {
                // PM notifications
                db.getMostRecentPMNotifications(recipientIdNotifications)
                    .then(({ rows: firstRows }) => {
                        /* console.log(
                            "rows getMostRecentPrivateMessages: ",
                            firstRows.slice(0, 3)
                        ); */

                        db.getPrivateMessageUserId().then(
                            ({ rows: secondRows }) => {
                                //console.log("secondRows: ", secondRows.slice(0, 3));

                                /* let thirdRows = firstRows.map((item, i) =>
                                    Object.assign({}, item, secondRows[i])
                                ); */
                                let thirdRows = [];

                                for (let i = 0; i < firstRows.length; i++) {
                                    thirdRows.push({
                                        ...secondRows[i],
                                        ...firstRows[i],
                                    });
                                }
                                /* console.log(
                                    "thirdRows: ",
                                    thirdRows.slice(0, 3)
                                ); */

                                const mostRecentPMNotifications = thirdRows.map(
                                    (obj) => ({
                                        senderId: obj.userid,
                                        privateMessageId: obj.id,
                                        recipientId: recipientIdNotifications,
                                        senderNamePM:
                                            obj.first + " " + obj.last,
                                        senderProfile_picPM: obj.profile_pic,
                                        privateMessage: obj.message,
                                        privateMessageDateTime:
                                            "on " +
                                            (
                                                "" +
                                                obj.created_at +
                                                ""
                                            ).substring(0, 15) +
                                            " at " +
                                            (
                                                "" +
                                                obj.created_at +
                                                ""
                                            ).substring(16, 24),
                                        privateMessageDateTimeFromNow: moment(
                                            obj.created_at
                                        ).fromNow(),
                                    })
                                );
                                /* console.log(
                                    "newRows: ",
                                    mostRecentPMNotifications
                                ); */

                                for (const key in socketToIds) {
                                    //if (socketToIds[key] == recipientIdNotifications) {
                                    if (socketToIds[key] == recipientIdPM) {
                                        //console.log("ONLINE");
                                        recipientOnlinePM = true;
                                        io.sockets.emit(
                                            "most recent PM notifications",
                                            mostRecentPMNotifications
                                        );
                                        // sends a notification to a specific socket
                                        /* io.sockets.sockets
                                            .get(key)
                                            .emit(
                                                "most recent PM notifications",
                                                mostRecentPMNotifications
                                            ); */
                                    } else if (recipientOnlinePM == false) {
                                        /* console.log(
                                            "Info(recipientOnlinePM == false): recipient not online when PM sent: socket.emit()"
                                        ); */
                                        socket.emit(
                                            "most recent PM notifications",
                                            mostRecentPMNotifications
                                        );
                                    }
                                }
                                // message to a specific socket
                                /* for (const key in socketToIds) {
                                    //console.log("key: ", key);
                                    if (socketToIds[key] == recipientIdPM) {
                                        io.sockets.sockets
                                            .get(key)
                                            .emit(
                                                "most recent PM notifications",
                                                newRows
                                            );
                                    }
                                } */
                            }
                        );

                        // Frienship notifications
                        db.getFriendshipRequestNotifications(
                            recipientIdNotifications
                        )
                            .then(({ rows }) => {
                                if (rows[0]) {
                                    createdAtFromNowFR = moment(
                                        rows[0].created_at
                                    ).fromNow();
                                    if (rows[0].sender_id) {
                                        const senderIdFriendshipNotification =
                                            rows[0].sender_id;

                                        db.getUserProfile(
                                            senderIdFriendshipNotification
                                        ).then(({ rows }) => {
                                            io.sockets.emit(
                                                "most recent friendship notifications",
                                                {
                                                    senderIdFriendshipNotification,

                                                    senderProfile_picFriendshipNotification:
                                                        rows[0].profile_pic,
                                                    name:
                                                        rows[0].first +
                                                        " " +
                                                        rows[0].last,
                                                    friendshipRequestFromNow: createdAtFromNowFR,
                                                }
                                            );
                                        });
                                    } else {
                                        console.log(
                                            "no rows.sender_id getFriendshipRequestNotifications"
                                        );
                                    }
                                } else {
                                    console.log(
                                        "no rows getFriendshipRequestNotifications"
                                    );
                                }
                            })
                            .catch((err) => {
                                console.error(
                                    `error in socket.on db.getFriendshipRequestNotifications catch: `,
                                    err
                                );
                            });
                    })
                    .catch((err) => {
                        console.error(
                            `error in socket.on db.getMostRecentPrivateMessages catch: `,
                            err
                        );
                    });
            } catch (err) {
                console.error(
                    `error in socket.on("get most recent notifications") catch: `,
                    err
                );
            }
        }
    );

    socket.on("delete private message", async (privateMessageIdDateTime) => {
        //console.log("Server DELETE PM :", privateMessageIdDateTime);
        const privateMessageId = privateMessageIdDateTime.privateMessageId;
        const privateMessageDateTime =
            privateMessageIdDateTime.privateMessageDateTime;

        try {
            let results = await db.getUserProfile(userId);
            //console.log("ASYNC results: ", results);
            for (const rows in results) {
                if (rows == "rows") {
                    //console.log("rows :", results.rows[0].first);
                    nameRequester = results.rows[0].first;
                }
            }
        } catch (err) {
            console.error(
                `error in socket.on("delete private message") db.getUserProfile catch: `,
                err
            );
            socket.emit("notification general ERR", {
                senderNamePM: nameRequester,
            });
        }

        if (privateMessageId) {
            db.deletePrivateMessage(privateMessageId)
                .then(() => {
                    for (const key in socketToIds) {
                        if (socketToIds[key] == recipientIdPM) {
                            io.sockets.emit("delete private message", {
                                privateMessageId,
                            });
                            socket.emit("notification delete private message", {
                                senderNamePM: nameRequester,
                                privateMessageDateTime,
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.error(
                        "error in socket.on('delete private message') db.deletePrivateMessage catch: ",
                        err
                    );
                    socket.emit("notification general ERR", {
                        senderNamePM: nameRequester,
                    });
                });
        } else {
            console.log(
                "Server DELETE PM: failed! 'privateMessageId' = undefined!"
            );

            for (const key in socketToIds) {
                if (socketToIds[key] == recipientIdPM) {
                    socket.emit("notification ERR delete private message", {
                        senderNamePM: nameRequester,
                    });
                }
            }
        }
    });
}); // close io.on("connection")

/* 
// NB: this will work only when we connect to socket.io
io.on("connection", (socket) => {
    // "connection" = event; "socket" = callback (obj - connection client/server)
    console.log(`Socket with id: ${socket.id} has connected!`);

    //io && socket && (...)

    // data for socket.on("hello") on the client-side
    // sends a message to its own socket
    socket.emit("hello", {
        cohort: "Jasmine",
    });

    // sends a message to ALLL connected users
    io.emit("hello", {
        cohort: "Jasmine",
    });

    // sends a message to all sockets EXCEPT your own
    socket.broadcast.emit("hello", {
        cohort: "Jasmine",
    });

    // sends a message to a specific socket (think private messaging)
    io.sockets.sockets.get(socket.id).emit("hello", {
        cohort: "Jasmine",
    });

    // sends a message to every socket except 1
    io.sockets.sockets.get(socket.id).broadcast.emit("hello", {
        cohort: "Jasmine",
    });

    // we use 'on' to listen for incoming events / messages
    socket.on("another cool message", (data) => {
        console.log("data from cool msg: ", data);
    });

    socket.on("helloWorld clicked", (data) => {
        console.log(data);
    });

    // "disconnect" inside "connect", otherwise it won't know if someone is connected
    socket.on("disconnect", () => {
        console.log(`Socket with id: ${socket.id} just disconnected!`);
    });
});
 */
