const food = require('./food');
const account = require('./account');

module.exports = app => {
  app.use('/food', food);
  app.use('/u', account);
};
