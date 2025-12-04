const Account = require('../models/Account');

// Получить все счета пользователя
const getAllAccounts = async (req, res) => {
	try {
		const accounts = await Account.find({ userId: req.user._id });
		res.json({ error: null, accounts });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Получить счет по ID
const getAccountById = async (req, res) => {
	try {
		const account = await Account.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!account) {
			return res.status(404).json({ error: 'Счет не найден' });
		}

		res.json({ error: null, account });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Создать новый счет
const createAccount = async (req, res) => {
	try {
		const { name, currency, color, icon, balance } = req.body;

		const account = new Account({
			name,
			balance,
			currency: currency || req.user.currency,
			color: color || '#3B82F6',
			icon: icon || 'wallet',
			userId: req.user._id,
		});

		await account.save();
		res.status(201).json({ error: null, account });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Обновить счет
const updateAccount = async (req, res) => {
	try {
		const { name, color, icon, balance } = req.body;

		const account = await Account.findOneAndUpdate(
			{ _id: req.params.id, userId: req.user._id },
			{ name, color, icon, balance },
			{ new: true, runValidators: true },
		);

		if (!account) {
			return res.status(404).json({ error: 'Счет не найден' });
		}

		res.json({ error: null, account });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Удалить счет
const deleteAccount = async (req, res) => {
	try {
		const Transaction = require('../models/Transaction');

		// Проверяем количество транзакций
		const transactionCount = await Transaction.countDocuments({
			accountId: req.params.id,
			userId: req.user._id,
		});

		if (transactionCount > 0) {
			return res.status(400).json({
				error: 'Нельзя удалить счет с транзакциями. Сначала удалите или переместите транзакции.',
				transactionCount,
			});
		}

		const account = await Account.findOneAndDelete({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!account) {
			return res.status(404).json({ error: 'Счет не найден' });
		}

		res.json({ error: null, message: 'Счет удален' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	getAllAccounts,
	getAccountById,
	createAccount,
	updateAccount,
	deleteAccount,
};
