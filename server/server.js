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
        console.log("First field empty!");
        res.json({
            success: false,
            error: "!(last)",
        });
    } else if (email == "" && first && last && password) {
        console.log("First field empty!");
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
The Social Network Services Team
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
        let result = await db.getUserProfile(id);
        //console.log("result: ", result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("error in GET/upload db.getUserProfile catch: ", err);
        res.json({ error: true });
    }
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    const id = req.session.userId;
    // we can construct the URL needed to be able to see our image
    const url = `${s3Url}${req.file.filename}`;
    if (req.file) {
        db.updateProfilePic(id, url)
            .then(() => {
                res.json({ error: false, profile_pic: url });
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
    const id = req.session.userId;
    const { draftBio } = req.body;
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

app.get("/other-user/info/:id", (req, res) => {
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
});

app.get("/users/latest", (req, res) => {
    db.getLatestUsers()
        .then(({ rows }) => {
            console.log("GET 3 last users: ", rows);
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
                "error in GET/friendship/rows/:id db.getFriendshipStatus catch: ",
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

io.on("connection", (socket) => {
    // => event listener
    console.log(
        `socket with socket-id "${socket.id}" and userId "${socket.request.session.userId}" just connected!`
    );
    // NB: "socket.id" = not "user.id"
    // => it will be assigned from socket.io to every user
    // userId: that's the ID we assign to users when they register/login
    //      => (socket.request.session.userId)
    // req.session does NOT work here, since we don't have a request object
    // NB: if in our POST registration/login we don't assign userId to req.session
    //      (i.e.: "req.session.user.id = 14". If so: "socket.request.session.user.id")
    //      then "socket.request.session.userId" won't work
    //      console.log("socket.request.session: ", socket.requet.session); // should be: "socket.request.session.userId"
    console.log("socket-id: ", socket.id);
    console.log("socket userId: ", socket.request.session.userId);
    const userId = socket.request.session.userId;

    //server-side socket code all written down here:
    socket.on("new chat message", (message) => {
        // message = e.target.value(chat.js/handlekeyDown)
        // this will run whenever user posts a new chat message (e.key === "Enter")
        //console.log("new message just written: ", message);
        // 1. INSERT new mesage into our new "chat_messages" table
        db.insertNewMessage(userId, message)
            .then(({ rows }) => {
                //const id = rows[0].id;

                const created_atStringify = "" + rows[0].created_at + "";
                const date = created_atStringify.substring(0, 15);
                const time = created_atStringify.substring(16, 24);
                const createdAt = "on " + date + " at " + time;
                //console.log("createdAt: ", createdAt); // on Mon Jan 18 2021 at 12:00:00

                db.getUserProfile(userId)
                    .then(({ rows }) => {
                        console.log("getUserProfile rows: ", rows);
                        const name = rows[0].first + " " + rows[0].last;

                        // 2. emit a message back to the client
                        // (what we have to emit back to the client is: message, profile_pic, name, id, timestamp)
                        io.sockets.emit("new message and user profile", {
                            message,
                            id: rows[0].id,
                            profile_pic: rows[0].profile_pic,
                            name,
                            timestamp: createdAt,
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

    // ["pseudo code"] for rendering the messages:
    // specifically... what we want to do is, when a new user logs in, we want to grab the 10 most
    // recent chat messages, put them in our global state, and then render them
    // so this means this code will ONLY run ONCE - when a new user connects
    // 1. retrieve the 10 most recent messages from the database
    // - we want to retrieve not only the 10 most recent messages, but info about the users who posted them
    // - this means we will need to do two queries (chat_messages and users) / one join
    db.getTenMostRecentMessages()
        .then(({ rows }) => {
            console.log("rows getTenMostRecentMessages: ", rows);
            console.log("userID: ", userId);

            const newRows = rows.map((obj) => ({
                senderId: userId,
                id: obj.id,
                name: obj.first + " " + obj.last,
                profile_pic: obj.profile_pic,
                message: obj.message,
                timestamp:
                    "on " +
                    ("" + obj.created_at + "").substring(0, 15) +
                    " at " +
                    ("" + obj.created_at + "").substring(16, 24),
            }));
            console.log("newRows: ", newRows);

            socket.emit("10 most recent messages", newRows);
        })
        .catch((err) => {
            console.error(
                `error in [io.on] db.getTenMostRecentMessages catch: `,
                err
            );
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
