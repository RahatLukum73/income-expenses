import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchSummary } from '../store/actions/summaryActions';
import { fetchCategories } from '../store/actions/categoryActions';
import { fetchAccounts } from '../store/actions/accountActions';
import { useTransactions } from '../hooks/useTransactions'; // [ИЗМЕНЕНИЕ] Новый хук
import { Button } from '../components/UI/Button/Button';
import { Spinner } from '../components/UI/Spinner/Spinner';
import Pagination from '../components/UI/Pagination/Pagination'; // [ИЗМЕНЕНИЕ] Добавляем
import TransactionFilters from '../components/Layout/TransactionFilters';
import PieChart from '../components/Charts/PieChart';
import {
	getCurrencySymbol,
	groupTransactionsByDate,
	getPeriodDates,
	formatTime,
} from '../utils/dateHelpers';

// Styled components
const DashboardContainer = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	padding-bottom: 100px;
`;

const BalanceCard = styled.div`
	background: white;
	border-radius: 12px;
	padding: 32px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	margin-bottom: 24px;
	text-align: center;
`;

const BalanceTitle = styled.h2`
	font-size: 16px;
	font-weight: 600;
	color: #6c757d;
	margin-bottom: 8px;
`;

const BalanceAmount = styled.div`
	font-size: 48px;
	font-weight: 700;
	color: #333;
`;

const StatsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-bottom: 24px;
`;

const StatCard = styled.div`
	background: white;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	text-align: center;
`;

const StatTitle = styled.div`
	font-size: 14px;
	color: #6c757d;
	margin-bottom: 8px;
`;

const StatAmount = styled.div`
	font-size: 24px;
	font-weight: 700;
	color: ${props => props.color || '#333'};
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

const PeriodSelector = styled.div`
	display: flex;
	gap: 8px;
	margin-bottom: 24px;
	justify-content: space-between;
`;

const PeriodButton = styled(Button)`
	flex: 1;
	padding: 8px 16px;
	background: ${props => (props.$active ? '#007bff' : 'white')};
	color: ${props => (props.$active ? 'white' : '#333')};
	border: 2px solid #e1e5e9;
	font-weight: 500;

	&:hover {
		background: ${props => (props.$active ? '#0056b3' : '#f8f9fa')};
		border-color: ${props => (props.$active ? '#0056b3' : '#007bff')};
	}
`;

const ChartsContainer = styled.div`
	display: grid;
	gap: 24px;
	margin-bottom: 24px;
`;

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

const ErrorMessage = styled.div`
	background: #f8d7da;
	color: #721c24;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 24px;
	text-align: center;
`;

// Функция для расчета данных диаграммы
const calculateChartData = (transactions, categories) => {
	const transactionsArray = Array.isArray(transactions) ? transactions : [];
	const categoriesArray = Array.isArray(categories) ? categories : [];

	if (transactionsArray.length === 0 || categoriesArray.length === 0) {
		return [];
	}

	const categoryTotals = transactionsArray.reduce((acc, transaction) => {
		const categoryId = transaction.category?._id;
		if (!categoryId) return acc;

		if (!acc[categoryId]) {
			acc[categoryId] = 0;
		}
		acc[categoryId] += transaction.amount || 0;
		return acc;
	}, {});

	const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

	const chartData = Object.entries(categoryTotals).map(([categoryId, amount]) => {
		const category = categoriesArray.find(cat => cat._id?.toString() === categoryId?.toString());
		const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0;

		return {
			categoryId,
			categoryName: category ? category.name : 'Неизвестная категория',
			amount,
			percentage: parseFloat(percentage),
			color: category ? category.color : '#6c757d',
		};
	});

	return chartData.sort((a, b) => b.amount - a.amount);
};

const Dashboard = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector(state => state.auth);
	const {
		summary,
		loading: summaryLoading,
		error: summaryError,
	} = useSelector(state => state.summary);
	const {
		categories,
		loading: categoriesLoading,
		error: categoriesError,
	} = useSelector(state => state.categories);
	const {
		accounts,
		loading: accountsLoading,
		error: accountsError,
	} = useSelector(state => state.accounts);

	// Используем хук useTransactions
	const {
		transactions,
		loading: transactionsLoading,
		error: transactionsError,
		pagination,
		filters: transactionFilters,
		stats,
		updateFilters,
		changePage,
	} = useTransactions();

	// [ИЗМЕНЯЕМ] Используем значения из filters вместо локального состояния
	const activeTab = transactionFilters?.type || 'expense';
	const activePeriod = transactionFilters?.period || 'month';

	// Загружаем данные при монтировании
	useEffect(() => {
		dispatch(fetchSummary());
		dispatch(fetchCategories());
		dispatch(fetchAccounts());
	}, [dispatch]);

	// [ИЗМЕНЯЕМ] Обработчик изменения периода
	const handlePeriodChange = period => {
		updateFilters({
			...transactionFilters,
			period,
		});
	};

	// [ИЗМЕНЯЕМ] Обработчик изменения вкладки
	const handleTabChange = tab => {
		updateFilters({
			...transactionFilters,
			type: tab,
		});
	};

	// Обработчик изменения фильтров
	const handleFiltersChange = newFilters => {
		updateFilters({
			...transactionFilters,
			...newFilters,
		});
	};

	// Обработчик изменения страницы
	const handlePageChange = page => {
		changePage(page);
	};

	// Получаем символ валюты
	const currencySymbol = getCurrencySymbol(user?.currency || 'RUB');

	// Используем transactions из хука
	const transactionsArray = Array.isArray(transactions) ? transactions : [];

	const totalIncome = stats?.totalIncome || 0;
	const totalExpenses = stats?.totalExpenses || 0;
	// [ИСПРАВЛЕНО] Диаграмма - используем функцию calculateChartData
	const chartData = useMemo(() => {
		// Если есть stats из API - используем их
		if (stats?.categoryStats && stats.categoryStats.length > 0) {
			const totalAmount = activeTab === 'income' ? stats.totalIncome : stats.totalExpenses;

			return stats.categoryStats
				.filter(item => {
					// Фильтруем по типу (income/expense)
					const category = categories.find(cat => cat._id === item.categoryId);
					return category?.type === activeTab;
				})
				.map(item => {
					const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;

					return {
						...item,
						percentage: parseFloat(percentage),
					};
				})
				.sort((a, b) => b.amount - a.amount);
		}

		// Fallback: используем старую логику если stats нет
		return calculateChartData(transactionsArray, categories);
	}, [stats, activeTab, categories, transactionsArray]);
	// Группируем транзакции по датам
	const groupedTransactions = useMemo(
		() => groupTransactionsByDate(transactionsArray),
		[transactionsArray]
	);

	const loading = summaryLoading || categoriesLoading || accountsLoading || transactionsLoading;
	const error = summaryError || categoriesError || accountsError || transactionsError;

	// Обработчик клика по транзакции
	const handleTransactionClick = transactionId => {
		if (transactionId) {
			navigate(`/transaction/${transactionId}`);
		}
	};

	// Периоды для фильтрации
	const periods = [
		{ id: 'day', label: 'День' },
		{ id: 'week', label: 'Неделя' },
		{ id: 'month', label: 'Месяц' },
		{ id: 'year', label: 'Год' },
	];

	if (loading && transactionsArray.length === 0) {
		return (
			<DashboardContainer>
				<Spinner />
			</DashboardContainer>
		);
	}

	return (
		<DashboardContainer>
			{error && <ErrorMessage>Ошибка загрузки данных: {error}</ErrorMessage>}

			{/* Блок баланса */}
			<BalanceCard>
				<BalanceTitle>Общий баланс</BalanceTitle>
				<BalanceAmount>
					{summary?.totalBalance?.toLocaleString('ru-RU') || '0'} {currencySymbol}
				</BalanceAmount>
			</BalanceCard>

			{/* Статистика за период */}
			<StatsContainer>
				<StatCard>
					<StatTitle>Доходы</StatTitle>
					<StatAmount color="#28a745">
						+{totalIncome.toLocaleString('ru-RU')} {currencySymbol}
					</StatAmount>
				</StatCard>

				<StatCard>
					<StatTitle>Расходы</StatTitle>
					<StatAmount color="#dc3545">
						-{totalExpenses.toLocaleString('ru-RU')} {currencySymbol}
					</StatAmount>
				</StatCard>
			</StatsContainer>

			{/* Переключатель расходы/доходы */}
			<ToggleContainer>
				<ToggleButton $active={activeTab === 'expense'} onClick={() => handleTabChange('expense')}>
					РАСХОДЫ
				</ToggleButton>
				<ToggleButton $active={activeTab === 'income'} onClick={() => handleTabChange('income')}>
					ДОХОДЫ
				</ToggleButton>
			</ToggleContainer>

			{/* Выбор периода */}
			<PeriodSelector>
				{periods.map(period => (
					<PeriodButton
						key={period.id}
						$active={activePeriod === period.id}
						onClick={() => handlePeriodChange(period.id)}
						$variant="secondary"
					>
						{period.label}
					</PeriodButton>
				))}
			</PeriodSelector>

			{/* Фильтры транзакций */}
			<TransactionFilters
				filters={transactionFilters || {}}
				onFiltersChange={handleFiltersChange}
				categories={categories.filter(cat => cat.type === activeTab)}
				accounts={accounts}
				transactionsCount={transactionsArray.length}
			/>

			{/* Круговая диаграмма - [ИСПРАВЛЕНО] проверяем chartData */}
			{chartData && chartData.length > 0 && (
				<ChartsContainer>
					<PieChart
						data={chartData}
						type={activeTab}
						title={activeTab === 'income' ? 'Распределение доходов' : 'Распределение расходов'}
						activeTab={activeTab}
					/>
				</ChartsContainer>
			)}

			{/* Список транзакций */}
			<TransactionsSection>
				<SectionTitle>
					{activeTab === 'income' ? 'Последние доходы' : 'Последние расходы'}
					{transactionsArray.length > 0 && ` (${pagination?.total || 0} всего)`}
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

						{/* Добавляем пагинацию */}
						{pagination && pagination.pages > 1 && (
							<Pagination
								currentPage={pagination.page || 1}
								totalPages={pagination.pages || 1}
								totalCount={pagination.total || 0}
								limit={pagination.limit || 10}
								onPageChange={handlePageChange}
								showPageSize={false}
							/>
						)}
					</>
				) : (
					<NoDataMessage>
						{transactionFilters?.search ||
						transactionFilters?.categories?.length > 0 ||
						transactionFilters?.accounts?.length > 0
							? 'По заданным фильтрам транзакций не найдено'
							: activeTab === 'expense'
								? `За ${periods.find(p => p.id === activePeriod)?.label?.toLowerCase()} расходов не было`
								: `За ${periods.find(p => p.id === activePeriod)?.label?.toLowerCase()} доходов не было`}
					</NoDataMessage>
				)}
			</TransactionsSection>
		</DashboardContainer>
	);
};

export default Dashboard;
