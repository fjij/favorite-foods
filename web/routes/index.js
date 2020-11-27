const login = require('./login');
const register = require('./register');
const api = require('./api');

module.exports = app => {
  app.use('/login', login);
  app.use('/register', register);
  app.use('/api', api);
};
