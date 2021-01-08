const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

// registration
module.exports.addUser = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1 , $2, $3, $4) RETURNING id`;
    const params = [first, last, email, password];
    return db.query(q, params);
};

// login
module.exports.getUserInfo = (email) => {
    const q = `SELECT id, email, password FROM users WHERE email = ($1)`;
    return db.query(q, [email]);
};

// resetpsw
module.exports.checkUserByEmail = (email) => {
    const q = `SELECT id, email, password FROM users WHERE email = ($1)`;
    return db.query(q, [email]);
};

module.exports.addSecretCodeEmail = (email, code) => {
    const q = `INSERT INTO reset_codes (email, code)
    VALUES ($1 , $2) RETURNING *`;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.getCodeByEmail = () => {
    const q = `SELECT * FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`;
    return db.query(q);
};

module.exports.updatePassword = (password, email) => {
    const q = `UPDATE users
    SET password = ($1) WHERE email = ($2) RETURNING *`;
    const params = [password, email];
    return db.query(q, params);
};

// upload profilePic
module.exports.getUserProfile = (id) => {
    const q = `SELECT * FROM users WHERE id = ($1)`;
    return db.query(q, [id]);
};

module.exports.updateProfilePic = (id, url) => {
    const q = `UPDATE users
    SET profile_pic = ($2) WHERE id = ($1)`;
    const params = [id, url];
    return db.query(q, params);
};

// edit bio
module.exports.updateBio = (id, bio) => {
    const q = `UPDATE users
    SET bio = ($2) WHERE id = ($1) RETURNING id, bio`;
    const params = [id, bio];
    return db.query(q, params);
};
