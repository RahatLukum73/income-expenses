import PropTypes from 'prop-types';
import styled from 'styled-components';
import Pagination from '../UI/Pagination/Pagination';
import { groupTransactionsByDate, formatTime } from '../../utils/dateHelpers';

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

const DateGroup = styled.div`
	margin-bottom: 24px;

	&:last-child {
		margin-bottom: 0;
	}
`;

const DateHeader = styled.div`
	font-size: 16px;
	font-weight: 600;
	color: #333;
	margin-bottom: 12px;
	padding-bottom: 8px;
	border-bottom: 2px solid #f8f9fa;
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

const CategoryColor = styled.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: ${props => props.color || '#007bff'};
`;

const CategoryName = styled.span`
	font-weight: 500;
	color: #333;
	flex: 1;
`;

const TransactionAmount = styled.span`
	font-weight: 600;
	font-size: 16px;
	color: ${props => (props.type === 'income' ? '#28a745' : '#dc3545')};
`;

const TransactionTime = styled.span`
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
	const groupedTransactions = groupTransactionsByDate(transactions);
	const hasTransactions = transactions.length > 0;

	const handleTransactionClick = transactionId => {
		if (onTransactionClick && transactionId) {
			onTransactionClick(transactionId);
		}
	};

	return (
		<TransactionsSection>
			<SectionTitle>
				{activeTab === 'income' ? 'Последние доходы' : 'Последние расходы'}
				{hasTransactions && ` (${pagination?.total || 0} всего)`}
			</SectionTitle>

			{Object.keys(groupedTransactions).length > 0 ? (
				<>
					{Object.entries(groupedTransactions).map(([dateGroup, transactionsInGroup]) => (
						<DateGroup key={dateGroup}>
							<DateHeader>{dateGroup}</DateHeader>
							<TransactionList>
								{transactionsInGroup.map(transaction => {
									if (!transaction) return null;

									const category = transaction.category;
									const amount = transaction.amount || 0;
									const categoryName = category?.name || 'Неизвестная категория';
									const categoryColor = category?.color || '#007bff';
									const transactionId = transaction._id || transaction.id;

									return (
										<TransactionItem
											key={transactionId}
											onClick={() => handleTransactionClick(transactionId)}
										>
											<TransactionInfo>
												<CategoryColor color={categoryColor} />
												<CategoryName>{categoryName}</CategoryName>
												<TransactionTime>{formatTime(transaction.date)}</TransactionTime>
											</TransactionInfo>
											<TransactionAmount type={transaction.type}>
												{transaction.type === 'income' ? '+' : '-'}
												{amount.toLocaleString('ru-RU')} {currencySymbol}
											</TransactionAmount>
										</TransactionItem>
									);
								})}
							</TransactionList>
						</DateGroup>
					))}

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
