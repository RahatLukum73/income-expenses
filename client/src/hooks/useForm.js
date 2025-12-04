import { useState } from 'react';

export const useForm = (initialValues, onSubmit) => {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const handleChange = (field, value) => {
		setValues(prev => ({
			...prev,
			[field]: value,
		}));

		// Убираем ошибку при изменении поля
		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: '',
			}));
		}
	};

	const handleBlur = field => {
		setTouched(prev => ({
			...prev,
			[field]: true,
		}));
	};

	const handleSubmit = async e => {
		e.preventDefault();

		// Помечаем все поля как touched для показа ошибок
		const allTouched = Object.keys(values).reduce((acc, key) => {
			acc[key] = true;
			return acc;
		}, {});
		setTouched(allTouched);

		return onSubmit(values);
	};

	const resetForm = () => {
		setValues(initialValues);
		setErrors({});
		setTouched({});
	};

	return {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		handleSubmit,
		resetForm,
		setErrors,
	};
};
