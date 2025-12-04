import * as yup from 'yup';

export const registerSchema = yup.object({
	name: yup
		.string()
		.required('Имя обязательно для заполнения')
		.max(50, 'Имя не должно превышать 50 символов'),
	email: yup.string().required('Email обязателен для заполнения').email('Введите корректный email'),
	password: yup
		.string()
		.required('Пароль обязателен для заполнения')
		.min(6, 'Пароль должен содержать минимум 6 символов'),
	confirmPassword: yup
		.string()
		.required('Подтверждение пароля обязательно')
		.oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
});

export const loginSchema = yup.object({
	email: yup.string().required('Email обязателен для заполнения').email('Введите корректный email'),
	password: yup.string().required('Пароль обязателен для заполнения'),
});

export const transactionSchema = yup.object({
	amount: yup
		.number()
		.typeError('Сумма должна быть числом')
		.positive('Сумма должна быть больше 0')
		.required('Сумма обязательна для заполнения'),
	type: yup
		.string()
		.oneOf(['income', 'expense'], 'Неверный тип операции')
		.required('Тип операции обязателен'),
	accountId: yup.string().required('Счет обязателен для заполнения'),
	categoryId: yup.string().required('Категория обязательна для заполнения'),
	description: yup.string().max(500, 'Описание не должно превышать 500 символов'),
	date: yup.string().required('Дата обязательна для заполнения'),
	time: yup.string().required('Время обязательно для заполнения'),
});
