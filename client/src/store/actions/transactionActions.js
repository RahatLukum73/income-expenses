// src/store/actions/transactionActions.js
import {
	FETCH_TRANSACTIONS_START,
	FETCH_TRANSACTIONS_SUCCESS,
	FETCH_TRANSACTIONS_FAIL,
	FETCH_TRANSACTION_START,
	FETCH_TRANSACTION_SUCCESS,
	FETCH_TRANSACTION_FAIL,
	CREATE_TRANSACTION_START,
	CREATE_TRANSACTION_SUCCESS,
	CREATE_TRANSACTION_FAIL,
	UPDATE_TRANSACTION_START,
	UPDATE_TRANSACTION_SUCCESS,
	UPDATE_TRANSACTION_FAIL,
	DELETE_TRANSACTION_START,
	DELETE_TRANSACTION_SUCCESS,
	DELETE_TRANSACTION_FAIL,
	CLEAR_CURRENT_TRANSACTION,
	CLEAR_TRANSACTIONS_ERROR,
	SET_TRANSACTIONS_FILTERS, // [ИЗМЕНЕНИЕ] Добавляем
} from '../actionTypes';
import { get, post, put, del } from '../../services/api';
import { normalizeTransaction, normalizeTransactions } from '../../utils/normalizers';

// [ИЗМЕНЕНИЕ] Action для установки фильтров
export const setTransactionsFilters = filters => ({
	type: SET_TRANSACTIONS_FILTERS,
	payload: filters,
});
// [ИЗМЕНЕНИЕ] Модифицируем fetchTransactions для использования фильтров из state
export const fetchTransactions = (params = {}) => {
	return async (dispatch, getState) => {
		// [ИЗМЕНЕНИЕ] Добавляем getState
		dispatch({ type: FETCH_TRANSACTIONS_START });

		try {
			const queryParams = new URLSearchParams();

			// [ИЗМЕНЕНИЕ] Базовые параметры пагинации
			queryParams.append('page', params.page || 1);
			queryParams.append('limit', params.limit || 10);

			// [ИЗМЕНЕНИЕ] Берем фильтры из params или из state
			const state = getState();
			const filters = params.filters || state.transactions.filters;

			// Добавляем фильтры в запрос
			if (filters.type) queryParams.append('type', filters.type);
			if (filters.startDate) queryParams.append('startDate', filters.startDate);
			if (filters.endDate) queryParams.append('endDate', filters.endDate);
			if (filters.search) queryParams.append('search', filters.search);
			if (filters.categories && filters.categories.length > 0) {
				queryParams.append('category', filters.categories.join(','));
			}
			if (filters.accounts && filters.accounts.length > 0) {
				queryParams.append('account', filters.accounts.join(','));
			}

			const queryString = queryParams.toString();
			const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`;

			const response = await get(endpoint);

			const normalizedTransactions = normalizeTransactions(response);

			dispatch({
				type: FETCH_TRANSACTIONS_SUCCESS,
				payload: {
					transactions: normalizedTransactions,
					pagination: response.pagination || null,
					stats: response.stats || null,
				},
			});
		} catch (error) {
			dispatch({
				type: FETCH_TRANSACTIONS_FAIL,
				payload: error.message,
			});
		}
	};
};

// Получение одной транзакции по ID
export const fetchTransaction = id => {
	return async dispatch => {
		dispatch({ type: FETCH_TRANSACTION_START });

		try {
			const response = await get(`/transactions/${id}`);

			// Нормализуем данные
			const normalizedTransaction = normalizeTransaction(response);

			dispatch({
				type: FETCH_TRANSACTION_SUCCESS,
				payload: normalizedTransaction,
			});
		} catch (error) {
			dispatch({
				type: FETCH_TRANSACTION_FAIL,
				payload: error.message,
			});
		}
	};
};

// Создание новой транзакции
export const createTransaction = transactionData => {
	return async dispatch => {
		 console.log('🎯 createTransaction action started');
    console.log('Transaction data:', transactionData);
		dispatch({ type: CREATE_TRANSACTION_START });

		try {
			console.log('📤 Making API request to /transactions');
			const response = await post('/transactions', transactionData);
			console.log('📥 API response:', response);

			// Нормализуем данные
			const normalizedTransaction = normalizeTransaction(response);
			console.log('📦 Normalized transaction:', normalizedTransaction);

			dispatch({
				type: CREATE_TRANSACTION_SUCCESS,
				payload: normalizedTransaction,
			});
console.log('✅ Transaction created successfully');
			return normalizedTransaction;
		} catch (error) {
			console.error('❌ Error in createTransaction:', error);
			dispatch({
				type: CREATE_TRANSACTION_FAIL,
				payload: error.message,
			});
			throw error;
		}
	};
};

// Обновление транзакции
export const updateTransaction = (id, updateData) => {
	return async dispatch => {
		dispatch({ type: UPDATE_TRANSACTION_START });

		try {
			const response = await put(`/transactions/${id}`, updateData);

			// Нормализуем данные
			const normalizedTransaction = normalizeTransaction(response);

			dispatch({
				type: UPDATE_TRANSACTION_SUCCESS,
				payload: normalizedTransaction,
			});

			return normalizedTransaction;
		} catch (error) {
			dispatch({
				type: UPDATE_TRANSACTION_FAIL,
				payload: error.message,
			});
			throw error;
		}
	};
};

// Удаление транзакции
export const deleteTransaction = id => {
	return async dispatch => {
		dispatch({ type: DELETE_TRANSACTION_START });

		try {
			await del(`/transactions/${id}`);

			dispatch({
				type: DELETE_TRANSACTION_SUCCESS,
				payload: id,
			});
		} catch (error) {
			dispatch({
				type: DELETE_TRANSACTION_FAIL,
				payload: error.message,
			});
			throw error;
		}
	};
};

// Очистка текущей транзакции (для форм редактирования)
export const clearCurrentTransaction = () => ({
	type: CLEAR_CURRENT_TRANSACTION,
});

// Очистка ошибок транзакций
export const clearTransactionsError = () => ({
	type: CLEAR_TRANSACTIONS_ERROR,
});

export const fetchTransactionsByCategory = (categoryId, params = {}) => {
	return async dispatch => {
		dispatch({ type: FETCH_TRANSACTIONS_START });

		try {
			const queryParams = new URLSearchParams();

			if (params.page) queryParams.append('page', params.page);
			if (params.limit) queryParams.append('limit', params.limit);
			if (params.startDate) queryParams.append('startDate', params.startDate);
			if (params.endDate) queryParams.append('endDate', params.endDate);

			const queryString = queryParams.toString();
			const endpoint = `/transactions/category/${categoryId}${queryString ? `?${queryString}` : ''}`;

			const response = await get(endpoint);

			// Нормализуем данные
			const normalizedTransactions = normalizeTransactions(response);

			dispatch({
				type: FETCH_TRANSACTIONS_SUCCESS,
				payload: {
					transactions: normalizedTransactions,
					pagination: response.pagination || null,
				},
			});
		} catch (error) {
			dispatch({
				type: FETCH_TRANSACTIONS_FAIL,
				payload: error.message,
			});
		}
	};
};
