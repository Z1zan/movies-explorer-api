const jwt = require('jsonwebtoken');

const AuthError = require('../errors/authError');

const secret = process.env;

function auth(req, res, next) {
  console.log(req.cookies);
  try {
    req.user = jwt.verify(
      req.cookies.jwt,
      secret.NODE_ENV === 'production'
        ? secret.JWT_SECRET
        : 'dev-secret',
    );
    next();
  } catch (err) {
    next(new AuthError('Нет доступа к данной странице'));
  }
}

module.exports = auth;
