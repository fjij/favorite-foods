module.exports = () => {
  return async (req, res, next) => {
    const { username } = req.signedCookies;
    if (username) {
      req.username = username;
      next();
    } else {
      res.cookie('username', '').status(403).send();
    }
  };
}
