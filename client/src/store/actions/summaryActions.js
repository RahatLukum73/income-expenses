import { FETCH_SUMMARY_START, FETCH_SUMMARY_SUCCESS, FETCH_SUMMARY_FAIL } from '../actionTypes';
import { get } from '../../services/api';

export const fetchSummaryStart = () => ({
	type: FETCH_SUMMARY_START,
});

export const fetchSummarySuccess = summary => ({
	type: FETCH_SUMMARY_SUCCESS,
	payload: summary,
});

export const fetchSummaryFail = error => ({
	type: FETCH_SUMMARY_FAIL,
	payload: error,
});

export const fetchSummary = () => {
	return async dispatch => {
		dispatch(fetchSummaryStart());
		try {
			const response = await get('/summary');
			dispatch(fetchSummarySuccess(response.summary));
		} catch (error) {
			dispatch(fetchSummaryFail(error.message));
		}
	};
};
