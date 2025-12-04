// routes/categories.js
const express = require('express');
const auth = require('../middlewares/auth');
const {
	getAllCategories,
	getCategoriesByType,
	getCategoryById,
	getDefaultCategories,
} = require('../controllers/categoryController');

const router = express.Router();

// Все роуты требуют аутентификации
router.use(auth);

router.get('/', getAllCategories);
router.get('/default', getDefaultCategories);
router.get('/type/:type', getCategoriesByType);
router.get('/:id', getCategoryById);

module.exports = router;
