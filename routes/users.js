const router = require('express').Router();

const {
  getUserInfo,
  signOut,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.delete('/signout', signOut);

module.exports = router;
