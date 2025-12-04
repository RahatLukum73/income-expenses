const { generateToken } = require('../helpers/token');
const User = require('../models/User');

async function register(email, password, name, currency = 'RUB') {
	if (!password) {
		throw new Error('Password is empty');
	}
	if (!email) {
		throw new Error('Email is required');
	}
	if (!name) {
		throw new Error('Name is required');
	}
	const user = await User.create({ 
		email,
		password,
		name,
		currency
	});

	const token = generateToken(user._id);

	return { user, token };
}
//login

async function login(email, password) {
	if (!email || !password) {
		throw new Error('Email and password are required');
	}

	const user = await User.findOne({email})

		if (!user) {
		throw new Error('User not found');
	}

	const isPassword = user.checkPassword(password);
	if (!isPassword) {
		throw new Error('Invalid password');
	}

	const token = generateToken(user._id);

	return { user, token };
}
//logout

async function logout(req) {
	return Promise.resolve();
}

module.exports = {
	register,
	login,
	logout,
};
