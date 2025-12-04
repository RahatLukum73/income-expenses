// routes/accounts.js
const express = require('express');
const auth = require('../middlewares/auth');
const {
	getAllAccounts,
	getAccountById,
	createAccount,
	updateAccount,
	deleteAccount,
} = require('../controllers/accountController');

const router = express.Router();

// Все роуты требуют аутентификации
router.use(auth);

router.get('/', getAllAccounts);
router.get('/:id', getAccountById);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;
