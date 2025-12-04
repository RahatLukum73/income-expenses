import {
	AUTH_START,
	AUTH_SUCCESS,
	AUTH_FAIL,
	AUTH_LOGOUT,
	CLEAR_ERROR,
} from '../actionTypes';

const initialState = {
	user: null,
	token: null,
	isLoggedIn: false,
	loading: true,
	error: null,
};

export const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case AUTH_START:
			return {
				...state,
				loading: true,
				error: null,
			};

		case AUTH_SUCCESS:
			return {
				...state,
				loading: false,
				user: action.payload.user,
				token: action.payload.token,
				isLoggedIn: true,
				error: null,
			};

		case AUTH_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
				user: null,
				token: null,
				isLoggedIn: false,
			};

		case AUTH_LOGOUT:
			return {
				...initialState,
			};

		case CLEAR_ERROR:
			return {
				...state,
				error: null,
			};

		default:
			return state;
	}
};
