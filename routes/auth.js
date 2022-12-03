const router = require('express').Router();
const { validateSignup, validateSignin } = require('../middlewares/validateRequests');
const { createUser, login, logout } = require('../controllers/users');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);
router.post('/signout', logout);

module.exports = router;
