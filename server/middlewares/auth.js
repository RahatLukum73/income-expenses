const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
	try {
		const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			throw new Error('No token provided');
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId);

		if (!user) {
			throw new Error('User not found');
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401).send({ error: 'Please authenticate' });
	}
};

module.exports = auth;
