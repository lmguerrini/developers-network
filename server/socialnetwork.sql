DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      profile_pic VARCHAR (255),
      bio VARCHAR (255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- SELECT * FROM users;
-- SELECT * FROM users WHERE id  = 1;
-- DELETE FROM users WHERE id  = 1;
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