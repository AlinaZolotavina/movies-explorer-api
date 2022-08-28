const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', createMovie);

router.delete('/_id', deleteMovie);

module.exports = router;
