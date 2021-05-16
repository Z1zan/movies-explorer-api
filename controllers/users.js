const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const AuthError = require('../errors/authError');
const ExistingMailError = require('../errors/existingMailError');
const IncorrectValueError = require('../errors/incorrectValueError');
const NotFoundError = require('../errors/notFoundError');

const secret = process.env;

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectValueError('Переданы некорректные данные при получении информации об пользователе.'));
      }
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;

  User.findByIdAndUpdate(userId, { email, name })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotFoundError('Переданы некорректные данные при обновлении аватара.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new AuthError('Не заполнены все поля');
  }

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.send({
          _id: user._id,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new IncorrectValueError('Переданы некорректные данные при создании пользователя.'));
          } else if (err.name === "MongoError" && err.code === 11000) {
            next(new ExistingMailError('Данный email уже используется'));
          }
          next(err);
        });
    })
    .catch((err) => {
      if (err.message.includes('Illegal arguments')) {
        next(new IncorrectValueError('Не введён пароль'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new IncorrectValueError('Не заполнены все поля');
  }

  User.findOne({ email }).select('+password')
    .then(async (user) => {
      if (!user) {
        throw new AuthError('Неправильная почта или пароль');
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new AuthError('Неправильная почта или пароль');
      }
      console.log('user.id', user._id);
      const token = jwt.sign(
        {
          _id: user._id,
        },
        secret.NODE_ENV === 'production'
          ? secret.JWT_SECRET
          : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      console.log(token);
      return res.cookie(
        'jwt',
        token,
        {
          maxAge: 3600000,
          httpOnly: true,
          // sameSite: 'none',
          // secure: true,
        },
      ).send({ message: 'Аутентификация прошла успешно!' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectValueError('Введены не коректные данные'));
      }
      next(err);
    });
};

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход из учетной записи прошёл успешно!' });
};
