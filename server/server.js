const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");

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
                    console.log("req.session.userId: ", req.session.userId);
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
