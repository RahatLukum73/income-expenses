// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
	{
		amount: {
			type: Number,
			required: [true, 'Сумма обязательна'],
			min: [0.01, 'Сумма должна быть больше 0'],
		},
		type: {
			type: String,
			required: true,
			enum: ['income', 'expense'],
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
		description: {
			type: String,
			trim: true,
			maxlength: [500, 'Описание не должно превышать 500 символов'],
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		accountId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

transactionSchema.index({ userId: 1, date: -1 });

transactionSchema.post('save', async function () {
	await updateAccountBalance(this.accountId);
	await updateTransactionCount(this.accountId);
});

transactionSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await updateAccountBalance(doc.accountId);
		await updateTransactionCount(doc.accountId);
	}
});

async function updateAccountBalance(accountId) {
	const Transaction = mongoose.model('Transaction');
	const Account = mongoose.model('Account');

	const result = await Transaction.aggregate([
		{ $match: { accountId: accountId } },
		{
			$group: {
				_id: '$type',
				total: { $sum: '$amount' },
			},
		},
	]);

	let income = 0;
	let expense = 0;

	result.forEach(item => {
		if (item._id === 'income') income = item.total;
		if (item._id === 'expense') expense = item.total;
	});

	const balance = income - expense;

	await Account.findByIdAndUpdate(accountId, { balance });
}

async function updateTransactionCount(accountId) {
	const Transaction = mongoose.model('Transaction');
	const Account = mongoose.model('Account');

	const transactionCount = await Transaction.countDocuments({
		accountId: accountId,
	});

	await Account.findByIdAndUpdate(accountId, { transactionCount });
}

transactionSchema.pre('save', async function (next) {
	const [user, account, category] = await Promise.all([
		mongoose.model('User').findById(this.userId),
		mongoose.model('Account').findById(this.accountId),
		mongoose.model('Category').findById(this.categoryId),
	]);

	if (!user) return next(new Error('Пользователь не найден'));
	if (!account) return next(new Error('Счет не найден'));
	if (!category) return next(new Error('Категория не найден'));
	if (account.userId.toString() !== this.userId.toString()) {
		return next(new Error('Счет принадлежит другому пользователю'));
	}
	if (category.userId && category.userId.toString() !== this.userId.toString()) {
		return next(new Error('Категория принадлежит другому пользователю'));
	}
	if (category.type !== this.type) {
		return next(new Error('Тип категории не соответствует типу транзакции'));
	}

	next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
