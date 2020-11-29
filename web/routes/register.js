const db = require('../db');
const Router = require('express-promise-router');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const router = new Router();
module.exports = router;
const saltRounds = process.env.SALT_ROUNDS | 12;

router.post('/', [
  body('username')
    .isLength({min: 3, max: 24})
    .isAlphanumeric()
    .trim(),
  body('password')
    .isLength({min: 8, max: 24})
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { username, password } = req.body;
  const query = "INSERT INTO account (username, password_hash) VALUES ($1, $2)";
  const password_hash = await bcrypt.hash(password, saltRounds);
  try {
    const result = await db.query(query, [username, password_hash]);
    res.cookie('username', username, { signed: true }).status(200).send();
  } catch {
    res.status(409).json({ errors: [{
      "location": "body",
      msg: "Username already exists",
      param: "username"
    }]});
  }
});
