import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TransactionForm from '../components/TransactionForm/TransactionForm';
import { fetchTransaction, updateTransaction } from '../store/actions/transactionActions';
import { fetchAccounts } from '../store/actions/accountActions';
import { fetchCategories } from '../store/actions/categoryActions';
import { prepareTransactionForForm } from '../utils/normalizers';

// Добавляем недостающие styled components
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

const EditTransaction = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const {
		currentTransaction,
		loading: transactionLoading,
		error,
	} = useSelector(state => state.transactions);

	const { accounts, loading: accountsLoading } = useSelector(state => state.accounts);
	const { categories, loading: categoriesLoading } = useSelector(state => state.categories);

	// Загружаем данные при монтировании
	useEffect(() => {
		dispatch(fetchAccounts());
		dispatch(fetchCategories());

		if (id) {
			dispatch(fetchTransaction(id));
		}
	}, [dispatch, id]);

	const handleSubmit = async transactionData => {
		try {
			await dispatch(updateTransaction(id, transactionData));

			// Редирект обратно на страницу деталей транзакции
			const from = location.state?.from || `/transaction/${id}`;
			navigate(from);
		} catch (error) {
			console.error('Error updating transaction:', error);
		}
	};

	const handleBack = () => {
		navigate(-1);
	};

	// Подготавливаем данные для формы
	const initialValues = prepareTransactionForForm(currentTransaction);
	const isLoading = transactionLoading || accountsLoading || categoriesLoading;

	
	if (transactionLoading && !currentTransaction) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={handleBack}>←</BackButton>
					<Title>Редактировать транзакцию</Title>
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
					<Title>Редактировать транзакцию</Title>
				</Header>
				<ErrorState>Ошибка: {error}</ErrorState>
			</PageContainer>
		);
	}

	if (!currentTransaction) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={handleBack}>←</BackButton>
					<Title>Редактировать транзакцию</Title>
				</Header>
				<ErrorState>Транзакция не найдена</ErrorState>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<Header>
				<BackButton onClick={handleBack}>←</BackButton>
				<Title>Редактировать транзакцию</Title>
			</Header>

			<TransactionForm
				initialValues={initialValues}
				onSubmit={handleSubmit}
				submitText="Сохранить изменения"
				isEditing={true}
				loading={isLoading}
			/>
		</PageContainer>
	);
};

export default EditTransaction;
