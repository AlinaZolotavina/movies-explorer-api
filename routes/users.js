const router = require('express').Router();

const {
  validateUpdateUserProfile,
} = require('../middlewares/validateRequests');

const {
  getMe,
  updateUserProfile,
} = require('../controllers/users');

router.get('/users/me', getMe);

router.patch('/users/me', validateUpdateUserProfile, updateUserProfile);

module.exports = router;
