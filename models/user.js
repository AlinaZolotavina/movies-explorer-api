const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/unauthorized-err');
const { BAD_EMAIL_ERROR_MSG, WRONG_EMAIL_OR_PASSWORD_ERROR_MSG } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: BAD_EMAIL_ERROR_MSG,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUSer(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD_ERROR_MSG);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD_ERROR_MSG);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
