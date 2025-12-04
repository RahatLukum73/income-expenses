import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL, AUTH_LOGOUT, CLEAR_ERROR } from '../actionTypes';
import { post, setToken, removeToken, getToken, get, put } from '../../services/api';
import { fetchCategories } from './categoryActions';
import { fetchAccounts } from './accountActions';
import { fetchSummary } from './summaryActions';

export const authStart = () => ({
	type: AUTH_START,
});

export const authSuccess = (user, token) => ({
	type: AUTH_SUCCESS,
	payload: { user, token },
});

export const authFail = error => ({
	type: AUTH_FAIL,
	payload: error,
});

export const logout = () => ({
	type: AUTH_LOGOUT,
});

export const clearError = () => ({
	type: CLEAR_ERROR,
});

export const registerUser = ({ email, password, name }) => {
	return async dispatch => {
		dispatch(authStart());
		try {
			const response = await post('/register', { email, password, name });
			const { user, token } = response;

			setToken(token);
			dispatch(authSuccess(user, token));

			dispatch(fetchCategories());
			dispatch(fetchAccounts());
			dispatch(fetchSummary());
		} catch (error) {
			dispatch(authFail(error.message));
		}
	};
};

export const loginUser = ({ email, password }) => {
	return async dispatch => {
		dispatch(authStart());
		try {
			const response = await post('/login', { email, password });
			const { user, token } = response;

			setToken(token);
			dispatch(authSuccess(user, token));

			dispatch(fetchCategories());
			dispatch(fetchAccounts());
			dispatch(fetchSummary());
		} catch (error) {
			dispatch(authFail(error.message));
		}
	};
};

export const logoutUser = () => {
	return dispatch => {
		removeToken();
		dispatch(logout());
	};
};

export const getCurrentUser = () => {
	return async dispatch => {
		const token = getToken();
		if (!token) {
			dispatch(authFail('No token found'));
			return;
		}

		dispatch(authStart());
		try {
			const response = await get('/users/me');
			dispatch(authSuccess(response.user, token));

			dispatch(fetchCategories());
			dispatch(fetchAccounts());
			dispatch(fetchSummary());
		} catch (error) {
			// Если запрос не удался, удаляем невалидный токен
			removeToken();
			dispatch(authFail(error.message));
		}
	};
};

export const updateUserProfile = (userData) => {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await put('/users/me', userData);
      const { user, token } = response;

      // Если пришел новый токен, обновляем его
      if (token) {
        setToken(token);
      }

      dispatch(authSuccess(user, token || getToken()));
      return user;
    } catch (error) {
      dispatch(authFail(error.message));
      throw error;
    }
  };
};

export const changePassword = (passwordData) => {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await put('/users/me/password', passwordData);
      const { user, token } = response;

      if (token) {
        setToken(token);
      }

      dispatch(authSuccess(user, token || getToken()));
      return user;
    } catch (error) {
      dispatch(authFail(error.message));
      throw error;
    }
  };
};
