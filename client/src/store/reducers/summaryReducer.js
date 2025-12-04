import { FETCH_SUMMARY_START, FETCH_SUMMARY_SUCCESS, FETCH_SUMMARY_FAIL } from '../actionTypes';

const initialState = {
	summary: null,
	loading: false,
	error: null,
};

export const summaryReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_SUMMARY_START:
			return {
				...state,
				loading: true,
				error: null,
			};

		case FETCH_SUMMARY_SUCCESS:
			return {
				...state,
				loading: false,
				summary: action.payload,
				error: null,
			};

		case FETCH_SUMMARY_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
				summary: null,
			};

		default:
			return state;
	}
};
