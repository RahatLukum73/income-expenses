const User = require('../models/User');

// Получить данные текущего пользователя
const getCurrentUser = async (req, res) => {
	try {
		res.json({ error: null, user: req.user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Обновить профиль
const updateProfile = async (req, res) => {
	try {
		const { name, currency } = req.body;
		const updates = {};

		if (name) updates.name = name;
		if (currency) updates.currency = currency;

		const user = await User.findByIdAndUpdate(req.user._id, updates, {
			new: true,
			runValidators: true,
		});

		res.json({ error: null, user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Изменить валюту
const changeCurrency = async (req, res) => {
	try {
		const { currency } = req.body;

		if (!currency) {
			return res.status(400).json({ error: 'Валюта обязательна' });
		}

		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ currency },
			{ new: true, runValidators: true },
		);

		res.json({ error: null, user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Изменить пароль
const changePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({ error: 'Все поля обязательны' });
		}

		const user = await User.findById(req.user._id);
		const isCurrentPasswordValid = user.checkPassword(currentPassword);

		if (!isCurrentPasswordValid) {
			return res.status(401).json({ error: 'Текущий пароль неверен' });
		}

		user.password = newPassword;
		await user.save();

		res.json({ error: null, message: 'Пароль успешно изменен' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	getCurrentUser,
	updateProfile,
	changeCurrency,
	changePassword,
};
