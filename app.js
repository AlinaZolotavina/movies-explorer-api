const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./utils/corsOptions');
const router = require('./routes');
const { login, logout, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateSignup, validateSignin } = require('./middlewares/validateRequests');
const { NOT_FOUND_ERROR_MSG } = require('./utils/constants');
const rateLimiter = require('./middlewares/rateLimiter');

const {
  PORT,
  DB_URL,
} = require('./utils/config');

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(cors(corsOptions));

app.use(requestLogger);

app.use(helmet());

app.use(rateLimiter);

app.post('/signup', validateSignup, createUser);

app.post('/signin', validateSignin, login);

app.post('/signout', logout);

app.use(router);

app.use('*', () => {
  throw new NotFoundError(NOT_FOUND_ERROR_MSG);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
