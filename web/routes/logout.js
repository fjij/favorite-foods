const Router = require('express-promise-router');
const router = new Router();
module.exports = router;

router.post('/', async (_, res) => {
  res.cookie('username', '').status(200).send();
});

