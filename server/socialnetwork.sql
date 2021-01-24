DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS private_messages;

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
  recipient_id INT REFERENCES users(id) NOT NULL,
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
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL CHECK (message != '')
);

-- SELECT * FROM private_messages;
-- SELECT * FROM private_messages WHERE id  = 1;
-- DELETE FROM private_messages WHERE id  = 1;
-- DELETE * FROM private_messages;
-- INSERT INTO private_messages (sender_id, recipient_id, message) VALUES ('100', '101', 'message chat test 1') RETURNING id, created_at;
-- INSERT INTO private_messages (sender_id, recipient_id, message) VALUES ('101', '100', 'message chat test 2');