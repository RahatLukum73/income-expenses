const express = require('express');
const auth = require('../middlewares/auth');
const {
	getAllTransactions,
	getTransactionById,
	createTransaction,
	updateTransaction,
	deleteTransaction,
	getTransactionsByAccount,
	getTransactionsByCategory,
	getRecentTransactions,
} = require('../controllers/transactionController');

const router = express.Router();

// Все роуты требуют аутентификации
router.use(auth);

router.get('/', getAllTransactions);
router.get('/recent', getRecentTransactions);
router.get('/account/:accountId', getTransactionsByAccount);
router.get('/category/:categoryId', getTransactionsByCategory);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
