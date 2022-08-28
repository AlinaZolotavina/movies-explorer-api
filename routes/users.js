const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  updateUserProfile,
} = require('../controllers/users');

router.get('/me', getMe);

router.patch('/me', updateUserProfile);

module.exports = router;
