import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '../components/UI/Button/Button';
import Modal from '../components/UI/Modal/Modal';
import { fetchTransaction, deleteTransaction } from '../store/actions/transactionActions';
import styled from 'styled-components';

const PageContainer = styled.div`
	padding: 24px;
	max-width: 600px;
	margin: 0 auto;
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
	flex: 1;
`;

const ActionButtons = styled.div`
	display: flex;
	gap: 12px;
`;

const DetailsCard = styled.div`
	background: white;
	border-radius: 12px;
	padding: 32px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	margin-bottom: 24px;
`;

const DetailRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 0;
	border-bottom: 1px solid #e9ecef;

	&:last-child {
		border-bottom: none;
	}
`;

const DetailLabel = styled.span`
	font-weight: 600;
	color: #6c757d;
	font-size: 16px;
`;

const DetailValue = styled.span`
	color: #333;
	font-size: 16px;
	text-align: right;
`;

const Amount = styled(DetailValue)`
	font-size: 24px;
	font-weight: 700;
	color: ${props => (props.type === 'income' ? '#28a745' : '#dc3545')};
`;

const Description = styled(DetailValue)`
	font-style: ${props => (props.$empty ? 'italic' : 'normal')};
	color: ${props => (props.$empty ? '#6c757d' : '#333')};
`;

const LoadingState = styled.div`
	text-align: center;
	padding: 60px 20px;
	color: #6c757d;
	font-size: 18px;
`;

const ErrorState = styled.div`
	text-align: center;
	padding: 60px 20px;
	color: #dc3545;
	font-size: 18px;
`;

const DeleteModalContent = styled.div`
	text-align: center;
`;

const DeleteModalText = styled.p`
	margin-bottom: 24px;
	font-size: 16px;
	line-height: 1.5;
	color: #333;
`;

const DeleteModalButtons = styled.div`
	display: flex;
	gap: 12px;
	justify-content: center;
`;

const formatDateTime = dateString => {
	if (!dateString) return 'Дата не указана';

	try {
		const date = new Date(dateString);

		if (isNaN(date.getTime())) {
			return 'Некорректная дата';
		}

		const day = date.getDate();
		const month = date.toLocaleDateString('ru-RU', { month: 'long' });
		const year = date.getFullYear();
		const time = date.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});

		return `${day} ${month} ${year} в ${time}`;
	} catch (error) {
		return 'Ошибка формата даты';
	}
};

const formatAmount = (amount, type) => {
	if (!amount || isNaN(amount)) {
		return 'Некорректная сумма';
	}

	const formattedAmount = new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);

	const sign = type === 'income' ? '+' : '-';
	return `${sign} ${formattedAmount} ₽`;
};

const TransactionDetails = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const { currentTransaction, loading, error } = useSelector(state => state.transactions);

	useEffect(() => {
		if (id) {
			dispatch(fetchTransaction(id));
		}
	}, [dispatch, id]);

	const handleEdit = () => {
		navigate(`/edit-transaction/${id}`, {
			state: { from: `/transaction/${id}` },
		});
	};

	const handleDelete = () => {
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		try {
			await dispatch(deleteTransaction(id));
			setShowDeleteModal(false);
			navigate('/dashboard');
		} catch (error) {
			console.error('Error deleting transaction:', error);
		}
	};

	const cancelDelete = () => {
		setShowDeleteModal(false);
	};

	const account = currentTransaction?.account;
	const category = currentTransaction?.category;

	if (loading) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={() => navigate(-1)}>←</BackButton>
					<Title>Детали транзакции</Title>
				</Header>
				<LoadingState>Загрузка...</LoadingState>
			</PageContainer>
		);
	}

	if (error) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={() => navigate(-1)}>←</BackButton>
					<Title>Детали транзакции</Title>
				</Header>
				<ErrorState>Ошибка: {error}</ErrorState>
			</PageContainer>
		);
	}

	if (!currentTransaction) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={() => navigate(-1)}>←</BackButton>
					<Title>Детали транзакции</Title>
				</Header>
				<ErrorState>Транзакция не найдена</ErrorState>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<Header>
				<BackButton onClick={() => navigate(-1)}>←</BackButton>
				<Title>Детали транзакции</Title>
				<ActionButtons>
					<LoadingButton $variant="secondary" onClick={handleEdit}>
						Редактировать
					</LoadingButton>
					<LoadingButton onClick={handleDelete} loading={loading}>
						Удалить
					</LoadingButton>
				</ActionButtons>
			</Header>

			<DetailsCard>
				<DetailRow>
					<DetailLabel>Сумма</DetailLabel>
					<Amount type={currentTransaction.type}>
						{formatAmount(currentTransaction.amount, currentTransaction.type)}
					</Amount>
				</DetailRow>

				<DetailRow>
					<DetailLabel>Тип операции</DetailLabel>
					<DetailValue>{currentTransaction.type === 'income' ? 'Доход' : 'Расход'}</DetailValue>
				</DetailRow>

				<DetailRow>
					<DetailLabel>Счет</DetailLabel>
					<DetailValue>
						{account ? `${account.name} (${account.currency || '₽'})` : 'Неизвестный счет'}
					</DetailValue>
				</DetailRow>

				<DetailRow>
					<DetailLabel>Категория</DetailLabel>
					<DetailValue>{category ? category.name : 'Неизвестная категория'}</DetailValue>
				</DetailRow>

				<DetailRow>
					<DetailLabel>Дата и время</DetailLabel>
					<DetailValue>{formatDateTime(currentTransaction.date)}</DetailValue>
				</DetailRow>

				<DetailRow>
					<DetailLabel>Описание</DetailLabel>
					<Description $empty={!currentTransaction.description}>
						{currentTransaction.description || 'Описание отсутствует'}
					</Description>
				</DetailRow>
			</DetailsCard>

			<Modal isOpen={showDeleteModal} onClose={cancelDelete} title="Подтверждение удаления">
				<DeleteModalContent>
					<DeleteModalText>
						Вы уверены, что хотите удалить эту транзакцию?
						<br />
						Это действие нельзя отменить.
					</DeleteModalText>
					<DeleteModalButtons>
						<LoadingButton $variant="secondary" onClick={cancelDelete}>
							Отмена
						</LoadingButton>
						<LoadingButton onClick={confirmDelete} loading={loading}>
							Удалить
						</LoadingButton>
					</DeleteModalButtons>
				</DeleteModalContent>
			</Modal>
		</PageContainer>
	);
};

export default TransactionDetails;
