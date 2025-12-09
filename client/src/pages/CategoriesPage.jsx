import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from '../components/UI/Spinner/Spinner';
import CategoryList from '../components/Layout/CategoryList';
import { Button } from '../components/UI/Button/Button';
import { fetchCategories } from '../store/actions/categoryActions';

const Container = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	padding-bottom: 100px;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32px;
`;

const Title = styled.h1`
	margin: 0;
	color: #333;
	font-size: 28px;
	font-weight: 700;
`;

const ToggleContainer = styled.div`
	display: flex;
	background: #f8f9fa;
	border-radius: 8px;
	padding: 4px;
	margin-bottom: 24px;
`;

const ToggleButton = styled(Button)`
	flex: 1;
	padding: 12px;
	background: ${props => (props.$active ? '#007bff' : 'transparent')};
	color: ${props => (props.$active ? 'white' : '#007bff')};
	border: none;
	font-weight: 600;

	&:hover {
		background: ${props => (props.$active ? '#0056b3' : '#e9ecef')};
		color: ${props => (props.$active ? 'white' : '#0056b3')};
	}
`;

const BackButton = styled(Button)`
	margin-bottom: 24px;
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
	const [activeTab, setActiveTab] = useState('expense');

	const {
		categories,
		loading: categoriesLoading,
		error: categoriesError,
	} = useSelector(state => state.categories);

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	const handleBackClick = () => {
		navigate('/dashboard');
	};

	const handleViewTransactions = categoryId => {
		navigate(`/category/${categoryId}`);
	};

	const filteredCategories = categories.filter(category => category.type === activeTab);
	const loading = categoriesLoading;
	const error = categoriesError;

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
				<Title>Категории</Title>
			</Header>

			{error && <ErrorMessage>Ошибка загрузки данных: {error}</ErrorMessage>}

			<BackButton $variant="secondary" onClick={handleBackClick}>
				← Назад
			</BackButton>

			<ToggleContainer>
				<ToggleButton $active={activeTab === 'expense'} onClick={() => setActiveTab('expense')}>
					РАСХОДЫ
				</ToggleButton>
				<ToggleButton $active={activeTab === 'income'} onClick={() => setActiveTab('income')}>
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
