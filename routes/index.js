const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth.js');
const routerUsers = require('./users.js');
const routerMovies = require('./movies.js');

const { createUser, login } = require('../controllers/users');

const NotFoundError = require('../errors/notFoundError');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser,
);

router.use('/users', auth, routerUsers);
router.use('/movies', auth, routerMovies);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
