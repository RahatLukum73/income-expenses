// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Category = require('../models/Category');

const getAllTransactions = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 50;
		const skip = (page - 1) * limit;

		const query = { userId: req.user._id };

		// Фильтр по типу (income/expense)
		if (req.query.type) {
			query.type = req.query.type;
		}

		// Фильтр по дате
		if (req.query.startDate && req.query.endDate) {
			query.date = {
				$gte: new Date(req.query.startDate),
				$lte: new Date(req.query.endDate),
			};
		}

		//Фильтр по поиску в описании
		if (req.query.search) {
			query.description = { $regex: req.query.search, $options: 'i' };
		}

		// Фильтр по категориям (поддержка multiple)
		if (req.query.category) {
			const categories = req.query.category.split(',');
			if (categories.length === 1) {
				query.categoryId = categories[0];
			} else {
				query.categoryId = { $in: categories };
			}
		}

		// Фильтр по счетам (поддержка multiple)
		if (req.query.account) {
			const accounts = req.query.account.split(',');
			if (accounts.length === 1) {
				query.accountId = accounts[0];
			} else {
				query.accountId = { $in: accounts };
			}
		}

		const transactions = await Transaction.find(query)
			.populate('accountId', 'name currency')
			.populate('categoryId', 'name type color icon')
			.sort({ date: -1, createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Transaction.countDocuments(query);

		// Добавляем агрегацию для статистики
		const incomeStats = await Transaction.aggregate([
			{ $match: { ...query, type: 'income' } },
			{ $group: { _id: null, total: { $sum: '$amount' } } },
		]);

		const expenseStats = await Transaction.aggregate([
			{ $match: { ...query, type: 'expense' } },
			{ $group: { _id: null, total: { $sum: '$amount' } } },
		]);

		//Для диаграммы - группировка по категориям
		const categoryStats = await Transaction.aggregate([
			{ $match: query },
			{
				$group: {
					_id: '$categoryId',
					total: { $sum: '$amount' },
					count: { $sum: 1 },
				},
			},
			{ $sort: { total: -1 } },
		]);

		// Получаем информацию о категориях для диаграммы
		const categoriesWithStats = await Promise.all(
			categoryStats.map(async stat => {
				const category = await Category.findById(stat._id);
				return {
					categoryId: stat._id,
					categoryName: category ? category.name : 'Неизвестная категория',
					amount: stat.total,
					count: stat.count,
					color: category ? category.color : '#6c757d',
					icon: category ? category.icon : 'other',
				};
			}),
		);

		res.json({
			error: null,
			transactions,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
			// Добавляем статистику в ответ
			stats: {
				totalIncome: incomeStats[0]?.total || 0,
				totalExpenses: expenseStats[0]?.total || 0,
				categoryStats: categoriesWithStats,
			},
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Получить транзакцию по ID
const getTransactionById = async (req, res) => {
	try {
		const transaction = await Transaction.findOne({
			_id: req.params.id,
			userId: req.user._id,
		})
			.populate('accountId', 'name currency')
			.populate('categoryId', 'name type color icon');

		if (!transaction) {
			return res.status(404).json({ error: 'Транзакция не найдена' });
		}

		res.json({ error: null, transaction });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Создать новую транзакцию
const createTransaction = async (req, res) => {
	try {
		const { amount, type, date, description, accountId, categoryId } = req.body;

		// Проверяем существование счета и принадлежность пользователю
		const account = await Account.findOne({ _id: accountId, userId: req.user._id });
		if (!account) {
			return res.status(404).json({ error: 'Счет не найден' });
		}

		// Проверяем существование категории
		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({ error: 'Категория не найдена' });
		}

		// Проверяем соответствие типа категории и транзакции
		if (category.type !== type) {
			return res.status(400).json({ error: 'Тип категории не соответствует типу транзакции' });
		}

		const transaction = new Transaction({
			amount,
			type,
			date: date || new Date(),
			description,
			userId: req.user._id,
			accountId,
			categoryId,
		});

		await transaction.save();

		// Получаем свежие данные с populate
		const populatedTransaction = await Transaction.findById(transaction._id)
			.populate('accountId', 'name currency')
			.populate('categoryId', 'name type color icon');
		res.status(201).json({ error: null, transaction: populatedTransaction });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Обновить транзакцию
const updateTransaction = async (req, res) => {
	try {
		const { amount, type, date, description, accountId, categoryId } = req.body;

		// Проверяем существование транзакции и принадлежность пользователю
		const existingTransaction = await Transaction.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!existingTransaction) {
			return res.status(404).json({ error: 'Транзакция не найдена' });
		}

		// Если меняется счет, проверяем его существование и принадлежность
		if (accountId && accountId !== existingTransaction.accountId.toString()) {
			const account = await Account.findOne({ _id: accountId, userId: req.user._id });
			if (!account) {
				return res.status(404).json({ error: 'Счет не найден' });
			}
		}

		// Если меняется категория, проверяем ее существование
		if (categoryId) {
			const category = await Category.findById(categoryId);
			if (!category) {
				return res.status(404).json({ error: 'Категория не найдена' });
			}
			if (category.type !== (type || existingTransaction.type)) {
				return res.status(400).json({ error: 'Тип категории не соответствует типу транзакции' });
			}
		}

		const transaction = await Transaction.findOneAndUpdate(
			{ _id: req.params.id, userId: req.user._id },
			{ amount, type, date, description, accountId, categoryId },
			{ new: true, runValidators: true },
		)
			.populate('accountId', 'name currency')
			.populate('categoryId', 'name type color icon');

		res.json({ error: null, transaction });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Удалить транзакцию
const deleteTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOneAndDelete({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!transaction) {
			return res.status(404).json({ error: 'Транзакция не найдена' });
		}

		res.json({ error: null, message: 'Транзакция удалена' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Получить транзакции по счету
const getTransactionsByAccount = async (req, res) => {
	try {
		const { accountId } = req.params;

		// Проверяем что счет принадлежит пользователю
		const account = await Account.findOne({ _id: accountId, userId: req.user._id });
		if (!account) {
			return res.status(404).json({ error: 'Счет не найден' });
		}

		const transactions = await Transaction.find({
			accountId,
			userId: req.user._id,
		})
			.populate('accountId', 'name currency')
			.populate('categoryId', 'name type color icon')
			.sort({ date: -1 });

		res.json({ error: null, transactions });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Получить транзакции по категории
const getTransactionsByCategory = async (req, res) => {
	try {
		const { categoryId } = req.params;

		const transactions = await Transaction.find({
			categoryId,
			userId: req.user._id,
		})
			.populate('accountId', 'name currency')
			.populate('categoryId', 'name type color icon')
			.sort({ date: -1 });

		res.json({ error: null, transactions });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Последние транзакции (для дашборда)
const getRecentTransactions = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 50;

		const transactions = await Transaction.find({ userId: req.user._id })
			.populate('accountId', 'name currency')
			.populate('categoryId', 'name type color icon')
			.sort({ date: -1, createdAt: -1 })
			.limit(limit);

		res.json({ error: null, transactions });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	getAllTransactions,
	getTransactionById,
	createTransaction,
	updateTransaction,
	deleteTransaction,
	getTransactionsByAccount,
	getTransactionsByCategory,
	getRecentTransactions,
};
