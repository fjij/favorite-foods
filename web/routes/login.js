const db = require('../db');
const Router = require('express-promise-router');
const bcrypt = require('bcrypt');
const router = new Router();
module.exports = router;

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT password_hash FROM account WHERE username = $1";
  const result = await db.query(query, [username]);
  if (result.rows[0]) {
    const { password_hash } = result.rows[0];
    const match = await bcrypt.compare(password, password_hash);
    if (match) {
      res.cookie('username', username, { signed: true }).redirect('/');
    } else {
      res.status(401).send('incorrect username or password');
    }
  } else {
    res.status(401).send('incorrect username or password>');
  }
});
