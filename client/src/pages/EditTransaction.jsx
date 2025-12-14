import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { BackButton } from '../components/UI/Button/Button';
import TransactionForm from '../components/TransactionForm/TransactionForm';
import { fetchTransaction, updateTransaction } from '../store/actions/transactionActions';
import { fetchAccounts } from '../store/actions/accountActions';
import { fetchCategories } from '../store/actions/categoryActions';
import { prepareTransactionForForm } from '../utils/normalizers';
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

const Title = styled.h1`
	margin: 0 0 0 20px;
	color: #e1e1e1;
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

	useEffect(() => {
		if (!accounts.loaded) dispatch(fetchAccounts());
		if (!categories.loaded) dispatch(fetchCategories());

		if (id) {
			dispatch(fetchTransaction(id));
		}
	}, [dispatch, id, accounts.loaded, categories.loaded]);

	const handleSubmit = async transactionData => {
		try {
			await dispatch(updateTransaction(id, transactionData));

			const from = location.state?.from || `/transaction/${id}`;
			navigate(from);
		} catch (error) {
			console.error('Error updating transaction:', error);
		}
	};

	const handleBack = () => {
		navigate(-1);
	};

	const initialValues = prepareTransactionForForm(currentTransaction);
	const isLoading = transactionLoading || accountsLoading || categoriesLoading;

	
	if (transactionLoading && !currentTransaction) {
		return (
			<PageContainer>
				<Header>
					<BackButton onClick={handleBack}/>
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
					<BackButton onClick={handleBack}/>
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
					<BackButton onClick={handleBack}/>
					<Title>Редактировать транзакцию</Title>
				</Header>
				<ErrorState>Транзакция не найдена</ErrorState>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<Header>
				<BackButton onClick={handleBack}/>
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
