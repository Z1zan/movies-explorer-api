const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserInfo,
  updateUserInfo,
  signOut,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.post(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUserInfo,
);
router.delete('/signout', signOut);

module.exports = router;
