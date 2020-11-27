const food = require('./food');
const account = require('./account');

const Router = require('express-promise-router');
const router = new Router();
module.exports = router;

router.use('/food', food);
router.use('/account', account);
