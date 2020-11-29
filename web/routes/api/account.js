const db = require('../../db');
const auth = require('../../auth');
const Router = require('express-promise-router');
const { body, validationResult } = require('express-validator');

const router = new Router();

module.exports = router;

router.get('/:username', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { username } = req.params;
  const checkQuery = 'SELECT COUNT(*) FROM account WHERE username = $1';
  const query = 
  `SELECT food.name, food.emoji FROM
  account JOIN likes ON account.uuid = likes.account_uuid
  JOIN food ON likes.food_uuid = food.uuid
  WHERE account.username = $1 ORDER BY likes.time DESC OFFSET $2 LIMIT $3`;
  const offset = (page - 1) * limit;
  try {
    const [result, checkResult] = await Promise.all([
      db.query(query, [username, offset, limit]),
      db.query(checkQuery, [username]),
    ]);
    if (parseInt(checkResult.rows[0].count) != 1) {
      return res.status(404).json({ error: "User not found"});
    } 
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Internal server error"});
  }
});

router.post('/', auth(), [
  body('name')
    .custom(value => {
      if (/^[a-zA-Z ]+$/.test(value)) {
        return true;
      }
      throw new Error('Invalid value');
    })
    .trim()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { name } = req.body;
  const username = req.username;
  const query = `INSERT INTO likes (account_uuid, food_uuid)
SELECT account.uuid, food.uuid FROM account JOIN food ON true
WHERE account.username=$1 AND food.name=$2`;
  try {
    await db.query(query, [username, name]);
    res.status(200).send('OK');
  } catch(e) {
    console.error(e);
    res.status(400).json({ errors: [{
      "location": "body",
      msg: "You already like this food",
      param: "name"
    }]});
  }
});
