const login = require('./login');
const logout = require('./logout');
const register = require('./register');
const api = require('./api');

module.exports = app => {
  app.use('/login', login);
  app.use('/logout', logout);
  app.use('/register', register);
  app.use('/api', api);
};
