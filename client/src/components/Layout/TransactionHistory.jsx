import PropTypes from 'prop-types';
import styled from 'styled-components';
import Pagination from '../UI/Pagination/Pagination';
import { formatDate, formatTime } from '../../utils/dateHelpers';

const TransactionsSection = styled.div`
	background: white;
	background: #565656;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
`;

const SectionTitle = styled.h3`
	margin: 0 0 20px 0;
	color: #b5b8b1;
	font-size: 18px;
	font-weight: 600;
`;

const TransactionList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const TransactionItem = styled.div`
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

const TransactionInfo = styled.div`
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
	text-shadow: 1px 1px 1px rgba(68, 68, 68, 0.3);;
	font-size: 16px;
`;

const TransactionDetails = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	margin: 0 20px 0 0
`;

const TransactionDate = styled.span`
	color: #e1e1e1;
	text-shadow: 1px 1px 1px rgba(68, 68, 68, 0.3);
	font-size: 12px;
`;

const TransactionTime = styled.span`
	text-shadow: 1px 1px 1px rgba(68, 68, 68, 0.3);
	color: #e1e1e1;
	font-size: 11px;
`;

const TransactionAmount = styled.span`
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

const TransactionHistory = ({
	transactions = [],
	activeTab = 'expense',
	pagination,
	currencySymbol = '₽',
	periodLabel = 'месяц',
	hasFilters = false,
	onTransactionClick,
	onPageChange,
}) => {
	const hasTransactions = transactions.length > 0;

	const handleTransactionClick = transactionId => {
		if (onTransactionClick && transactionId) {
			onTransactionClick(transactionId);
		}
	};

	const getBackgroundColor = (index) => {
		return index % 2 === 0 ? '#6b6b6b' : '#adadad';
	};

	return (
		<TransactionsSection>
			<SectionTitle>
				{activeTab === 'income' ? 'Последние доходы' : 'Последние расходы'}
				{hasTransactions && ` (${pagination?.total || 0} всего)`}
			</SectionTitle>

			{hasTransactions ? (
				<>
					<TransactionList>
						{transactions.map((transaction, index) => {
							if (!transaction) return null;

							const category = transaction.category;
							const amount = transaction.amount || 0;
							const categoryName = category?.name || 'Неизвестная категория';
							const categoryColor = category?.color || '#e1e1e1';
							const transactionId = transaction._id || transaction.id;
							const transactionDate = transaction.date ? new Date(transaction.date) : new Date();

							return (
								<TransactionItem
									key={transactionId}
									onClick={() => handleTransactionClick(transactionId)}
									$bgColor={getBackgroundColor(index)}
								>
									<TransactionInfo>
										<CategoryColor $color={categoryColor} />
										<CategoryName>{categoryName}</CategoryName>
									</TransactionInfo>
									
									<TransactionDetails>
										<TransactionDate>
											{formatDate(transactionDate)}
										</TransactionDate>
										<TransactionTime>
											{formatTime(transactionDate)}
										</TransactionTime>
									</TransactionDetails>
									
									<TransactionAmount $type={transaction.type}>
										{transaction.type === 'income' ? '+' : '-'}
										{amount.toLocaleString('ru-RU')} {currencySymbol}
									</TransactionAmount>
								</TransactionItem>
							);
						})}
					</TransactionList>

					{pagination && pagination.pages > 1 && (
						<Pagination
							currentPage={pagination.page || 1}
							totalPages={pagination.pages || 1}
							totalCount={pagination.total || 0}
							limit={pagination.limit || 10}
							onPageChange={onPageChange}
							showPageSize={false}
						/>
					)}
				</>
			) : (
				<NoDataMessage>
					{hasFilters
						? 'По заданным фильтрам транзакций не найдено'
						: activeTab === 'expense'
							? `За ${periodLabel.toLowerCase()} расходов не было`
							: `За ${periodLabel.toLowerCase()} доходов не было`}
				</NoDataMessage>
			)}
		</TransactionsSection>
	);
};

TransactionHistory.propTypes = {
	transactions: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string,
			id: PropTypes.string,
			amount: PropTypes.number,
			type: PropTypes.oneOf(['income', 'expense']),
			date: PropTypes.string,
			category: PropTypes.shape({
				_id: PropTypes.string,
				name: PropTypes.string,
				color: PropTypes.string,
			}),
		})
	),
	activeTab: PropTypes.oneOf(['income', 'expense']),
	pagination: PropTypes.shape({
		page: PropTypes.number,
		pages: PropTypes.number,
		total: PropTypes.number,
		limit: PropTypes.number,
	}),
	currencySymbol: PropTypes.string,
	periodLabel: PropTypes.string,
	hasFilters: PropTypes.bool,
	onTransactionClick: PropTypes.func,
	onPageChange: PropTypes.func,
};

export default TransactionHistory;