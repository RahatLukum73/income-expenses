import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fetchSummary } from '../store/actions/summaryActions';
import { fetchCategories } from '../store/actions/categoryActions';
import { fetchAccounts } from '../store/actions/accountActions';
import { calculateChartData } from '../utils/chartHelpers';
import { useTransactions } from '../hooks/useTransactions';
import { Button } from '../components/UI/Button/Button';
import { Spinner } from '../components/UI/Spinner/Spinner';
import TransactionHistory from '../components/Layout/TransactionHistory'; // [ИЗМЕНЕНИЕ] Новый компонент
import TransactionFilters from '../components/Layout/TransactionFilters';
import PieChart from '../components/Charts/PieChart';
import { getCurrencySymbol } from '../utils/dateHelpers';

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

const ErrorMessage = styled.div`
	background: #f8d7da;
	color: #721c24;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 24px;
	text-align: center;
`;

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

	const activeTab = transactionFilters?.type || 'expense';
	const activePeriod = transactionFilters?.period || 'month';

	useEffect(() => {
		dispatch(fetchSummary());
		dispatch(fetchCategories());
		dispatch(fetchAccounts());
	}, [dispatch]);

	const handlePeriodChange = period => {
		updateFilters({
			...transactionFilters,
			period,
		});
	};

	const handleTabChange = tab => {
		updateFilters({
			...transactionFilters,
			type: tab,
		});
	};

	const handleFiltersChange = newFilters => {
		updateFilters({
			...transactionFilters,
			...newFilters,
		});
	};

	const handlePageChange = page => {
		changePage(page);
	};

	const handleTransactionClick = transactionId => {
		if (transactionId) {
			navigate(`/transaction/${transactionId}`);
		}
	};

	const currencySymbol = getCurrencySymbol(user?.currency || 'RUB');
	const transactionsArray = Array.isArray(transactions) ? transactions : [];
	const totalIncome = stats?.totalIncome || 0;
	const totalExpenses = stats?.totalExpenses || 0;

	const chartData = useMemo(() => {
		if (stats?.categoryStats && stats.categoryStats.length > 0) {
			const totalAmount = activeTab === 'income' ? stats.totalIncome : stats.totalExpenses;

			return stats.categoryStats
				.filter(item => {
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

		return calculateChartData(transactionsArray, categories);
	}, [stats, activeTab, categories, transactionsArray]);

	const loading = summaryLoading || categoriesLoading || accountsLoading || transactionsLoading;
	const error = summaryError || categoriesError || accountsError || transactionsError;

	const periods = [
		{ id: 'day', label: 'День' },
		{ id: 'week', label: 'Неделя' },
		{ id: 'month', label: 'Месяц' },
		{ id: 'year', label: 'Год' },
	];

	const activePeriodLabel = periods.find(p => p.id === activePeriod)?.label || 'месяц';
	const hasFilters = Boolean(
		transactionFilters?.search ||
			transactionFilters?.categories?.length > 0 ||
			transactionFilters?.accounts?.length > 0
	);

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

			<BalanceCard>
				<BalanceTitle>Общий баланс</BalanceTitle>
				<BalanceAmount>
					{summary?.totalBalance?.toLocaleString('ru-RU') || '0'} {currencySymbol}
				</BalanceAmount>
			</BalanceCard>

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

			<ToggleContainer>
				<ToggleButton $active={activeTab === 'expense'} onClick={() => handleTabChange('expense')}>
					РАСХОДЫ
				</ToggleButton>
				<ToggleButton $active={activeTab === 'income'} onClick={() => handleTabChange('income')}>
					ДОХОДЫ
				</ToggleButton>
			</ToggleContainer>

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

			<TransactionFilters
				filters={transactionFilters || {}}
				onFiltersChange={handleFiltersChange}
				categories={categories.filter(cat => cat.type === activeTab)}
				accounts={accounts}
				transactionsCount={transactionsArray.length}
			/>

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

			<TransactionHistory
				transactions={transactionsArray}
				activeTab={activeTab}
				pagination={pagination}
				currencySymbol={currencySymbol}
				periodLabel={activePeriodLabel}
				hasFilters={hasFilters}
				onTransactionClick={handleTransactionClick}
				onPageChange={handlePageChange}
			/>
		</DashboardContainer>
	);
};

// PropTypes остаются без изменений
StatAmount.propTypes = {
	color: PropTypes.string,
	children: PropTypes.node,
};

ToggleButton.propTypes = {
	$active: PropTypes.bool,
	onClick: PropTypes.func,
	children: PropTypes.node.isRequired,
};

PeriodButton.propTypes = {
	$active: PropTypes.bool,
	$variant: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.node.isRequired,
};

export default Dashboard;
