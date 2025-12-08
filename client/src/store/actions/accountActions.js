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
import { get, post, put, del } from '../../services/api';
import { normalizeAccounts, normalizeAccount } from '../../utils/normalizers';

export const fetchAccounts = () => {
	return async dispatch => {
		dispatch({ type: FETCH_ACCOUNTS_START });

		try {
			const response = await get('/accounts');

			const accountsFromServer = response.accounts || [];
			const normalizedAccounts = normalizeAccounts(accountsFromServer);

			dispatch({
				type: FETCH_ACCOUNTS_SUCCESS,
				payload: normalizedAccounts,
			});
		} catch (error) {
			dispatch({
				type: FETCH_ACCOUNTS_FAIL,
				payload: error.message,
			});
		}
	};
};

// Создание счета
export const createAccount = accountData => {
	return async dispatch => {
		dispatch({ type: CREATE_ACCOUNT_START });

		try {
			const response = await post('/accounts', accountData);

			const accountFromServer = response.account || response;

			const normalizedAccount = normalizeAccount(accountFromServer);
			dispatch({
				type: CREATE_ACCOUNT_SUCCESS,
				payload: normalizedAccount,
			});

			return normalizedAccount;
		} catch (error) {
			dispatch({
				type: CREATE_ACCOUNT_FAIL,
				payload: error.message,
			});
			throw error;
		}
	};
};

// Обновление счета
export const updateAccount = (id, updateData) => {
	return async dispatch => {
		dispatch({ type: UPDATE_ACCOUNT_START });

		try {
			const response = await put(`/accounts/${id}`, updateData);

			const accountFromServer = response.account;
			const normalizedAccount = normalizeAccount(accountFromServer);

			dispatch({
				type: UPDATE_ACCOUNT_SUCCESS,
				payload: normalizedAccount,
			});

			return normalizedAccount;
		} catch (error) {
			dispatch({
				type: UPDATE_ACCOUNT_FAIL,
				payload: error.message,
			});
			throw error;
		}
	};
};

// Удаление счета
export const deleteAccount = id => {
	return async dispatch => {
		dispatch({ type: DELETE_ACCOUNT_START });

		try {
			await del(`/accounts/${id}`);

			dispatch({
				type: DELETE_ACCOUNT_SUCCESS,
				payload: id,
			});
		} catch (error) {
			// Проверяем, если это ошибка о наличии транзакций
			if (error.message.includes('Нельзя удалить счет с транзакциями')) {
				dispatch({
					type: DELETE_ACCOUNT_FAIL,
					payload:
						'Нельзя удалить счет, у которого есть транзакции. Сначала удалите или переместите транзакции.',
				});
			} else {
				dispatch({
					type: DELETE_ACCOUNT_FAIL,
					payload: error.message,
				});
			}
			throw error;
		}
	};
};
