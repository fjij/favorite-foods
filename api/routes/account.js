const db = require('../db');
const Router = require('express-promise-router');

const router = new Router();

module.exports = router;

router.get('/:username', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { username } = req.params;
  const query = `SELECT food.name, food.emoji FROM
account JOIN likes ON account.uuid = likes.account_uuid
JOIN food ON likes.food_uuid = food.uuid
WHERE account.username = $1 OFFSET $2 LIMIT $3`
  const offset = (page - 1) * limit;
  const result = await db.query(query, [username, offset, limit]);
  res.json(result.rows);
});
