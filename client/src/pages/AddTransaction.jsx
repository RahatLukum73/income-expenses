import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../store/actions/transactionActions';
import { fetchAccounts } from '../store/actions/accountActions';
import { fetchCategories } from '../store/actions/categoryActions';
import TransactionForm from '../components/TransactionForm/TransactionForm';
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
`;

const AddTransaction = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { loading: transactionLoading } = useSelector(state => state.transactions);

	useEffect(() => {
		dispatch(fetchAccounts());
		dispatch(fetchCategories());
	}, [dispatch]);

	const handleSubmit = async transactionData => {
		try {
			await dispatch(createTransaction(transactionData));
			navigate('/dashboard');
		} catch (error) {
			console.error('Error creating transaction:', error);
		}
	};

	const handleBack = () => {
		navigate(-1);
	};
	return (
		<PageContainer>
			<Header>
				<BackButton onClick={handleBack}>←</BackButton>
				<Title>Добавить транзакцию</Title>
			</Header>

			<TransactionForm
				onSubmit={handleSubmit}
				submitText="Добавить транзакцию"
				loading={transactionLoading}
			/>
		</PageContainer>
	);
};

export default AddTransaction;
