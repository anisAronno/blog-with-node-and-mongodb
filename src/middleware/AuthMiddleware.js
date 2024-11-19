const AuthMiddleware = {
  validateApiKey(req, res, next) {
    // implement general authentication with API key

    next();
  },
};

module.exports = AuthMiddleware;
