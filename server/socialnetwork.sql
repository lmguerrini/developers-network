DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS users_extra_infos;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS private_messages;
DROP TABLE IF EXISTS wall;
DROP TABLE IF EXISTS wall_comments;

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      --email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      profile_pic VARCHAR (255),
      bio VARCHAR (255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- SELECT * FROM users;
-- SELECT * FROM users WHERE id  = 1;
-- DELETE FROM users WHERE id  = 1;
-- UPDATE users SET profile_pic = null WHERE id  = 1;
-- DELETE * FROM users;

CREATE TABLE users_extra_infos(
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      location VARCHAR (255),
      education VARCHAR (255),
      skills VARCHAR (255),
      work VARCHAR (255),
      github VARCHAR (255),
      linkedin VARCHAR (255),
      languages VARCHAR (255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- SELECT * FROM users_extra_infos;
-- SELECT * FROM users_extra_infos WHERE id  = 1;
-- DELETE FROM users_extra_infos WHERE id  = 1;
-- UPDATE users_extra_infos SET location = null WHERE id  = 1;
-- DELETE * FROM users_extra_infos;


CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- SELECT * FROM reset_codes;
-- SELECT * FROM reset_codes WHERE id  = 1;
-- DELETE FROM reset_codes WHERE id  = 1;
-- DELETE * FROM reset_codes;

CREATE TABLE friendships(
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) NOT NULL,
  --sender_id INT REFERENCES users(id) NOT NULL ON DELETE CASCADE,
  recipient_id INT REFERENCES users(id) NOT NULL,
  --recipient_id INT REFERENCES users(id) NOT NULL ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted BOOLEAN DEFAULT false
);

-- SELECT * FROM friendships;
-- SELECT * FROM friendships WHERE id  = 1;
-- DELETE FROM friendships WHERE sender_id  = 1;
-- DELETE * FROM friendships;
-- CREATE UNIQUE INDEX ON friendships (least(sender_id, recipient_id), greatest(sender_id, recipient_id));
-- INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES ('100', '101', true);
-- INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES ('102', '103', false);

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    --user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL CHECK (message != '')
);

-- SELECT * FROM chat_messages;
-- SELECT * FROM chat_messages WHERE id  = 1;
-- DELETE FROM chat_messages WHERE id  = 1;
-- DELETE * FROM chat_messages;
-- INSERT INTO chat_messages (user_id, message) VALUES ('100', 'message chat test 1') RETURNING id, created_at;
-- INSERT INTO chat_messages (user_id, message) VALUES ('101', 'message chat test 2');

CREATE TABLE private_messages(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    --sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    --recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL CHECK (message != '')
);

-- SELECT * FROM private_messages;
-- SELECT * FROM private_messages WHERE id  = 1;
-- DELETE FROM private_messages WHERE id  = 1;
-- DELETE * FROM private_messages;
-- INSERT INTO private_messages (sender_id, recipient_id, message) VALUES ('100', '101', 'message chat test 1') RETURNING id, created_at;
-- INSERT INTO private_messages (sender_id, recipient_id, message) VALUES ('236', '221', 'message chat test 2');

CREATE TABLE wall(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url VARCHAR NOT NULL
);

-- SELECT * FROM wall;
-- SELECT * FROM wall WHERE id  = 1;
-- SELECT * FROM wall WHERE user_id  = 220;
-- DELETE FROM wall WHERE id  = 1; 'undefined'
-- DELETE * FROM wall;
-- INSERT INTO wall (user_id, url, description) VALUES ('236', 'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg', 'This photo brings back so many great memories.') RETURNING *;

CREATE TABLE wall_comments(
    id SERIAL PRIMARY KEY,
    user_wall_id INTEGER REFERENCES users(id),
    --user_wall_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    author_id INTEGER REFERENCES users(id),
    --author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    post_id INTEGER NOT NULL REFERENCES wall(id),
    --post_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL CHECK (comment != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SELECT * FROM wall_comments;
-- SELECT * FROM wall_comments WHERE id  = 1;
-- DELETE FROM wall_comments WHERE post_id  = 1;
-- DELETE * FROM wall_comments;
-- INSERT INTO wall_comments (user_wall_id, author_id, post_id, comment) VALUES ('220', '220', '104', 'comment test 1') RETURNING *;
-- INSERT INTO wall_comments (user_wall_id, author_id, post_id, comment) VALUES ('220', '220', '104', 'comment test 2') RETURNING id, created_at;
-- INSERT INTO wall_comments (user_wall_id, author_id, post_id, comment) VALUES ('220', '220', '105', 'comment test 1(105)') RETURNING *;

CREATE TABLE wall_comments_replies(
    id SERIAL PRIMARY KEY,
    user_wall_id INTEGER REFERENCES users(id),
    --user_wall_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    post_id INTEGER NOT NULL REFERENCES wall(id),
    --post_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id),
    --author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    comment_id INTEGER NOT NULL REFERENCES wall_comments(id),
    --post_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reply TEXT NOT NULL CHECK (reply != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SELECT * FROM wall_comments_replies;
-- SELECT * FROM wall_comments_replies WHERE id  = 1;
-- DELETE FROM wall_comments_replies WHERE post_id  = 1;
-- DELETE * FROM wall_comments_replies;
-- INSERT INTO wall_comments_replies (user_wall_id, author_id, post_id, comment_id, reply) VALUES ('220', '220', '106', 'reply test 1') RETURNING *;
-- INSERT INTO wall_comments_replies (user_wall_id, author_id, post_id, comment_id, reply) VALUES ('220', '11', '106', '62', 'reply test (220/11/106/62)') RETURNING *;