import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { LoadingButton } from '../UI/Button/Button';
import { Input } from '../UI/Input/Input';
import { useForm } from '../../hooks/useForm';
import { transactionSchema } from '../../utils/validationSchemas';

// Styled components (перенесены из AddTransaction.jsx)
const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Label = styled.label`
	font-weight: 600;
	color: #333;
	font-size: 14px;
`;

const ErrorMessage = styled.span`
	color: #dc3545;
	font-size: 14px;
	margin-top: 4px;
`;

const TypeToggle = styled.div`
	display: flex;
	border: 2px solid #e1e5e9;
	border-radius: 8px;
	overflow: hidden;
	background: white;
`;

const TypeButton = styled.button`
	flex: 1;
	padding: 12px 16px;
	border: none;
	background: ${props => (props.$active ? '#007bff' : 'transparent')};
	color: ${props => (props.$active ? 'white' : '#6c757d')};
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: ${props => (props.$active ? '#0056b3' : '#f8f9fa')};
	}
`;

const Select = styled.select`
	width: 100%;
	padding: 12px 16px;
	border: 2px solid #e1e5e9;
	border-radius: 8px;
	font-size: 16px;
	background: white;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}

	&:invalid {
		border-color: #dc3545;
	}
`;

const TextArea = styled.textarea`
	width: 100%;
	padding: 12px 16px;
	border: 2px solid #e1e5e9;
	border-radius: 8px;
	font-size: 16px;
	transition: all 0.2s ease;
	resize: vertical;
	min-height: 100px;
	font-family: inherit;

	&:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}
`;

const DateTimeRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;

	@media (max-width: 480px) {
		grid-template-columns: 1fr;
	}
`;

const TransactionForm = ({
	initialValues,
	onSubmit,
	submitText = 'Добавить транзакцию',
	isEditing = false,
	loading = false,
}) => {
	const accounts = useSelector(state =>
		Array.isArray(state.accounts.accounts) ? state.accounts.accounts : []
	);

	const categories = useSelector(state =>
		Array.isArray(state.categories.categories) ? state.categories.categories : []
	);

	const { loading: accountsLoading } = useSelector(state => state.accounts);
	const { loading: categoriesLoading } = useSelector(state => state.categories);

	const [transactionType, setTransactionType] = useState(initialValues?.type || 'expense');
	const [formErrors, setFormErrors] = useState({});

	// Фильтруем категории по типу транзакции
	const filteredCategories = categories.filter(
		category => category && category.type === transactionType
	);

	// Форматирование значения для формы
	const formatInitialValues = values => {
		if (!values) return null;

		// Если дата в формате ISO (приходит с сервера)
		if (values.date && values.date.includes('T')) {
			const dateObj = new Date(values.date);
			return {
				...values,
				date: dateObj.toISOString().split('T')[0],
				time: dateObj.toTimeString().slice(0, 5),
			};
		}
		return values;
	};

	const formattedInitialValues = formatInitialValues(initialValues) || {
		amount: '',
		type: 'expense',
		accountId: '',
		categoryId: '',
		description: '',
		date: new Date().toISOString().split('T')[0],
		time: new Date().toTimeString().slice(0, 5),
	};

	// Инициализируем тип транзакции из initialValues
	useEffect(() => {
		if (initialValues?.type) {
			setTransactionType(initialValues.type);
		}
	}, [initialValues]);

	// Обработчик отправки формы с Yup-валидацией
	const handleFormSubmit = async values => {
		try {
			// Валидация с Yup
			await transactionSchema.validate(values, { abortEarly: false });

			// Формируем данные для отправки
			const transactionData = {
				amount: parseFloat(values.amount),
				type: transactionType,
				accountId: values.accountId,
				categoryId: values.categoryId,
				description: values.description,
				date: new Date(`${values.date}T${values.time}`).toISOString(),
			};

			await onSubmit(transactionData);
			setFormErrors({});
		} catch (validationError) {
			if (validationError.name === 'ValidationError') {
				const errors = {};
				validationError.inner.forEach(error => {
					errors[error.path] = error.message;
				});
				setFormErrors(errors);
			} else {
				setFormErrors({ submit: validationError.message });
			}
			throw validationError;
		}
	};

	const { values, errors, touched, handleChange, handleBlur, handleSubmit, setErrors } = useForm(
		formattedInitialValues,
		handleFormSubmit
	);

	// Форматирование суммы (только числа, 2 знака после запятой)
	const handleAmountChange = value => {
		const cleanedValue = value.replace(/[^\d.]/g, '');
		const parts = cleanedValue.split('.');

		if (parts.length > 2) return;
		if (parts[1] && parts[1].length > 2) return;

		handleChange('amount', cleanedValue);
	};

	// Очищаем выбранную категорию при смене типа транзакции
	useEffect(() => {
		if (!isEditing) {
			handleChange('categoryId', '');
		}
	}, [transactionType]);

	// Объединяем ошибки из useForm и Yup
	const allErrors = { ...errors, ...formErrors };

	const isLoading = loading || accountsLoading || categoriesLoading;

	return (
		<Form onSubmit={handleSubmit}>
			{/* Переключатель типа транзакции */}
			<FormGroup>
				<Label>Тип операции</Label>
				<TypeToggle>
					<TypeButton
						type="button"
						$active={transactionType === 'expense'}
						onClick={() => setTransactionType('expense')}
					>
						Расходы
					</TypeButton>
					<TypeButton
						type="button"
						$active={transactionType === 'income'}
						onClick={() => setTransactionType('income')}
					>
						Доходы
					</TypeButton>
				</TypeToggle>
			</FormGroup>

			{/* Сумма */}
			<FormGroup>
				<Label htmlFor="amount">Сумма *</Label>
				<Input
					type="text"
					id="amount"
					name="amount"
					value={values.amount}
					onChange={e => handleAmountChange(e.target.value)}
					onBlur={() => handleBlur('amount')}
					placeholder="0.00"
					required
				/>
				{touched.amount && allErrors.amount && <ErrorMessage>{allErrors.amount}</ErrorMessage>}
			</FormGroup>

			{/* Счет */}
			<FormGroup>
				<Label htmlFor="accountId">Счет *</Label>
				<Select
					id="accountId"
					name="accountId"
					value={values.accountId}
					onChange={e => handleChange('accountId', e.target.value)}
					onBlur={() => handleBlur('accountId')}
					required
				>
					<option value="">Выберите счет</option>
					{accounts.map(account => (
						<option key={account._id || account.id} value={account._id || account.id}>
							{account.name} ({account.balance} {account.currency || '₽'})
						</option>
					))}
				</Select>
				{touched.accountId && allErrors.accountId && (
					<ErrorMessage>{allErrors.accountId}</ErrorMessage>
				)}
			</FormGroup>

			{/* Категория */}
			<FormGroup>
				<Label htmlFor="categoryId">Категория *</Label>
				<Select
					id="categoryId"
					name="categoryId"
					value={values.categoryId}
					onChange={e => handleChange('categoryId', e.target.value)}
					onBlur={() => handleBlur('categoryId')}
					required
				>
					<option value="">Выберите категорию</option>
					{filteredCategories.map(category => (
						<option key={category._id || category.id} value={category._id || category.id}>
							{category.name}
						</option>
					))}
				</Select>
				{touched.categoryId && allErrors.categoryId && (
					<ErrorMessage>{allErrors.categoryId}</ErrorMessage>
				)}
			</FormGroup>

			{/* Описание */}
			<FormGroup>
				<Label htmlFor="description">Описание</Label>
				<TextArea
					id="description"
					name="description"
					value={values.description}
					onChange={e => handleChange('description', e.target.value)}
					onBlur={() => handleBlur('description')}
					placeholder="Необязательное описание транзакции"
					maxLength="500"
				/>
				{allErrors.description && <ErrorMessage>{allErrors.description}</ErrorMessage>}
			</FormGroup>

			{/* Дата и время */}
			<DateTimeRow>
				<FormGroup>
					<Label htmlFor="date">Дата *</Label>
					<Input
						type="date"
						id="date"
						name="date"
						value={values.date}
						onChange={e => handleChange('date', e.target.value)}
						onBlur={() => handleBlur('date')}
						required
					/>
				</FormGroup>

				<FormGroup>
					<Label htmlFor="time">Время *</Label>
					<Input
						type="time"
						id="time"
						name="time"
						value={values.time}
						onChange={e => handleChange('time', e.target.value)}
						onBlur={() => handleBlur('time')}
						required
					/>
				</FormGroup>
			</DateTimeRow>

			{/* Общая ошибка */}
			{allErrors.submit && <ErrorMessage>{allErrors.submit}</ErrorMessage>}

			{/* Кнопка отправки */}
			<LoadingButton
				type="submit"
				loading={isLoading}
				$fullWidth
				disabled={accounts.length === 0 || filteredCategories.length === 0}
			>
				{submitText}
			</LoadingButton>

			{/* Сообщения о недоступности данных */}
			{accounts.length === 0 && !accountsLoading && (
				<ErrorMessage>
					Для {isEditing ? 'редактирования' : 'добавления'} транзакции необходимо создать хотя бы
					один счет
				</ErrorMessage>
			)}

			{filteredCategories.length === 0 && !categoriesLoading && (
				<ErrorMessage>
					Для {isEditing ? 'редактирования' : 'добавления'} транзакции необходимо создать категории{' '}
					{transactionType === 'expense' ? 'расходов' : 'доходов'}
				</ErrorMessage>
			)}
		</Form>
	);
};

export default TransactionForm;
