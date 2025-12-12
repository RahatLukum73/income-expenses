import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../UI/Input/Input';
import { Button } from '../UI/Button/Button';
import { Spinner } from '../UI/Spinner/Spinner';
import ColorPicker from '../UI/ColorPicker/ColorPicker';
import IconPicker from '../UI/IconPicker/IconPicker';
import styled from 'styled-components';

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
	justify-content: center;
	margin-top: 20px;
`;

const CurrencySelect = styled.select`
	padding: 12px 16px;
	border: 1px solid #e1e1e1;
	border-radius: 8px;
	font-size: 14px;
	color: #e1e1e1;
	background: #7b7b7b;

	&:focus {
		outline: none;
		border-color: #565656;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}
`;

const BalanceInput = styled(Input)`
	color: #e1e1e1;
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	-moz-appearance: textfield;
`;

const COLOR_PALETTE = [
	'#3B82F6',
	'#10B981',
	'#F59E0B',
	'#EF4444',
	'#8B5CF6',
	'#EC4899',
	'#14B8A6',
	'#F97316',
	'#6366F1',
	'#84CC16',
];

const AVAILABLE_ICONS = [
	'wallet',
	'credit-card',
	'bank',
	'cash',
	'piggy-bank',
	'mobile',
	'savings',
	'invest',
	'loan',
];

const CURRENCIES = [
	{ value: 'RUB', label: 'Рубли (RUB)' },
	{ value: 'USD', label: 'Доллары (USD)' },
	{ value: 'EUR', label: 'Евро (EUR)' },
	{ value: 'KZT', label: 'Тенге (KZT)' },
];

const AccountForm = ({ initialData = {}, onSubmit, submitText = 'Сохранить', loading = false }) => {
	const [formData, setFormData] = useState({
		name: '',
		balance: 0,
		currency: 'RUB',
		color: COLOR_PALETTE[0],
		icon: AVAILABLE_ICONS[0],
		...initialData,
	});

	const [errors, setErrors] = useState({});

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
		console.log(`AccountForm: handleChange - ${field} = ${value}`);
		setFormData(prev => ({ ...prev, [field]: value }));

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
		console.log('AccountForm: handleSubmit called');

		if (validateForm()) {
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
				<Button type="submit" disabled={loading}>
					{loading ? <Spinner size="small" /> : submitText}
				</Button>
			</FormActions>
		</Form>
	);
};

AccountForm.propTypes = {
	initialData: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	submitText: PropTypes.string,
	loading: PropTypes.bool,
};

export default AccountForm;
