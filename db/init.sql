create extension if not exists "uuid-ossp";

CREATE TABLE account (
  account_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(24) UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL
);

CREATE TABLE food (
  food_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE account_food (
  account_uuid UUID NOT NULL,
  food_uuid UUID NOT NULL,
  PRIMARY KEY (account_uuid, food_uuid)
);

-- Mocking

INSERT INTO food (name) VALUES ('pizza');
INSERT INTO food (name) VALUES ('cheese whiz');
INSERT INTO food (name) VALUES ('pasta');
