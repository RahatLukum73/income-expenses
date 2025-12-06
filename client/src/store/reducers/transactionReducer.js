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
	SET_TRANSACTIONS_FILTERS, // [ИЗМЕНЕНИЕ] Добавляем новый action type
} from '../actionTypes';

const initialState = {
	transactions: [],
	currentTransaction: null,
	loading: false,
	error: null,
	stats: {
		// [ДОБАВЛЯЕМ] Для статистики и диаграммы
		totalIncome: 0,
		totalExpenses: 0,
		categoryStats: [],
	},
	// [ИЗМЕНЕНИЕ] Приводим pagination в соответствие с API
	pagination: {
		page: 1, // текущая страница
		limit: 10, // элементов на странице
		total: 0, // всего элементов
		pages: 1, // всего страниц
	},
	// [ИЗМЕНЕНИЕ] Добавляем сохранение фильтров
	filters: {
		type: 'expense',
		period: 'month',
		startDate: '',
		endDate: '',
		search: '',
		categories: [],
		accounts: [],
	},
};

export const transactionReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TRANSACTIONS_START:
		case FETCH_TRANSACTION_START:
		case CREATE_TRANSACTION_START:
		case UPDATE_TRANSACTION_START:
		case DELETE_TRANSACTION_START:
			return {
				...state,
				loading: true,
				error: null,
			};

		case FETCH_TRANSACTIONS_SUCCESS:
			return {
				...state,
				loading: false,
				transactions: action.payload.transactions || [],
				// [ИЗМЕНЕНИЕ] Сохраняем пагинацию из API
				pagination: action.payload.pagination || state.pagination,
				stats: action.payload.stats || state.stats,
				error: null,
			};

		// [ИЗМЕНЕНИЕ] Добавляем обработчик для установки фильтров
		case SET_TRANSACTIONS_FILTERS:
			return {
				...state,
				filters: {
					...state.filters,
					...action.payload,
				},
				// [ИЗМЕНЕНИЕ] При изменении фильтров сбрасываем на первую страницу
				pagination: {
					...state.pagination,
					page: 1,
				},
			};

		// ... остальные case остаются без изменений
		case FETCH_TRANSACTION_SUCCESS:
			return {
				...state,
				loading: false,
				currentTransaction: action.payload,
				error: null,
			};

		case CREATE_TRANSACTION_SUCCESS:
			return {
				...state,
				loading: false,
				transactions: [action.payload, ...state.transactions],
				error: null,
			};

		case UPDATE_TRANSACTION_SUCCESS:
			return {
				...state,
				loading: false,
				transactions: state.transactions.map(transaction =>
					transaction._id === action.payload._id ? action.payload : transaction
				),
				currentTransaction: action.payload,
				error: null,
			};

		case DELETE_TRANSACTION_SUCCESS:
			return {
				...state,
				loading: false,
				transactions: state.transactions.filter(transaction => transaction._id !== action.payload),
				currentTransaction:
					state.currentTransaction && state.currentTransaction._id === action.payload
						? null
						: state.currentTransaction,
				error: null,
			};

		case FETCH_TRANSACTIONS_FAIL:
		case FETCH_TRANSACTION_FAIL:
		case CREATE_TRANSACTION_FAIL:
		case UPDATE_TRANSACTION_FAIL:
		case DELETE_TRANSACTION_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		case CLEAR_CURRENT_TRANSACTION:
			return {
				...state,
				currentTransaction: null,
			};

		case CLEAR_TRANSACTIONS_ERROR:
			return {
				...state,
				error: null,
			};

		default:
			return state;
	}
};
