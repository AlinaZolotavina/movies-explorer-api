const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  updateUserProfile,
} = require('../controllers/users');

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

module.exports = router;
