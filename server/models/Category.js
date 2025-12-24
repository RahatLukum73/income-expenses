const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 30,
		},
		type: {
			type: String,
			required: true,
			enum: ['income', 'expense'],
		},
		color: {
			type: String,
			default: '#6B7280',
		},
		icon: {
			type: String,
			default: 'category',
		},
	},
	{
		timestamps: true,
	},
);

categorySchema.statics.defaultCategories = [

	{ name: 'Зарплата', type: 'income', color: '#10B981', icon: 'salary' },
	{ name: 'Фриланс', type: 'income', color: '#a6c9f6', icon: 'salary' },
	{ name: 'Инвестиции', type: 'income', color: '#009dd6', icon: 'investment' },
	{ name: 'Подарки', type: 'income', color: '#9370db', icon: 'gift' },
	{ name: 'Другой доход', type: 'income', color: '#fa873f', icon: 'other' },

	{ name: 'Продукты', type: 'expense', color: '#EF4444', icon: 'food' },
	{ name: 'Транспорт', type: 'expense', color: '#F59E0B', icon: 'car' },
	{ name: 'Жилье', type: 'expense', color: '#8B5CF6', icon: 'house' },
	{ name: 'Развлечения', type: 'expense', color: '#EC4899', icon: 'entertainment' },
	{ name: 'Здоровье', type: 'expense', color: '#06B6D4', icon: 'health' },
	{ name: 'Образование', type: 'expense', color: '#84CC16', icon: 'education' },
	{ name: 'Одежда', type: 'expense', color: '#F97316', icon: 'shopping' },
	{ name: 'Прочие расходы', type: 'expense', color: '#6B7280', icon: 'other' },
];

module.exports = mongoose.model('Category', categorySchema);
