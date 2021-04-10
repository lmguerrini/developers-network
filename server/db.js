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

// edit user
module.exports.editUser = (id, first, last, email) => {
    const q = `UPDATE users
    SET first = ($2), last = ($3), email = ($4) 
    WHERE id = ($1) RETURNING *`;
    const params = [id, first, last, email];
    return db.query(q, params);
};

module.exports.editUserPsw = (id, first, last, email, password) => {
    const q = `UPDATE users
    SET first = ($2), last = ($3), email = ($4), password = ($5) 
    WHERE id = ($1) RETURNING *`;
    const params = [id, first, last, email, password];
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

module.exports.deleteUserFromPrivateMessages = (id) => {
    const q = `DELETE FROM private_messages 
    WHERE (sender_id = ($1))`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteUserFromWall = (id) => {
    const q = `DELETE FROM wall 
    WHERE (user_id = ($1))`;
    const params = [id];
    return db.query(q, params);
};

// upload/delete profilePic
module.exports.getUserProfile = (id) => {
    const q = `SELECT * FROM users WHERE id = ($1)`;
    return db.query(q, [id]);
};

module.exports.getUserProfileExtraInfos = (id) => {
    const q = `SELECT location, education, skills, work, github, linkedin, languages
    FROM users_extra_infos WHERE user_id = ($1)`;
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

// edit extra profile infos

module.exports.insertLocation = (id, location) => {
    const q = `INSERT INTO users_extra_infos (user_id, location)
    VALUES (($1), ($2)) RETURNING id, user_id, location`;
    const params = [id, location];
    return db.query(q, params);
};
module.exports.updateLocation = (id, location) => {
    const q = `UPDATE users_extra_infos
    SET location = ($2) WHERE user_id = ($1) RETURNING id, user_id, location`;
    const params = [id, location];
    return db.query(q, params);
};

module.exports.insertEducation = (id, education) => {
    const q = `INSERT INTO users_extra_infos (user_id, education)
    VALUES (($1), ($2)) RETURNING id, user_id, education`;
    const params = [id, education];
    return db.query(q, params);
};
module.exports.updateEducation = (id, education) => {
    const q = `UPDATE users_extra_infos
    SET education = ($2) WHERE user_id = ($1) RETURNING id, user_id, education`;
    const params = [id, education];
    return db.query(q, params);
};

module.exports.insertSkills = (id, skills) => {
    const q = `INSERT INTO users_extra_infos (user_id, skills)
    VALUES (($1), ($2)) RETURNING id, user_id, skills`;
    const params = [id, skills];
    return db.query(q, params);
};
module.exports.updateSkills = (id, skills) => {
    const q = `UPDATE users_extra_infos
    SET skills = ($2) WHERE user_id = ($1) RETURNING id, user_id, skills`;
    const params = [id, skills];
    return db.query(q, params);
};

module.exports.insertWork = (id, work) => {
    const q = `INSERT INTO users_extra_infos (user_id, work)
    VALUES (($1), ($2)) RETURNING id, user_id, work`;
    const params = [id, work];
    return db.query(q, params);
};
module.exports.updateWork = (id, work) => {
    const q = `UPDATE users_extra_infos
    SET work = ($2) WHERE user_id = ($1) RETURNING id, user_id, work`;
    const params = [id, work];
    return db.query(q, params);
};

module.exports.insertGitHub = (id, gitHub) => {
    const q = `INSERT INTO users_extra_infos (user_id, github)
    VALUES (($1), ($2)) RETURNING id, user_id, github AS gitHub`;
    const params = [id, gitHub];
    return db.query(q, params);
};
module.exports.updateGitHub = (id, gitHub) => {
    const q = `UPDATE users_extra_infos
    SET github = ($2) WHERE user_id = ($1) RETURNING id, user_id, github AS gitHub`;
    const params = [id, gitHub];
    return db.query(q, params);
};

module.exports.insertLinkedIn = (id, linkedIn) => {
    const q = `INSERT INTO users_extra_infos (user_id, linkedin)
    VALUES (($1), ($2)) RETURNING id, user_id, linkedin AS linkedIn`;
    const params = [id, linkedIn];
    return db.query(q, params);
};
module.exports.updateLinkedIn = (id, linkedIn) => {
    const q = `UPDATE users_extra_infos
    SET linkedin = ($2) WHERE user_id = ($1) RETURNING id, user_id, linkedin AS linkedIn`;
    const params = [id, linkedIn];
    return db.query(q, params);
};

module.exports.insertLanguages = (id, languages) => {
    const q = `INSERT INTO users_extra_infos (user_id, languages)
    VALUES (($1), ($2)) RETURNING id, user_id, languages`;
    const params = [id, languages];
    return db.query(q, params);
};
module.exports.updateLanguages = (id, languages) => {
    const q = `UPDATE users_extra_infos
    SET languages = ($2) WHERE user_id = ($1) RETURNING id, user_id, languages`;
    const params = [id, languages];
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
    ORDER BY created_at DESC LIMIT 9`;
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

module.exports.getChatMessageUserId = () => {
    const q = `SELECT users.id as userid FROM users
    JOIN chat_messages
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

module.exports.deletePrivateMessage = (messageId) => {
    const q = `DELETE FROM private_messages WHERE id = ($1)`;
    const params = [messageId];
    return db.query(q, params);
};

/* module.exports.getNewPrivateMessageInfo = (messageId) => {
    const q = `SELECT users.id, first, last, profile_pic, message, private_messages.id, private_messages.created_at
    FROM private_messages
    JOIN users
    ON (private_messages.sender_id = users.id)
    WHERE private_messages.id = ($1)`;
    const params = [messageId];
    return db.query(q, params);
}; */

module.exports.getMostRecentPrivateMessages = (senderId, recipientId) => {
    const q = `SELECT users.id, first, last, profile_pic, message, private_messages.id, private_messages.created_at
    FROM private_messages
    JOIN users
    ON (private_messages.sender_id = users.id)
    WHERE (sender_id = ($1) AND recipient_id = ($2))
    OR (sender_id = ($2) AND recipient_id = ($1))
    ORDER BY private_messages.created_at DESC
    LIMIT 155`;
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

module.exports.getWallPostComments = () => {
    const q = `SELECT users.id, users.first, users.last, users.profile_pic, wall_comments.id, user_wall_id, author_id, post_id, comment, wall_comments.created_at
    FROM wall_comments
    JOIN users
    ON (wall_comments.author_id = users.id)
    ORDER BY wall_comments.created_at DESC
    LIMIT 155`;
    return db.query(q);
};
module.exports.getWallPostCommentsUserId = () => {
    const q = `SELECT users.id as userid FROM users
    JOIN wall_comments
    ON (wall_comments.user_wall_id = users.id)
    ORDER BY wall_comments.created_at DESC
    LIMIT 155`;
    return db.query(q);
};

module.exports.addWallPostComment = (userWallId, authorId, postId, comment) => {
    const q = `INSERT INTO wall_comments (user_wall_id, author_id, post_id, comment) 
    VALUES (($1), ($2), ($3), ($4)) RETURNING *;`;
    const params = [userWallId, authorId, postId, comment];
    return db.query(q, params);
};

module.exports.deleteWallPostComment = (commentId) => {
    const q = `DELETE FROM wall_comments WHERE id = ($1) RETURNING *;`;
    const params = [commentId];
    return db.query(q, params);
};

// notifications
module.exports.getMostRecentPMNotifications = (recipientId) => {
    const q = `SELECT users.id, first, last, profile_pic, message, private_messages.id, private_messages.created_at
    FROM private_messages
    JOIN users
    ON (private_messages.sender_id = users.id)
    WHERE (recipient_id = ($1))
    ORDER BY private_messages.created_at DESC
    LIMIT 15`;
    const params = [recipientId];
    return db.query(q, params);
};

module.exports.getPrivateMessageUserId = () => {
    const q = `SELECT users.id as userid FROM users
    JOIN private_messages
    ON (private_messages.sender_id = users.id)
    ORDER BY private_messages.created_at DESC
    LIMIT 15`;
    return db.query(q);
};

module.exports.getFriendshipRequestNotifications = (recipientId) => {
    const q = `SELECT * FROM friendships WHERE (recipient_id = ($1) AND accepted = ('false')) ORDER BY id DESC`;
    const params = [recipientId];
    return db.query(q, params);
};
