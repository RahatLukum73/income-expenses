import {
	FETCH_CATEGORIES_START,
	FETCH_CATEGORIES_SUCCESS,
	FETCH_CATEGORIES_FAIL,
	FETCH_CATEGORY_START,
	FETCH_CATEGORY_SUCCESS,
	FETCH_CATEGORY_FAIL,
} from '../actionTypes';
import { get } from '../../services/api';
import { normalizeCategory, normalizeCategories } from '../../utils/normalizers';

export const fetchCategories = () => {
	return async dispatch => {
		dispatch({ type: FETCH_CATEGORIES_START });

		try {
			const response = await get('/categories');
			const normalizedCategories = normalizeCategories(response);

			dispatch({
				type: FETCH_CATEGORIES_SUCCESS,
				payload: normalizedCategories,
			});
		} catch (error) {
			dispatch({
				type: FETCH_CATEGORIES_FAIL,
				payload: error.message,
			});
		}
	};
};
export const fetchCategory = id => {
	return async dispatch => {
		dispatch({ type: FETCH_CATEGORY_START });

		try {
			const response = await get(`/categories/${id}`);
			const normalizedCategory = normalizeCategory(response.category);
			dispatch({
				type: FETCH_CATEGORY_SUCCESS,
				payload: normalizedCategory,
			});
		} catch (error) {
			dispatch({
				type: FETCH_CATEGORY_FAIL,
				payload: error.message,
			});
		}
	};
};
