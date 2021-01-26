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

// delet user
module.exports.deleteUserFromUsers = (id) => {
    const q = `DELETE FROM users WHERE id = ($1)
    RETURNING profile_pic`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteUserFromFriendships = (id) => {
    const q = `DELETE FROM friendships 
    WHERE (sender_id = ($1)) OR (recipient_id = ($1))`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteUserFromChatMessages = (id) => {
    const q = `DELETE FROM chat_messages 
    WHERE (user_id = ($1))`;
    const params = [id];
    return db.query(q, params);
};

// upload/delete profilePic
module.exports.getUserProfile = (id) => {
    const q = `SELECT * FROM users WHERE id = ($1)`;
    return db.query(q, [id]);
};

module.exports.updateProfilePic = (id, url) => {
    const q = `UPDATE users
    SET profile_pic = ($2) WHERE id = ($1)
    RETURNING profile_pic`;
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

// other profiles
module.exports.getOtherUserInfo = (id) => {
    const q = `SELECT * FROM users WHERE id = ($1)`;
    return db.query(q, [id]);
};

// find people
module.exports.getLatestUsers = () => {
    const q = `SELECT id, first, last, email, profile_pic, bio, created_at FROM users 
    ORDER BY created_at DESC LIMIT 3`;
    return db.query(q);
};

module.exports.getUsersPatternMatching = (val) => {
    const q = `SELECT id, first, last, email, profile_pic, bio, created_at FROM users 
    WHERE first ILIKE $1 OR last ILIKE $1 LIMIT 4`;
    const params = [val + "%"];
    return db.query(q, params);
};

// (un)friend request
module.exports.getFriendshipStatus = (senderId, recipientId) => {
    const q = `SELECT * FROM friendships 
    WHERE (sender_id = ($1) AND recipient_id = ($2))
    OR (sender_id = ($2) AND recipient_id = ($1))`;
    const params = [senderId, recipientId];
    return db.query(q, params);
};

module.exports.sendFriendshipRequest = (senderId, recipientId) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id, accepted)
    VALUES (($1), ($2), 'false')`;
    const params = [senderId, recipientId];
    return db.query(q, params);
};

module.exports.acceptFriendshipRequest = (senderId, recipientId) => {
    const q = `UPDATE friendships 
    SET accepted = true
    WHERE (sender_id = ($1) AND recipient_id = ($2))
    OR (sender_id = ($2) AND recipient_id = ($1))`;
    const params = [senderId, recipientId];
    return db.query(q, params);
};

module.exports.refuseFriendshipRequest = (senderId, recipientId) => {
    const q = `DELETE FROM friendships 
    WHERE (sender_id = ($1) AND recipient_id = ($2))`;
    const params = [senderId, recipientId];
    return db.query(q, params);
};

module.exports.deleteFriendship = (senderId, recipientId) => {
    const q = `DELETE FROM friendships 
    WHERE (sender_id = ($1) AND recipient_id = ($2))
    OR (sender_id = ($2) AND recipient_id = ($1))`;
    const params = [senderId, recipientId];
    return db.query(q, params);
};

// friends
module.exports.getFriendsWannabes = (id) => {
    const q = `SELECT users.id, users.first, users.last, users.profile_pic, friendships.accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [id];
    return db.query(q, params);
};

// chatroom
module.exports.insertNewMessage = (userId, message) => {
    const q = `INSERT INTO chat_messages (user_id, message)
    VALUES (($1), ($2)) RETURNING id, created_at;`;
    const params = [userId, message];
    return db.query(q, params);
};

module.exports.deleteMessage = (messageId) => {
    const q = `DELETE FROM chat_messages WHERE id = ($1)`;
    const params = [messageId];
    return db.query(q, params);
};

module.exports.getMostRecentMessages = () => {
    const q = `SELECT users.id, users.first, users.last, users.profile_pic, chat_messages.id, chat_messages.message, chat_messages.created_at
    FROM chat_messages
    JOIN users
    ON (chat_messages.user_id = users.id)
    ORDER BY chat_messages.created_at DESC
    LIMIT 25`;
    return db.query(q);
};

/* module.exports.getMostRecentMessages = (userId) => {
    const q = `SELECT users.id, users.first, users.last, users.profile_pic, chat_messages.id, chat_messages.message, chat_messages.created_at
    FROM chat_messages
    JOIN users
    ON (chat_messages.user_id = users.id)
    ORDER BY chat_messages.created_at DESC
    LIMIT 3`;
    const params = [userId];
    return db.query(q, params);
}; */

// online users
module.exports.getOnlineUsers = (arrayUsersByIds) => {
    const q = `SELECT id, first, last, profile_pic FROM users WHERE id = ANY($1)`;
    const params = [arrayUsersByIds];
    return db.query(q, params);
};

// private messages
module.exports.insertNewPrivateMessage = (senderId, recipientId, message) => {
    const q = `INSERT INTO private_messages (sender_id, recipient_id, message)
    VALUES (($1), ($2), ($3)) RETURNING *;`;
    const params = [senderId, recipientId, message];
    return db.query(q, params);
};

module.exports.getNewPrivateMessageInfo = (messageId) => {
    const q = `SELECT users.id, first, last, profile_pic, message, private_messages.id, private_messages.created_at
    FROM private_messages
    JOIN users
    ON (private_messages.sender_id = users.id)
    WHERE private_messages.id = ($1)`;
    const params = [messageId];
    return db.query(q, params);
};

module.exports.getMostRecentPrivateMessages = (senderId, recipientId) => {
    const q = `SELECT users.id, first, last, profile_pic, message, private_messages.id, private_messages.created_at
    FROM private_messages
    JOIN users
    ON (private_messages.sender_id = users.id)
    WHERE (sender_id = ($1) AND recipient_id = ($2))
    OR (sender_id = ($2) AND recipient_id = ($1))
    ORDER BY private_messages.created_at DESC
    LIMIT 15`;
    const params = [senderId, recipientId];
    return db.query(q, params);
};

// wall
module.exports.getWallPosts = (userId) => {
    const q = `SELECT * FROM wall WHERE user_id = ($1) ORDER BY created_at DESC`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.postWallPost = (userId, url, description) => {
    const q = `INSERT INTO wall (user_id, url, description) 
    VALUES (($1), ($2), ($3)) RETURNING *;`;
    const params = [userId, url, description];
    return db.query(q, params);
};


