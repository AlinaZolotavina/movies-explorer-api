const router = require('express').Router();

const {
  validateUpdateUserProfile,
} = require('../middlewares/validateRequests');

const {
  getMe,
  updateUserProfile,
} = require('../controllers/users');

router.get('/me', getMe);

router.patch('/me', validateUpdateUserProfile, updateUserProfile);

module.exports = router;
