const db = require('../db');

async function mockFood(food = [
  {name: 'pizza', emoji: '🍕️'},
  {name: 'cheese whiz', emoji: '🧀️'},
  {name: 'pasta', emoji: '🍝️'},
]) {
  await Promise.all(food.map(({name, emoji}) =>
    db.query("INSERT INTO food (name, emoji) VALUES ($1, $2)", [name, emoji])));
  return food;
}

async function mockAccounts(usernames = ['abc', 'def', 'ghi']) {
  await Promise.all(usernames.map(username => 
    db.query(
      `INSERT INTO account (username, password_hash) values ($1, 'password')`,
      [username]
    )
  ));
  return usernames;
}

async function mockLikes(likes = [
  {username: 'abc', name: 'pizza'},
  {username: 'def', name: 'pizza'},
  {username: 'ghi', name: 'pizza'},
  {username: 'abc', name: 'pasta'},
  {username: 'def', name: 'pasta'},
]) {
  await Promise.all(likes.map(({username, name}) => db.query(
`INSERT INTO likes (account_uuid, food_uuid)
SELECT account.uuid, food.uuid FROM account JOIN food ON true
WHERE account.username=$1 AND food.name=$2`, [username, name])));
  return likes;
}

module.exports = { mockFood, mockAccounts, mockLikes };
