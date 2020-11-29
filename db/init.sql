create extension if not exists "uuid-ossp";

CREATE TABLE account (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE food (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  emoji TEXT
);

CREATE TABLE likes (
  account_uuid UUID NOT NULL,
  food_uuid UUID NOT NULL,
  time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_uuid, food_uuid)
);
