const db = require('../db');
module.exports = () => {
  return async (req, res, next) => {
    const { username } = req.signedCookies;
    if (username) {
      req.username = username;
      next();
    } else {
      res.clearCookie('username').status(403).send();
    }
  };
}
