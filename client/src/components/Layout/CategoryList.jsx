import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTransactions } from '../../hooks/useTransactions';

const Container = styled.div`
	background: #565656;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
`;

const SectionTitle = styled.h3`
	margin: 0 0 20px 0;
	color: #b5b8b1;
	font-size: 18px;
	font-weight: 600;
`;

const CategoryListWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const CategoryItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 16px;
	background: ${props => props.$bgColor || '#303030'};
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: ${props => props.$bgColor === '#6b6b6b' ? '#7b7b7b' : '#bdbdbd'};
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}
`;

const CategoryInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 1;
`;

const CategoryColor = styled.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: ${props => props.$color || '#007bff'};
`;

const CategoryName = styled.span`
	font-weight: 500;
	color: #e1e1e1;
	text-shadow: 1px 1px 1px rgba(68, 68, 68, 0.3);
	font-size: 16px;
`;

const CategoryDetails = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
`;

const CategoryDescription = styled.span`
	color: #e1e1e1;
	text-shadow: 1px 1px 1px rgba(68, 68, 68, 0.3);
	font-size: 12px;
	margin-right: 12px;
`;

const CategoryAmount = styled.span`
	font-weight: 600;
	font-size: 16px;
	color: ${props => (props.$type === 'income' ? '#28a745' : '#dc3545')};
	text-shadow: 1px 1px 1px rgba(68, 68, 68, 0.3);
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

	const getBackgroundColor = (index) => {
		return index % 2 === 0 ? '#6b6b6b' : '#adadad';
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
			<SectionTitle>
				{type === 'income' ? 'Категории доходов' : 'Категории расходов'}
				{` (${categories.length} всего)`}
			</SectionTitle>

			<CategoryListWrapper>
				{categories.map((category, index) => {
					const amount = getCategoryAmount(category._id);

					return (
						<CategoryItem
							key={category._id}
							onClick={() => onViewTransactions && onViewTransactions(category._id)}
							$bgColor={getBackgroundColor(index)}
						>
							<CategoryInfo>
								<CategoryColor $color={category.color} />
								<CategoryDetails>
									<CategoryName>{category.name}</CategoryName>
									<CategoryDescription>
										{category.description || 'Без описания'}
									</CategoryDescription>
								</CategoryDetails>
							</CategoryInfo>
							
							<CategoryAmount $type={type}>
								{type === 'income' ? '+' : '-'}
								{amount.toLocaleString('ru-RU')} {currencySymbol}
							</CategoryAmount>
						</CategoryItem>
					);
				})}
			</CategoryListWrapper>
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
