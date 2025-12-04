import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { summaryReducer } from './summaryReducer';
import { categoryReducer } from './categoryReducer';
import { accountReducer } from './accountReducer';
import { transactionReducer } from './transactionReducer';

const rootReducer = combineReducers({
	auth: authReducer,
	summary: summaryReducer,
	categories: categoryReducer,
	accounts: accountReducer,
	transactions: transactionReducer,
});

export default rootReducer;
