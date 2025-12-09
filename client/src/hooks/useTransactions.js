import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useURLParams } from './useURLParams';
import { fetchTransactions, setTransactionsFilters } from '../store/actions/transactionActions';
import { getPeriodDates } from '../utils/dateHelpers';

export const useTransactions = () => {
	const dispatch = useDispatch();
	const { transactions, loading, error, pagination, filters, stats } = useSelector(
		state => state.transactions
	);

	const { params: urlParams, updateParams: updateURLParams } = useURLParams();

	const isInitialized = useRef(false);
	const isUpdatingFromUser = useRef(false);

	const loadTransactions = useCallback(
		(page = 1, customFilters = null, skipURLUpdate = false) => {
			const activeFilters = customFilters || filters;
			const { startDate, endDate } = getPeriodDates(activeFilters.period || 'month');

			if (!skipURLUpdate) {
				isUpdatingFromUser.current = true;
				updateURLParams({
					page,
					type: activeFilters.type,
					period: activeFilters.period,
					search: activeFilters.search || undefined,
					categories: activeFilters.categories?.length > 0 ? activeFilters.categories : undefined,
					accounts: activeFilters.accounts?.length > 0 ? activeFilters.accounts : undefined,
				});

				setTimeout(() => {
					isUpdatingFromUser.current = false;
				}, 100);
			}

			dispatch(
				fetchTransactions({
					page,
					limit: 20,
					filters: {
						...activeFilters,
						startDate,
						endDate,
					},
				})
			);
		},
		[dispatch, filters, updateURLParams]
	);

	useEffect(() => {
		if (isInitialized.current) return;

		const urlType = urlParams.type || 'expense';
		const urlPeriod = urlParams.period || 'month';
		const urlPage = urlParams.page || 1;

		const { startDate, endDate } = getPeriodDates(urlPeriod);

		const initialFilters = {
			type: urlType,
			period: urlPeriod,
			startDate,
			endDate,
			search: urlParams.search || '',
			categories: urlParams.categories || [],
			accounts: urlParams.accounts || [],
		};

		dispatch(setTransactionsFilters(initialFilters));

		dispatch(
			fetchTransactions({
				page: urlPage,
				limit: 20,
				filters: initialFilters,
			})
		);

		updateURLParams({
			page: urlPage,
			type: urlType,
			period: urlPeriod,
		});

		isInitialized.current = true;
	}, []);

	const updateFilters = useCallback(
		newFilters => {
			dispatch(setTransactionsFilters(newFilters));
			loadTransactions(1, newFilters, false);
		},
		[dispatch, loadTransactions]
	);

	const changePage = useCallback(
		page => {
			loadTransactions(page, filters, false);
		},
		[loadTransactions, filters]
	);

	return {
		transactions,
		loading,
		error,
		pagination,
		filters,
		stats,
		loadTransactions,
		updateFilters,
		changePage,
		urlParams,
	};
};
