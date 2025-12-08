// models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Название счета обязательно'],
			trim: true,
			maxlength: [30, 'Название не должно превышать 30 символов'],
		},
		balance: {
			type: Number,
			default: 0,
			min: [0, 'Баланс не может быть отрицательным'],
		},
		currency: {
			type: String,
			default: 'RUB',
			enum: ['RUB', 'USD', 'EUR', 'KZT'],
		},
		color: {
			type: String,
			default: '#3B82F6',
			match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Неверный формат цвета'],
		},
		icon: {
			type: String,
			default: 'wallet',
			enum: ['wallet', 'credit-card', 'bank', 'cash', 'piggy-bank', 'mobile', 'savings', 'invest', 'loan'],
		},
		transactionCount: {
			type: Number,
			default: 0,
			min: [0, 'Количество транзакций не может быть отрицательным'],
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Account', accountSchema);
