import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LoadingButton, Button } from '../UI/Button/Button';
import { Input } from '../UI/Input/Input';
import { useForm } from '../../hooks/useForm';
import { transactionSchema } from '../../utils/validationSchemas';
import styled from 'styled-components';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 20px;
	background: #b5b8b1;
	border-radius: 10px;
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
	gap: 10px;
`;

const ToggleButton = styled(Button)`
	flex: 1;
	padding: 12px;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
	border: none;
	font-weight: 600;
	transition: all 0.3s ease;

	background: ${props => {
		if (!props.$active) return '#adadad';
		return props.$type === 'expense' ? '#dc3545' : '#28a745';
	}};

	color: ${props => {
		if (!props.$active) return 'white';
		return props.$type === 'expense' ? '#ffebee' : '#e8f5e9';
	}};

	&:hover {
		background: ${props => {
			if (!props.$active) return '#8b8b8b';
			return props.$type === 'expense' ? '#c82333' : '#218838';
		}};

		color: ${props => {
			if (!props.$active) return 'white';
			return props.$type === 'expense' ? '#ffcdd2' : '#c8e6c9';
		}};
		transform: translateY(-1px);
	}
`;

const Select = styled.select`
	width: 100%;
	padding: 12px 16px;
	border-radius: 8px;
	font-size: 16px;
	background: #7b7b7b;
	color: #e1e1e1;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
	}

	&:invalid {
		border-color: #565656;
	}
`;

const TextArea = styled.textarea`
	width: 100%;
	background: #7b7b7b;
	color: #e1e1e1;
	padding: 12px 16px;
	border-radius: 8px;
	font-size: 16px;
	transition: all 0.2s ease;
	resize: vertical;
	min-height: 100px;
	font-family: inherit;

	&::placeholder {
		color: #cccccc;
		opacity: 1;
		font-style: italic;
	}

	&:focus {
		outline: none;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
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

	const filteredCategories = categories.filter(
		category => category && category.type === transactionType
	);

	const formatInitialValues = values => {
		if (!values) return null;

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

	useEffect(() => {
		if (initialValues?.type) {
			setTransactionType(initialValues.type);
		}
	}, [initialValues]);

	const handleFormSubmit = async values => {
		try {
			await transactionSchema.validate(values, { abortEarly: false });

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

	const handleAmountChange = value => {
		const cleanedValue = value.replace(/[^\d.]/g, '');
		const parts = cleanedValue.split('.');

		if (parts.length > 2) return;
		if (parts[1] && parts[1].length > 2) return;

		handleChange('amount', cleanedValue);
	};

	useEffect(() => {
		if (!isEditing) {
			handleChange('categoryId', '');
		}
	}, [transactionType]);

	const allErrors = { ...errors, ...formErrors };

	const isLoading = loading || accountsLoading || categoriesLoading;

	return (
		<Form onSubmit={handleSubmit}>
			<FormGroup>
				<Label>Тип операции</Label>
				<TypeToggle>
					<ToggleButton
						type="button"
						$active={transactionType === 'expense'}
						$type="expense"
						onClick={() => setTransactionType('expense')}
					>
						Расходы
					</ToggleButton>
					<ToggleButton
						type="button"
						$active={transactionType === 'income'}
						$type="income"
						onClick={() => setTransactionType('income')}
					>
						Доходы
					</ToggleButton>
				</TypeToggle>
			</FormGroup>

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
						style={{color: '#111'}}
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
						style={{color: '#111'}}
						required
					/>
				</FormGroup>
			</DateTimeRow>

			{allErrors.submit && <ErrorMessage>{allErrors.submit}</ErrorMessage>}

			<LoadingButton
				type="submit"
				loading={isLoading}
				$fullWidth
				disabled={accounts.length === 0 || filteredCategories.length === 0}
			>
				{submitText}
			</LoadingButton>

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

TransactionForm.propTypes = {
	initialValues: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	submitText: PropTypes.string,
	isEditing: PropTypes.bool,
	loading: PropTypes.bool,
};

export default TransactionForm;
