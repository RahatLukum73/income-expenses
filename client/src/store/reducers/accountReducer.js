import {
	FETCH_ACCOUNTS_START,
	FETCH_ACCOUNTS_SUCCESS,
	FETCH_ACCOUNTS_FAIL,
	CREATE_ACCOUNT_START,
	CREATE_ACCOUNT_SUCCESS,
	CREATE_ACCOUNT_FAIL,
	UPDATE_ACCOUNT_START,
	UPDATE_ACCOUNT_SUCCESS,
	UPDATE_ACCOUNT_FAIL,
	DELETE_ACCOUNT_START,
	DELETE_ACCOUNT_SUCCESS,
	DELETE_ACCOUNT_FAIL,
} from '../actionTypes';

const initialState = {
	accounts: [],
	loading: false,
	error: null,
};

export const accountReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_ACCOUNTS_START:
		case CREATE_ACCOUNT_START:
		case UPDATE_ACCOUNT_START:
		case DELETE_ACCOUNT_START:
			return {
				...state,
				loading: true,
				error: null,
			};

		case FETCH_ACCOUNTS_SUCCESS:
			return {
				...state,
				loading: false,
				accounts: action.payload,
				error: null,
			};

		case CREATE_ACCOUNT_SUCCESS:
			return {
				...state,
				loading: false,
				accounts: [...state.accounts, action.payload],
				error: null,
			};

		case UPDATE_ACCOUNT_SUCCESS:
			return {
				...state,
				loading: false,
				accounts: state.accounts.map(account =>
					account._id === action.payload._id ? action.payload : account
				),
				error: null,
			};

		case DELETE_ACCOUNT_SUCCESS:
			return {
				...state,
				loading: false,
				accounts: state.accounts.filter(account => account._id !== action.payload && account.id !== action.payload),
				error: null,
			};

		case FETCH_ACCOUNTS_FAIL:
		case CREATE_ACCOUNT_FAIL:
		case UPDATE_ACCOUNT_FAIL:
		case DELETE_ACCOUNT_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
				accounts: [],
			};

		default:
			return state;
	}
};
