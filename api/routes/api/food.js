const db = require('../../db');
const Router = require('express-promise-router');
const router = new Router();
module.exports = router;

const popularFoods = `
(SELECT
  food.name AS name,
  food.emoji AS emoji,
  COUNT(likes.*) AS popularity
FROM
food LEFT JOIN likes on food.uuid = likes.food_uuid
GROUP BY food.uuid
ORDER BY COUNT(likes.*) DESC) AS popular_foods`;

router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const query = `SELECT * FROM ${popularFoods} OFFSET $1 LIMIT $2`;
  const offset = (page - 1) * limit;
  try{
    const result = await db.query(query, [offset, limit]);
    res.json(result.rows.map(row => ({
      name: row.name,
      emoji: row.emoji,
      popularity: parseInt(row.popularity),
    })));
  } catch(e) {
    console.error(e);
    res.status(500).send('server error');
  }
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const query = `SELECT * FROM ${popularFoods} WHERE name = $1`;
  try {
    const result = await db.query(query, [name]);
    if (result.rows[0]) {
      res.json({
        name: result.rows[0].name,
        emoji: result.rows[0].emoji,
        popularity: parseInt(result.rows[0].popularity),
      });
    } else {
      res.status(404).send();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('server error');
  }
});
