import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LoadingButton, Button } from '../components/UI/Button/Button';
import { Input } from '../components/UI/Input/Input';
import Modal from '../components/UI/Modal/Modal';
import { updateUserProfile, changePassword } from '../store/actions/authActions';
import { useForm } from '../hooks/useForm';

const ProfileContainer = styled.div`
	max-width: 600px;
	margin: 0 auto;
	padding: 24px;
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 32px;
`;

const BackButton = styled.button`
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	margin-right: 16px;
	color: #007bff;
	padding: 4px;
	border-radius: 4px;

	&:hover {
		background: rgba(0, 123, 255, 0.1);
	}
`;

const Title = styled.h1`
	margin: 0;
	color: #333;
	font-size: 28px;
`;

const ProfileCard = styled.div`
	background: white;
	border-radius: 12px;
	padding: 32px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FieldGroup = styled.div`
	margin-bottom: 24px;
	padding-bottom: 24px;
	border-bottom: 1px solid #e9ecef;

	&:last-child {
		border-bottom: none;
		margin-bottom: 0;
	}
`;

const FieldLabel = styled.label`
	display: block;
	font-weight: 600;
	color: #333;
	margin-bottom: 8px;
	font-size: 14px;
`;

const FieldValue = styled.div`
	color: #6c757d;
	font-size: 16px;
	padding: 12px 0;
`;

const FieldRow = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
`;

const FieldInput = styled(Input)`
	flex: 1;
`;

const ActionButton = styled(Button)`
	min-width: 100px;
`;

const ErrorMessage = styled.div`
	color: #dc3545;
	font-size: 14px;
	margin-top: 8px;
`;

const SuccessMessage = styled.div`
	color: #28a745;
	font-size: 14px;
	margin-top: 8px;
`;

const ModalForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const ModalButtons = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	margin-top: 24px;
`;

const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, loading, error } = useSelector(state => state.auth);

	const [editingField, setEditingField] = useState(null);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	// Состояния для редактируемых полей
	const [email, setEmail] = useState(user?.email || '');
	const [name, setName] = useState(user?.name || '');
	const [currency, setCurrency] = useState(user?.currency || 'RUB');

	// Валидационные схемы для пароля
	const passwordInitialValues = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	};

	const onSubmitPassword = async values => {
		if (values.newPassword !== values.confirmPassword) {
			throw new Error('Пароли не совпадают');
		}

		if (values.newPassword.length < 6) {
			throw new Error('Новый пароль должен содержать минимум 6 символов');
		}

		await dispatch(
			changePassword({
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
			})
		);

		setShowPasswordModal(false);
		setSuccessMessage('Пароль успешно изменен');
		setTimeout(() => setSuccessMessage(''), 3000);
	};

	const {
		values: passwordValues,
		errors: passwordErrors,
		touched: passwordTouched,
		handleChange: handlePasswordChange,
		handleBlur: handlePasswordBlur,
		handleSubmit: handlePasswordSubmit,
		resetForm: resetPasswordForm,
	} = useForm(passwordInitialValues, onSubmitPassword);

	// Обработчики для полей профиля
	const handleSaveEmail = async () => {
		try {
			await dispatch(updateUserProfile({ email }));
			setEditingField(null);
			setSuccessMessage('Email успешно обновлен');
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			console.error('Error updating email:', error);
		}
	};

	const handleSaveName = async () => {
		try {
			await dispatch(updateUserProfile({ name }));
			setEditingField(null);
			setSuccessMessage('Имя успешно обновлено');
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			console.error('Error updating name:', error);
		}
	};

	const handleCurrencyChange = async newCurrency => {
		setCurrency(newCurrency);
		try {
			await dispatch(updateUserProfile({ currency: newCurrency }));
			setSuccessMessage('Валюта успешно обновлена');
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			console.error('Error updating currency:', error);
		}
	};

	const handleCancelEdit = () => {
		setEditingField(null);
		setEmail(user?.email || '');
		setName(user?.name || '');
	};

	const handlePasswordModalClose = () => {
		setShowPasswordModal(false);
		resetPasswordForm();
	};

	const currencyOptions = [
		{ value: 'RUB', label: 'Российский рубль (₽)' },
		{ value: 'USD', label: 'Доллар США ($)' },
		{ value: 'EUR', label: 'Евро (€)' },
		{ value: 'KZT', label: 'Казахстанский тенге (₸)' },
	];

	if (!user) {
		return (
			<ProfileContainer>
				<Header>
					<BackButton onClick={() => navigate(-1)}>←</BackButton>
					<Title>Профиль</Title>
				</Header>
				<div>Пользователь не найден</div>
			</ProfileContainer>
		);
	}

	return (
		<ProfileContainer>
			<Header>
				<BackButton onClick={() => navigate(-1)}>←</BackButton>
				<Title>Профиль</Title>
			</Header>

			{error && <ErrorMessage>{error}</ErrorMessage>}
			{successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

			<ProfileCard>
				{/* Поле Email */}
				<FieldGroup>
					<FieldLabel>Email</FieldLabel>
					{editingField === 'email' ? (
						<FieldRow>
							<FieldInput
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder="Введите email"
							/>
							<LoadingButton
								onClick={handleSaveEmail}
								loading={loading}
								disabled={!email || email === user.email}
							>
								Сохранить
							</LoadingButton>
							<Button variant="secondary" onClick={handleCancelEdit} disabled={loading}>
								Отмена
							</Button>
						</FieldRow>
					) : (
						<FieldRow>
							<FieldValue>{user.email}</FieldValue>
							<ActionButton $variant="secondary" onClick={() => setEditingField('email')}>
								Изменить
							</ActionButton>
						</FieldRow>
					)}
				</FieldGroup>

				{/* Поле Имя */}
				<FieldGroup>
					<FieldLabel>Имя</FieldLabel>
					{editingField === 'name' ? (
						<FieldRow>
							<FieldInput
								type="text"
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder="Введите имя"
							/>
							<LoadingButton
								onClick={handleSaveName}
								loading={loading}
								disabled={!name || name === user.name}
							>
								Сохранить
							</LoadingButton>
							<Button variant="secondary" onClick={handleCancelEdit} disabled={loading}>
								Отмена
							</Button>
						</FieldRow>
					) : (
						<FieldRow>
							<FieldValue>{user.name || 'Не указано'}</FieldValue>
							<ActionButton $variant="secondary" onClick={() => setEditingField('name')}>
								Изменить
							</ActionButton>
						</FieldRow>
					)}
				</FieldGroup>

				{/* Поле Валюта */}
				<FieldGroup>
					<FieldLabel>Валюта</FieldLabel>
					<FieldRow>
						<select
							value={currency}
							onChange={e => handleCurrencyChange(e.target.value)}
							style={{
								width: '100%',
								padding: '12px 16px',
								border: '2px solid #e1e5e9',
								borderRadius: '8px',
								fontSize: '16px',
								background: 'white',
							}}
						>
							{currencyOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</FieldRow>
				</FieldGroup>

				{/* Поле Пароль */}
				<FieldGroup>
					<FieldLabel>Пароль</FieldLabel>
					<FieldRow>
						<FieldValue>••••••••</FieldValue>
						<ActionButton $variant="secondary" onClick={() => setShowPasswordModal(true)}>
							Изменить
						</ActionButton>
					</FieldRow>
				</FieldGroup>
			</ProfileCard>

			{/* Модальное окно смены пароля */}
			<Modal isOpen={showPasswordModal} onClose={handlePasswordModalClose} title="Изменение пароля">
				<ModalForm onSubmit={handlePasswordSubmit}>
					<div>
						<FieldLabel htmlFor="currentPassword">Текущий пароль</FieldLabel>
						<Input
							type="password"
							id="currentPassword"
							name="currentPassword"
							value={passwordValues.currentPassword}
							onChange={e => handlePasswordChange('currentPassword', e.target.value)}
							onBlur={() => handlePasswordBlur('currentPassword')}
							placeholder="Введите текущий пароль"
							required
						/>
						{passwordTouched.currentPassword && passwordErrors.currentPassword && (
							<ErrorMessage>{passwordErrors.currentPassword}</ErrorMessage>
						)}
					</div>

					<div>
						<FieldLabel htmlFor="newPassword">Новый пароль</FieldLabel>
						<Input
							type="password"
							id="newPassword"
							name="newPassword"
							value={passwordValues.newPassword}
							onChange={e => handlePasswordChange('newPassword', e.target.value)}
							onBlur={() => handlePasswordBlur('newPassword')}
							placeholder="Введите новый пароль"
							required
						/>
						{passwordTouched.newPassword && passwordErrors.newPassword && (
							<ErrorMessage>{passwordErrors.newPassword}</ErrorMessage>
						)}
					</div>

					<div>
						<FieldLabel htmlFor="confirmPassword">Подтверждение пароля</FieldLabel>
						<Input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={passwordValues.confirmPassword}
							onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
							onBlur={() => handlePasswordBlur('confirmPassword')}
							placeholder="Повторите новый пароль"
							required
						/>
						{passwordTouched.confirmPassword && passwordErrors.confirmPassword && (
							<ErrorMessage>{passwordErrors.confirmPassword}</ErrorMessage>
						)}
					</div>

					<ModalButtons>
						<Button
							variant="secondary"
							type="button"
							onClick={handlePasswordModalClose}
							disabled={loading}
						>
							Отмена
						</Button>
						<LoadingButton type="submit" loading={loading}>
							Изменить пароль
						</LoadingButton>
					</ModalButtons>
				</ModalForm>
			</Modal>
		</ProfileContainer>
	);
};

export default Profile;
