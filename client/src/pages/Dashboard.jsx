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
import TransactionHistory from '../components/Layout/TransactionHistory';
import TransactionFilters from '../components/Layout/TransactionFilters';
import PieChart from '../components/Charts/PieChart';
import { getCurrencySymbol } from '../utils/dateHelpers';

const DashboardContainer = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 20px 0;
`;

const StatsContainer = styled.div`
	display: flex;
	margin-bottom: 10px;
	background: #353535;
	border-radius: 12px;
	box-shadow: 0 0 12px #222;
	overflow: hidden;
`;

const StatCard = styled.div`
	flex: 1;
	padding: 16px 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	transition: all 0.3s ease;
	background: ${props => (props.$active ? props.$bgColor : 'transparent')};
	min-height: 100%;
	cursor: pointer;

	&:first-child {
		border-right: 1px solid #444;
	}
`;

const ToggleButton = styled.button`
	font-weight: ${props => (props.$active ? 700 : 300)};
	color: ${props => (props.$active ? props.color : '#888')};
	border: none;
	background: none;
	font-size: 20px;

	&:hover {
		background: none;
		color: ${props => (props.$active ? props.color : '#aaa')};
	}
`;

const StatAmount = styled.div`
	font-size: 24px;
	align-self: center;
	font-weight: ${props => (props.$active ? 700 : 300)};
	color: ${props => (props.$active ? props.color : '#666')};
	transition: color 0.3s ease;
`;

const PeriodSelector = styled.div`
	display: flex;
	gap: 8px;
	border-radius: 12px;
	justify-content: space-between;
	background: #565656;
	padding: 12px 20px;
	box-shadow: 0 0 12px #222;
	margin-bottom: 10px;
`;

const PeriodButton = styled(Button)`
	flex: 1;
	padding: 12px 16px;
	box-shadow: ${props => (props.$active ? '0 0 8px rgba(249, 255, 224, 0.5)' : 'none')};
	background: ${props => (props.$active ? '#565656' : 'none')};
	color: ${props => (props.$active ? '#fff' : '#e1e1e1')};
	border: none;
	font-size: 20px;
	font-weight: 500;

	&:hover {
		background: none;
		box-shadow: 0 0 8px rgba(249, 255, 224, 0.5);
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

			<StatsContainer>
				<StatCard $active={activeTab === 'income'} $bgColor="rgba(40, 167, 69, 0.15)">
					<ToggleButton
						color="#28a745"
						$active={activeTab === 'income'}
						onClick={() => handleTabChange('income')}
					>
						ДОХОДЫ:
					</ToggleButton>
					<StatAmount color="#28a745" $active={activeTab === 'income'}>
						+{totalIncome.toLocaleString('ru-RU')} {currencySymbol}
					</StatAmount>
				</StatCard>
				<StatCard $active={activeTab === 'expense'} $bgColor="rgba(220, 53, 69, 0.15)">
					<ToggleButton
						color="#dc3545"
						$active={activeTab === 'expense'}
						onClick={() => handleTabChange('expense')}
					>
						РАСХОДЫ:
					</ToggleButton>
					<StatAmount color="#dc3545" $active={activeTab === 'expense'}>
						-{totalExpenses.toLocaleString('ru-RU')} {currencySymbol}
					</StatAmount>
				</StatCard>
			</StatsContainer>

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
				transactionsCount={pagination.total}
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

// Обновленные PropTypes
StatAmount.propTypes = {
	color: PropTypes.string,
	$active: PropTypes.bool,
	children: PropTypes.node,
};

ToggleButton.propTypes = {
	$active: PropTypes.bool,
	color: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.node.isRequired,
};

StatCard.propTypes = {
	$active: PropTypes.bool,
	bgColor: PropTypes.string,
	children: PropTypes.node,
};

PeriodButton.propTypes = {
	$active: PropTypes.bool,
	$variant: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.node.isRequired,
};

export default Dashboard;
