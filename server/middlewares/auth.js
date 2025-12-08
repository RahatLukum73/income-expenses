const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
	try {
		const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			console.log('❌ No token provided');
			throw new Error('No token provided');
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log('Decoded token:', decoded);
		const user = await User.findById(decoded.userId);

		if (!user) {
			throw new Error('User not found');
		}

		req.user = user;
		console.log('✅ Auth successful - user ID:', user._id);
		next();
	} catch (error) {
		console.error('❌ Auth error:', error.message);
		res.status(401).send({ error: 'Please authenticate' });
	}
};

module.exports = auth;
