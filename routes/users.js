const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);

module.exports = router;
