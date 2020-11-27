const db = require('../db');
const Router = require('express-promise-router');
const bcrypt = require('bcrypt');
const router = new Router();
module.exports = router;
const saltRounds = process.env.SALT_ROUNDS | 12;


router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  // TODO validate username and password
  next();
}, async (req, res) => {
  const { username, password } = req.body;
  const query = "INSERT INTO account (username, password_hash) VALUES ($1, $2)";
  const password_hash = await bcrypt.hash(password, saltRounds);
  try {
    const result = await db.query(query, [username, password_hash]);
    res.cookie('username', username, { signed: true }).redirect('/');
  } catch {
    res.status(409).send('account already exists');
  }
});
