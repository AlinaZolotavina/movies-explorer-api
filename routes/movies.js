const router = require('express').Router();

const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validateRequests');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', validateCreateMovie, createMovie);

router.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
