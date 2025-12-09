import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategory } from '../store/actions/categoryActions';
import { fetchTransactionsByCategory } from '../store/actions/transactionActions';
import { normalizeTransactions } from '../utils/normalizers';
import styled from 'styled-components';

const PageContainer = styled.div`
	padding: 24px;
	max-width: 800px;
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

const CategoryCard = styled.div`
	background: white;
	border-radius: 12px;
	padding: 32px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
	font-size: 12px;
	color: ;
`;

const CategoryName = styled.h2`
	margin: 0 0 8px 0;
	color: #333;
	font-size: 24px;
`;

const CategoryType = styled.div`
	font-size: 16px;
	color: #6c757d;
	margin-bottom: 16px;
`;

const CategoryInfo = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-top: 24px;
`;

const InfoItem = styled.div`
	text-align: center;
	padding: 16px;
	background: #f8f9fa;
	border-radius: 8px;
`;

const InfoLabel = styled.div`
	font-size: 14px;
	color: #6c757d;
	margin-bottom: 8px;
`;

const InfoValue = styled.div`
	font-size: 20px;
	font-weight: 700;
	color: #333;
`;

const TransactionsSection = styled.div`
	background: white;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
	margin: 0 0 20px 0;
	color: #333;
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
	padding: 16px;
	border-radius: 8px;
	border: 1px solid #e9ecef;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: #f8f9fa;
		border-color: #007bff;
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
	color: #333;
	flex: 1;
`;

const TransactionAmount = styled.span`
	font-weight: 600;
	font-size: 16px;
	color: ${props => (props.type === 'income' ? '#28a745' : '#dc3545')};
`;

const TransactionDate = styled.span`
	color: #6c757d;
	font-size: 14px;
	margin-left: 12px;
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
					<BackButton onClick={handleBack}>←</BackButton>
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
					<BackButton onClick={handleBack}>←</BackButton>
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
					<BackButton onClick={handleBack}>←</BackButton>
					<Title>Детали категории</Title>
				</Header>
				<ErrorState>Категория не найдена</ErrorState>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<Header>
				<BackButton onClick={handleBack}>←</BackButton>
				<Title>Детали категории</Title>
			</Header>

			<CategoryCard>
				<CategoryIcon color={currentCategory.color}/>
				<CategoryName>{currentCategory.name}</CategoryName>
				<CategoryType>{currentCategory.type === 'income' ? 'Доходы' : 'Расходы'}</CategoryType>

				<CategoryInfo>
					<InfoItem>
						<InfoLabel>Всего транзакций</InfoLabel>
						<InfoValue>{transactionsCount}</InfoValue>
					</InfoItem>
					<InfoItem>
						<InfoLabel>Общая сумма</InfoLabel>
						<InfoValue>{formatAmount(Math.abs(totalAmount), currentCategory.type)}</InfoValue>
					</InfoItem>
				</CategoryInfo>
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
