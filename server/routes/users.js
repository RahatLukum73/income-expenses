const express = require('express');
const auth = require('../middlewares/auth');
const {
	getCurrentUser,
	updateProfile,
	changeCurrency,
	changePassword,
} = require('../controllers/userController');

const router = express.Router();

router.use(auth);

router.get('/me', getCurrentUser);
router.put('/me', updateProfile);
router.put('/currency', changeCurrency);
router.put('/password', changePassword);

module.exports = router;
