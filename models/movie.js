const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const { IMAGE_BAD_URL_ERROR_MSG, TRAILER_BAD_URL_ERROR_MSG, POSTER_BAD_URL_ERROR_MSG } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isUrl(v);
      },
      message: IMAGE_BAD_URL_ERROR_MSG,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isUrl(v);
      },
      message: TRAILER_BAD_URL_ERROR_MSG,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isUrl(v);
      },
      message: POSTER_BAD_URL_ERROR_MSG,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
