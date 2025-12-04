const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Email обязателен'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Неверный формат email'],
		},
		passwordHash: {
			type: String,
			required: [true, 'Пароль обязателен'],
			minlength: [6, 'Пароль должен быть не менее 6 символов'],
		},
		name: {
			type: String,
			required: [true, 'Имя обязательно'],
			trim: true,
			maxlength: [50, 'Имя не должно превышать 50 символов'],
		},
		currency: {
			type: String,
			default: 'RUB',
			enum: ['RUB', 'USD', 'EUR', 'KZT'],
		},
	},
	{
		timestamps: true,
	},
);

// Виртуальное поле для пароля (не сохраняется в БД)
userSchema
	.virtual('password')
	.set(function (password) {
		this._password = password;
		this.passwordHash = bcrypt.hashSync(password, 12);
	})
	.get(function () {
		return this._password;
	});

// Метод для проверки пароля
userSchema.methods.checkPassword = function (password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

// Убираем passwordHash из JSON ответа
userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.passwordHash;
	return user;
};

module.exports = mongoose.model('User', userSchema);
