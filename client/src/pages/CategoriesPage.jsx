import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from '../components/UI/Spinner/Spinner';
import CategoryList from '../components/Layout/CategoryList';
import { Button, BackButton } from '../components/UI/Button/Button';
import { fetchCategories } from '../store/actions/categoryActions';

const Container = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	padding-bottom: 100px;
`;

const Header = styled.div`
	display: flex;
	gap: 20px;
	align-items: center;
	margin-bottom: 32px;
`;

const Title = styled.h1`
	margin: 0;
	color: #e1e1e1;
	font-size: 28px;
	font-weight: 700;
`;

const ToggleContainer = styled.div`
	display: flex;
	border-radius: 8px;
	padding: 4px;
	margin-bottom: 24px;
	gap: 4px;
`;

const ToggleButton = styled(Button)`
	flex: 1;
	padding: 12px;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
	border: none;
	font-weight: 600;
	transition: all 0.3s ease;

	background: ${props =>
		!props.$active ? '#adadad' : props.name === 'expense' ? '#dc3545' : '#28a745'};
	color: ${props => (!props.$active ? 'white' : props.name === 'expense' ? '#8b0000' : '#006400')};

	&:hover {
		background: ${props =>
			!props.$active ? '#8b8b8b' : props.name === 'expense' ? '#c82333' : '#218838'};
		color: ${props =>
			!props.$active ? 'white' : props.name === 'expense' ? '#660000' : '#004d00'};
		transform: translateY(-1px);
	}
`;

const ErrorMessage = styled.div`
	background: #f8d7da;
	color: #721c24;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 24px;
	text-align: center;
`;

const CategoriesPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState(() => {
		const savedTab = localStorage.getItem('categories_active_tab');
		return savedTab === 'income' ? 'income' : 'expense';
	});
	useEffect(() => {
		localStorage.setItem('categories_active_tab', activeTab);
	}, [activeTab]);
	const {
		categories,
		loading: categoriesLoading,
		error: categoriesError,
	} = useSelector(state => state.categories);

	const filteredCategories = categories.filter(category => category.type === activeTab);
	const loading = categoriesLoading;
	const error = categoriesError;

	useEffect(() => {
		if (!loading && !error) {
			dispatch(fetchCategories());
		}
	}, [dispatch]);

	const handleBackClick = () => {
		navigate('/dashboard');
	};

	const handleViewTransactions = categoryId => {
		navigate(`/categories/${categoryId}`);
	};

	if (loading) {
		return (
			<Container>
				<Spinner />
			</Container>
		);
	}

	return (
		<Container>
			<Header>
				<BackButton onClick={handleBackClick} />
				<Title>Категории</Title>
			</Header>

			{error && <ErrorMessage>Ошибка загрузки данных: {error}</ErrorMessage>}

			<ToggleContainer>
				<ToggleButton
					name="expense"
					$active={activeTab === 'expense'}
					onClick={() => setActiveTab('expense')}
				>
					РАСХОДЫ
				</ToggleButton>
				<ToggleButton
					name="income"
					$active={activeTab === 'income'}
					onClick={() => setActiveTab('income')}
				>
					ДОХОДЫ
				</ToggleButton>
			</ToggleContainer>

			<CategoryList
				categories={filteredCategories}
				type={activeTab}
				onViewTransactions={handleViewTransactions}
				currencySymbol="₽"
			/>
		</Container>
	);
};

export default CategoriesPage;
