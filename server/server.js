const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");

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

app.use(express.static(path.join(__dirname, "..", "client", "public")));

// redirecting
// NB: this code will not work until you have the cookie sessione middleware
app.get("/welcome", (req, res) => {
    // if user is logged in
    if (req.session.userId) {
        // they shouldn't be allowed to see /welcome!!!!
        res.redirect("/");
    } else {
        // the user is allowed to see the welcome page!
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
                    console.log("rows: ", rows);
                    console.log("req.session.userId: ", req.session.userId);
                    req.session.userId = rows[0].id;
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

// always at the end, after the other routes!
app.get("*", function (req, res) {
    // if the user is not logged in
    if (!req.session.userId) {
        // send them away!
        res.redirect("/welcome");
    } else {
        // serve them the page they requested 
        //NB: never comment this line of code out!!!
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening..");
});
