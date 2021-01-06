const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string"); // => generates the "secretCode"(=random string)

app.use(compression());

app.use(
    express.json({
        extended: false,
    })
);

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 6,
    })
);

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
    const { password } = req.body;
    hash(password)
        .then((hash) => {
            const { first, last, email } = req.body;
            db.addUser(first, last, email.toLowerCase(), hash)
                .then(({ rows }) => {
                    //console.log("rows: ", rows);
                    req.session.userId = rows[0].id;
                    //console.log("req.session.userId: ", req.session.userId);
                    res.json({ error: false });
                })
                .catch((err) => {
                    console.error("error in db.addUser catch: ", err);
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.error("error in hash POST /registration: ", err);
            res.json({ error: true });
        });
});

app.post("/login", (req, res) => {
    const { email } = req.body;
    db.getUserInfo(email)
        .then(({ rows }) => {
            if (rows.length > 0) {
                const { password } = req.body;
                compare(password, rows[0].password)
                    .then((result) => {
                        if (result) {
                            req.session.userId = rows[0].id;
                            res.json({
                                error: false,
                            });
                        } else {
                            res.json({
                                error: true,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(
                            "error in compare POST /login catch: ",
                            err
                        );
                        res.json({
                            error: true,
                        });
                    });
            } else {
                res.json({
                    error: false,
                });
            }
        })
        .catch((err) => {
            console.error("error in POST /login db.getUserInfo catch: ", err);
            res.json({
                error: true,
            });
        });
});

app.post("/reset/password", (req, res) => {
    console.log("post(/reset/password req.body: ", req.body);
    const { email } = req.body;
    db.checkUserByEmail(email)
        .then(({ rows }) => {
            //console.log("rows.length: ", rows.length);
            if (rows.length > 0) {
                // this is the code for generating the secretCode (=>random string)
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                //console.log("secretCode: ", secretCode);
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
    //console.log("post(/reset/password/verify req.body: ", req.body);
    const { code } = req.body;
    //console.log("codeEntered: ", code);
    db.getCodeByEmail(code)
        .then(({ rows }) => {
            //console.log("rows: ", rows);
            //console.log("code entered: ", rows.slice(-1)[0].code);
            const codeEntered = code;
            const codeSentByEmail = rows.slice(-1)[0].code;
            if (codeSentByEmail === codeEntered) {
                const { password } = req.body;
                hash(password)
                    .then((hash) => {
                        /* console.log(
                            "post(/reset/password/verify/hash email: ",
                            rows[0].email
                        ); */
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
                console.log("post(/reset/password/verify ELSE");
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

// NB: always at the end, after the other routes!
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        //NB: never comment this line of code out!!!
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening..");
});
