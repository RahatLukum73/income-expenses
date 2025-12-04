// src/components/AccountForm/AccountForm.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input } from '../UI/Input/Input';
import { Button } from '../UI/Button/Button';
import ColorPicker from '../UI/ColorPicker/ColorPicker';
import IconPicker from '../UI/IconPicker/IconPicker';
import { Spinner } from '../UI/Spinner/Spinner';

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
	font-size: 14px;
	font-weight: 500;
	color: #495057;
`;

const ErrorMessage = styled.div`
	color: #dc3545;
	font-size: 14px;
	margin-top: 4px;
`;

const FormActions = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	margin-top: 20px;
`;

const CurrencySelect = styled.select`
	padding: 12px 16px;
	border: 1px solid #dee2e6;
	border-radius: 8px;
	font-size: 14px;
	color: #333;
	background: white;

	&:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}
`;

const BalanceInput = styled(Input)`
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	-moz-appearance: textfield;
`;

// Палитра цветов
const COLOR_PALETTE = [
	'#3B82F6', // blue
	'#10B981', // emerald
	'#F59E0B', // amber
	'#EF4444', // red
	'#8B5CF6', // violet
	'#EC4899', // pink
	'#14B8A6', // teal
	'#F97316', // orange
	'#6366F1', // indigo
	'#84CC16', // lime
];

// Доступные иконки
const AVAILABLE_ICONS = [
	'wallet',
	'credit-card',
	'bank',
	'cash',
	'piggy-bank',
	'mobile',
	'card',
	'savings',
	'invest',
	'loan',
];

// Валюты
const CURRENCIES = [
	{ value: 'RUB', label: 'Рубли (RUB)' },
	{ value: 'USD', label: 'Доллары (USD)' },
	{ value: 'EUR', label: 'Евро (EUR)' },
	{ value: 'KZT', label: 'Тенге (KZT)' },
];

const AccountForm = ({
	initialData = {},
	onSubmit,
	onCancel,
	submitText = 'Сохранить',
	loading = false,
}) => {
	const [formData, setFormData] = useState({
		name: '',
		balance: 0,
		currency: 'RUB',
		color: COLOR_PALETTE[0],
		icon: AVAILABLE_ICONS[0],
		...initialData,
	});

	const [errors, setErrors] = useState({});

	// Инициализация формы при изменении initialData
	useEffect(() => {
		if (initialData) {
			setFormData({
				name: '',
				balance: 0,
				currency: 'RUB',
				color: COLOR_PALETTE[0],
				icon: AVAILABLE_ICONS[0],
				...initialData,
			});
		}
	}, [initialData]);

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));

		// Очищаем ошибку при изменении поля
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Название счета обязательно';
		} else if (formData.name.trim().length > 30) {
			newErrors.name = 'Название не должно превышать 30 символов';
		}

		if (formData.balance < 0) {
			newErrors.balance = 'Баланс не может быть отрицательным';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = e => {
		e.preventDefault();

		if (validateForm()) {
			// Преобразуем баланс в число
			const dataToSubmit = {
				...formData,
				balance: parseFloat(formData.balance) || 0,
			};

			onSubmit(dataToSubmit);
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<FormGroup>
				<Label htmlFor="name">Название счета *</Label>
				<Input
					id="name"
					type="text"
					placeholder="Например: Основной счет"
					value={formData.name}
					onChange={e => handleChange('name', e.target.value)}
					disabled={loading}
				/>
				{errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
			</FormGroup>

			<FormGroup>
				<Label htmlFor="balance">Начальный баланс</Label>
				<BalanceInput
					id="balance"
					type="number"
					step="0.01"
					placeholder="0.00"
					value={formData.balance}
					onChange={e => handleChange('balance', e.target.value)}
					disabled={loading}
				/>
				{errors.balance && <ErrorMessage>{errors.balance}</ErrorMessage>}
			</FormGroup>

			<FormGroup>
				<Label htmlFor="currency">Валюта</Label>
				<CurrencySelect
					id="currency"
					value={formData.currency}
					onChange={e => handleChange('currency', e.target.value)}
					disabled={loading}
				>
					{CURRENCIES.map(currency => (
						<option key={currency.value} value={currency.value}>
							{currency.label}
						</option>
					))}
				</CurrencySelect>
			</FormGroup>

			<FormGroup>
				<Label>Цвет счета</Label>
				<ColorPicker
					colors={COLOR_PALETTE}
					selectedColor={formData.color}
					onChange={color => handleChange('color', color)}
				/>
			</FormGroup>

			<FormGroup>
				<Label>Иконка счета</Label>
				<IconPicker
					icons={AVAILABLE_ICONS}
					selectedIcon={formData.icon}
					onChange={icon => handleChange('icon', icon)}
				/>
			</FormGroup>

			<FormActions>
				<Button type="button" $variant="secondary" onClick={onCancel} disabled={loading}>
					Отмена
				</Button>
				<Button type="submit" disabled={loading}>
					{loading ? <Spinner size="small" /> : submitText}
				</Button>
			</FormActions>
		</Form>
	);
};

export default AccountForm;
