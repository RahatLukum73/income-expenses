const express = require('express');
const { register, login, logout  } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.post('/register', async (req, res) => {
	try {
		const { email, password, name, currency } = req.body;
		const user = await register(email, password, name, currency);

		res.send({ erro: null, user });
	} catch (e) {
		res.send({ error: e.message || 'Unknown error' });
	}
});
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const { user, token } = await login(email, password);

		res
			.cookie('authToken', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 24 * 60 * 60 * 1000, // 1 день
			})
			.send({ error: null, user, token });
	} catch (e) {
		res.send({ error: e.message || 'Unknown error' });
	}
});
router.post('/logout', async (req, res) => {
	try {
		await logout(req);

		res.clearCookie('authToken');

		res.send({ error: null, message: 'Logged out successfully' });
	} catch (e) {
		res.send({ error: e.message || 'Unknown error' });
	}
});

module.exports = router;
