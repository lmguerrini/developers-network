DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;

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


