import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../components/UI/Button/Button';
import { fetchCategory } from '../store/actions/categoryActions';
import { fetchTransactionsByCategory } from '../store/actions/transactionActions';
import { normalizeTransactions } from '../utils/normalizers';
import styled from 'styled-components';

const PageContainer = styled.div`
	padding: 20px;
	max-width: 800px;
	margin: 0 auto;
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	margin-bottom: 32px;
`;

const Title = styled.h1`
	color: #e1e1e1;
	font-size: 28px;
	flex: 1;
`;

const CategoryCard = styled.div`
	display: flex;
	justify-content: space-between;
	background: #565656;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
	border-radius: 12px;
	padding:20px 40px;
	margin-bottom: 24px;
	text-align: center;
`;

const CategoryIcon = styled.div`
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: ${props => props.color || '#007bff'};
	margin: 0 auto 20px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const CategoryName = styled.h2`
	color: #e1e1e1;
	font-size: 24px;
`;

const CategoryType = styled.div`
	font-size: 16px;
	color: #fff;
`;

const InfoItem = styled.div`
	text-align: center;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-self: end;
	height: 100%;
`;

const InfoLabel = styled.div`
	font-size: 14px;
	color: #fff;
	margin-bottom: 8px;
`;

const InfoValue = styled.div`
	font-size: 20px;
	font-weight: 700;
	color: #e1e1e1;
`;

const TransactionsSection = styled.div`
	background: #565656;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
	border-radius: 12px;
	padding: 24px;
`;

const SectionTitle = styled.h3`
	margin: 0 0 20px 0;
	color: #e1e1e1;
	font-size: 18px;
	font-weight: 600;
`;

const TransactionList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const TransactionItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #6b6b6b;
	padding: 16px;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: #7b7b7b;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
	}
`;

const TransactionInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 1;
`;

const TransactionDescription = styled.span`
	font-weight: 500;
	color: #353535;
	flex: 1;
`;

const TransactionAmount = styled.span`
	font-weight: 600;
	font-size: 16px;
	color: ${props => (props.type === 'income' ? '#28a745' : '#dc3545')};
`;

const TransactionDate = styled.span`
	color: #e1e1e1;
	font-size: 12px;
	margin-right: 16px;
`;

const NoDataMessage = styled.div`
	text-align: center;
	color: #6c757d;
	padding: 40px;
	font-size: 16px;
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

const formatDate = dateString => {
	if (!dateString) return '';

	try {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return '';

		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	} catch {
		return '';
	}
};

const CategoryDetails = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();

	const {
		currentCategory,
		loading: categoryLoading,
		error: categoryError,
	} = useSelector(state => state.categories);

	const {
		transactions,
		loading: transactionsLoading,
		error: transactionsError,
	} = useSelector(state => state.transactions);

	const normalizedTransactions = normalizeTransactions(transactions);

	useEffect(() => {
		if (id) {
			dispatch(fetchCategory(id));
			dispatch(fetchTransactionsByCategory(id));
		}
	}, [dispatch, id]);

	const categoryTransactions = normalizedTransactions.filter(
		transaction => transaction.category?._id === id
	);

	const totalAmount = categoryTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
	const transactionsCount = categoryTransactions.length;

	const handleBack = () => {
		navigate(-1);
	};

	const handleTransactionClick = transactionId => {
		if (transactionId) {
			navigate(`/transaction/${transactionId}`);
		}
	};

	const loading = categoryLoading || transactionsLoading;
	const error = categoryError || transactionsError;

	if (loading && !currentCategory) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={handleBack} />
					<Title>Детали категории</Title>
				</Header>
				<LoadingState>Загрузка...</LoadingState>
			</PageContainer>
		);
	}

	if (error) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={handleBack} />
					<Title>Детали категории</Title>
				</Header>
				<ErrorState>Ошибка: {error}</ErrorState>
			</PageContainer>
		);
	}

	if (!currentCategory) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={handleBack} />
					<Title>Детали категории</Title>
				</Header>
				<ErrorState>Категория не найдена</ErrorState>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<Header>
				<BackButton onClick={handleBack} />
				<Title>Детали категории</Title>
			</Header>

			<CategoryCard>
					<InfoItem>
						<InfoLabel>Всего транзакций</InfoLabel>
						<InfoValue>{transactionsCount}</InfoValue>
					</InfoItem>
				<InfoItem>
					<CategoryIcon color={currentCategory.color} />
					<CategoryType>{currentCategory.type === 'income' ? 'Доходы' : 'Расходы'}</CategoryType>
					<CategoryName>{currentCategory.name}</CategoryName>
				</InfoItem>
					<InfoItem>
						<InfoLabel>Общая сумма</InfoLabel>
						<InfoValue>{formatAmount(Math.abs(totalAmount), currentCategory.type)}</InfoValue>
					</InfoItem>
			</CategoryCard>

			<TransactionsSection>
				<SectionTitle>Транзакции в этой категории</SectionTitle>

				{categoryTransactions.length > 0 ? (
					<TransactionList>
						{categoryTransactions.map(transaction => (
							<TransactionItem
								key={transaction._id}
								onClick={() => handleTransactionClick(transaction._id)}
							>
								<TransactionInfo>
									<TransactionDescription>
										{transaction.description || 'Без описания'}
									</TransactionDescription>
									<TransactionDate>{formatDate(transaction.date)}</TransactionDate>
								</TransactionInfo>
								<TransactionAmount type={transaction.type}>
									{formatAmount(transaction.amount, transaction.type)}
								</TransactionAmount>
							</TransactionItem>
						))}
					</TransactionList>
				) : (
					<NoDataMessage>Нет транзакций в этой категории</NoDataMessage>
				)}
			</TransactionsSection>
		</PageContainer>
	);
};

export default CategoryDetails;
