import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
	fetchAccounts,
	createAccount,
	updateAccount,
	deleteAccount,
} from '../store/actions/accountActions';
import { Button, BackButton } from '../components/UI/Button/Button';
import { Spinner } from '../components/UI/Spinner/Spinner';
import AccountCard from '../components/AccountCard/AccountCard';
import AccountForm from '../components/AccountForm/AccountForm';
import Modal from '../components/UI/Modal/Modal';
import { getCurrencySymbol } from '../utils/dateHelpers';

const PageContainer = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 20px 0; /* ИЗМЕНЕНИЕ: было padding: 20px; padding-bottom: 100px; */
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32px;
	padding: 0 20px; /* ИЗМЕНЕНИЕ: добавили горизонтальные отступы */
`;

const Title = styled.h1`
	margin: 0;
	color: #e1e1e1;
	font-size: 28px;
	flex: 1;
	text-align: center;
`;

const AccountsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 20px;
	margin-bottom: 32px;
	padding: 0 20px; /* ИЗМЕНЕНИЕ: добавили горизонтальные отступы */
`;

const EmptyState = styled.div`
	text-align: center;
	padding: 60px 20px;
	color: #6c757d;
`;

const EmptyStateIcon = styled.div`
	font-size: 64px;
	margin-bottom: 16px;
	opacity: 0.5;
`;

const EmptyStateTitle = styled.h3`
	margin: 0 0 8px 0;
	font-size: 18px;
	color: #333;
`;

const EmptyStateText = styled.p`
	margin: 0 0 20px 0;
	font-size: 14px;
`;

const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 200px;
	padding: 0 20px; /* ИЗМЕНЕНИЕ: добавили горизонтальные отступы */
`;

const ErrorMessage = styled.div`
	background: #f8d7da;
	color: #721c24;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 24px;
	text-align: center;
	margin: 0 20px 24px 20px; /* ИЗМЕНЕНИЕ: добавили горизонтальные отступы */
`;

const ButtonStyle = styled(Button)`
	background: #adadad;
	width: auto;
	flex-shrink: 0;
	white-space: nowrap;
`;

const CustomBackButton = styled(BackButton)`
	margin-bottom: 0 !important;
	flex-shrink: 0 !important;
	margin-right: 16px;
`;

const Accounts = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { accounts, loading, error } = useSelector(state => state.accounts);
	const { user } = useSelector(state => state.auth);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalError, setModalError] = useState('');

	useEffect(() => {
		dispatch(fetchAccounts());
	}, [dispatch]);

	const handleBack = () => {
		navigate(-1);
	};

	const handleCreateAccount = () => {
		setEditingAccount(null);
		setModalError('');
		setIsModalOpen(true);
	};

	const handleEditAccount = account => {
		setEditingAccount(account);
		setModalError('');
		setIsModalOpen(true);
	};

	const handleDeleteAccount = async (accountId, hasTransactions) => {
		if (hasTransactions) {
			alert(
				'Нельзя удалить счет, у которого есть транзакции. Сначала удалите или переместите транзакции.'
			);
			return;
		}

		if (window.confirm('Вы уверены, что хотите удалить этот счет?')) {
			try {
				await dispatch(deleteAccount(accountId));
			} catch (error) {
				if (error.message.includes('Нельзя удалить счет с транзакциями')) {
					alert('Нельзя удалить счет, у которого есть транзакции. Обновите страницу.');
				} else {
					alert('Ошибка при удалении счета: ' + error.message);
				}
			}
		}
	};

	const handleViewTransactions = accountId => {
		navigate(`/transactions?account=${accountId}`);
	};

	const handleSubmitAccount = async formData => {
		setIsSubmitting(true);
		setModalError('');

		try {
			if (editingAccount) {
				await dispatch(updateAccount(editingAccount._id, formData));
				setIsModalOpen(false);
				setEditingAccount(null);
			} else {
				await dispatch(createAccount(formData));
				setIsModalOpen(false);
				setEditingAccount(null);
			}
		} catch (error) {
			setModalError(error.message || 'Произошла ошибка');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCloseModal = () => {
		if (!isSubmitting) {
			setIsModalOpen(false);
			setEditingAccount(null);
			setModalError('');
		}
	};

	const formatCurrency = (amount, currency) => {
		const symbol = getCurrencySymbol(currency);
		return `${amount.toLocaleString('ru-RU')} ${symbol}`;
	};

	return (
		<PageContainer>
			<Header>
				<CustomBackButton onClick={handleBack} />
				<Title>Управление счетами</Title>
				<ButtonStyle onClick={handleCreateAccount}>+ Новый счет</ButtonStyle>
			</Header>

			{error && <ErrorMessage>Ошибка загрузки: {error}</ErrorMessage>}

			{loading ? (
				<LoadingContainer>
					<Spinner />
				</LoadingContainer>
			) : accounts.length > 0 ? (
				<AccountsGrid>
					{accounts.map(account => (
						<AccountCard
							key={account._id}
							account={account}
							onEdit={handleEditAccount}
							onDelete={handleDeleteAccount}
							onViewTransactions={handleViewTransactions}
							formatCurrency={formatCurrency}
						/>
					))}
				</AccountsGrid>
			) : (
				<EmptyState>
					<EmptyStateIcon>💳</EmptyStateIcon>
					<EmptyStateTitle>Счетов пока нет</EmptyStateTitle>
					<EmptyStateText>Создайте свой первый счет для управления финансами</EmptyStateText>
					<Button onClick={handleCreateAccount}>Создать первый счет</Button>
				</EmptyState>
			)}

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={editingAccount ? 'Редактировать счет' : 'Новый счет'}
			>
				{modalError && <ErrorMessage style={{ marginBottom: '20px' }}>{modalError}</ErrorMessage>}

				<AccountForm
					initialData={editingAccount}
					onSubmit={handleSubmitAccount}
					onCancel={handleCloseModal}
					submitText={editingAccount ? 'Сохранить изменения' : 'Создать счет'}
					loading={isSubmitting}
				/>
			</Modal>
		</PageContainer>
	);
};

export default Accounts;
