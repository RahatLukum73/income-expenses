const express = require('express');
const auth = require('../middlewares/auth');
const {
	getSummary,
	getDailySummary,
	getExpenseCategoriesPie,
	getIncomeAccountsPie,
	getIncomeExpenseTrend,
} = require('../controllers/summaryController');

const router = express.Router();

router.use(auth);

router.get('/', getSummary);
router.get('/daily', getDailySummary);
router.get('/expenses-pie', getExpenseCategoriesPie);
router.get('/income-pie', getIncomeAccountsPie);
router.get('/trends', getIncomeExpenseTrend);

module.exports = router;
