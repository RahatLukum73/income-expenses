import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTransactions } from '../../hooks/useTransactions';

const Container = styled.div`
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	overflow: hidden;
`;

const CategoryItem = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-bottom: 1px solid #e9ecef;
	transition: background-color 0.2s ease;
	cursor: pointer;

	&:hover {
		background: #f8f9fa;
	}

	&:last-child {
		border-bottom: none;
	}
`;

const CategoryColor = styled.div`
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: ${props => props.color || '#007bff'};
	margin-right: 16px;
	flex-shrink: 0;
`;

const CategoryInfo = styled.div`
	flex: 1;
`;

const CategoryHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 4px;
`;

const CategoryName = styled.h3`
	margin: 0;
	color: #333;
	font-size: 16px;
	font-weight: 600;
`;

const CategoryAmount = styled.div`
	font-size: 16px;
	font-weight: 700;
	color: ${props => (props.type === 'income' ? '#28a745' : '#dc3545')};
`;

const CategoryDescription = styled.p`
	margin: 0;
	color: #6c757d;
	font-size: 14px;
`;

const NoDataMessage = styled.div`
	text-align: center;
	color: #6c757d;
	padding: 40px;
	font-size: 16px;
`;

const CategoryList = ({
	categories,
	type = 'expense',
	onViewTransactions,
	currencySymbol = '₽',
}) => {
	const { stats } = useTransactions({ type });
	const categoryStats = stats?.categoryStats || [];

	const getCategoryAmount = categoryId => {
		const statItem = categoryStats.find(item => item.categoryId === categoryId);
		return statItem ? statItem.amount : 0;
	};

	if (!categories || categories.length === 0) {
		return (
			<Container>
				<NoDataMessage>
					{type === 'expense' ? 'Нет категорий расходов' : 'Нет категорий доходов'}
				</NoDataMessage>
			</Container>
		);
	}

	return (
		<Container>
			{categories.map(category => {
				const amount = getCategoryAmount(category._id);

				return (
					<CategoryItem
						key={category._id}
						onClick={() => onViewTransactions && onViewTransactions(category._id)}
					>
						<CategoryColor color={category.color} />

						<CategoryInfo>
							<CategoryHeader>
								<CategoryName>{category.name}</CategoryName>
								<CategoryAmount type={type}>
									{type === 'income' ? '+' : '-'}
									{amount.toLocaleString('ru-RU')} {currencySymbol}
								</CategoryAmount>
							</CategoryHeader>

							<CategoryDescription>{category.description || 'Без описания'}</CategoryDescription>
						</CategoryInfo>
					</CategoryItem>
				);
			})}
		</Container>
	);
};

CategoryList.propTypes = {
	categories: PropTypes.array.isRequired,
	type: PropTypes.oneOf(['income', 'expense']),
	onViewTransactions: PropTypes.func,
	currencySymbol: PropTypes.string,
};

export default CategoryList;
