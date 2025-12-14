import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../store/actions/transactionActions';
import { BackButton } from '../components/UI/Button/Button';
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

const Title = styled.h1`
	margin: 0 0 0 20px;
	color: #e1e1e1;
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
				<BackButton onClick={handleBack}/>
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
