const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { MOVIE_NOT_FOUND_ERROR_MSG, FORBIDDEN_ERROR_MSG, SUCCESSFUL_MOVIE_DELETE_MSG } = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(201).send({ movie }))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(MOVIE_NOT_FOUND_ERROR_MSG));
      }
      if (movie.owner._id.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError(FORBIDDEN_ERROR_MSG));
      }
      return movie.remove()
        .then((deletedMovie) => {
          res.status(200).send({ data: deletedMovie, message: SUCCESSFUL_MOVIE_DELETE_MSG });
        });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
