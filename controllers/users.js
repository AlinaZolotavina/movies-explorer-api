const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const User = require('../models/user');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoServerError' || err.code === 11000) {
        return next(new ConflictError('Пользователь с таким e-mail уже существует'));
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Введенные данные некорректны'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          // sameSite: 'none',
          // secure: true,
        })
        .send({ message: 'Вход выполнен' });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  const { email } = req.body;
  const token = req.cookies.jwt;

  if (!token) {
    return new UnauthorizedError('Что-то не так с токеном');
  }

  let verifiedUser;
  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', (err, decoded) => {
        if (err) {
          return next(new UnauthorizedError('Необходима авторизация'));
        }
        verifiedUser = decoded;
        if (user._id.toHexString() !== verifiedUser._id) {
          return next(new UnauthorizedError('Необходима авторизация'));
        }
        return res
          .clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          })
          .send({ message: 'Вы вышли' });
      });
      return true;
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send({ user, message: 'Профиль обновлен' });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  logout,
  getMe,
  updateUserProfile,
};
