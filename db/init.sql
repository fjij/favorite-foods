create extension if not exists "uuid-ossp";

CREATE TABLE account (
  account_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(24) NOT NULL,
  password_hash VARCHAR(100) NOT NULL
);

CREATE TABLE food (
  food_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL
);

CREATE TABLE account_food (
  account_uuid UUID NOT NULL,
  food_uuid UUID NOT NULL,
  PRIMARY KEY (account_uuid, food_uuid)
);
