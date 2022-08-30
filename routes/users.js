const router = require('express').Router();

const {
  validateUserId,
  validateUpdateUserProfile,
} = require('../middlewares/validateRequests');

const {
  getMe,
  updateUserProfile,
} = require('../controllers/users');

router.get('/me', validateUserId, getMe);

router.patch('/me', validateUpdateUserProfile, updateUserProfile);

module.exports = router;
