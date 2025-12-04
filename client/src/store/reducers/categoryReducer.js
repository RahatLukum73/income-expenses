import {
	FETCH_CATEGORIES_START,
	FETCH_CATEGORIES_SUCCESS,
	FETCH_CATEGORIES_FAIL,
	FETCH_CATEGORY_START,
	FETCH_CATEGORY_SUCCESS,
	FETCH_CATEGORY_FAIL,
} from '../actionTypes';

const initialState = {
	categories: [],
	currentCategory: null,
	loading: false,
	error: null,
};

export const categoryReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_CATEGORIES_START:
		case FETCH_CATEGORY_START:
			return {
				...state,
				loading: true,
				error: null,
			};

		case FETCH_CATEGORIES_SUCCESS:
			return {
				...state,
				loading: false,
				categories: action.payload,
				error: null,
			};
		case FETCH_CATEGORY_SUCCESS:
			return {
				...state,
				loading: false,
				currentCategory: action.payload,
				error: null,
			};

		case FETCH_CATEGORIES_FAIL:
		case FETCH_CATEGORY_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
				categories: [],
			};

		default:
			return state;
	}
};
