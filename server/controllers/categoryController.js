const Category = require('../models/Category');

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		res.json({ error: null, categories });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getCategoriesByType = async (req, res) => {
	try {
		const { type } = req.params;

		if (!['income', 'expense'].includes(type)) {
			return res
				.status(400)
				.json({ error: 'Неверный тип категории. Допустимо: income или expense' });
		}

		const categories = await Category.find({ type });
		res.json({ error: null, categories });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getCategoryById = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category) {
			return res.status(404).json({ error: 'Категория не найдена' });
		}

		res.json({ error: null, category });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getDefaultCategories = async (req, res) => {
	try {
		const categoriesCount = await Category.countDocuments();
		if (categoriesCount === 0) {
			await Category.insertMany(Category.defaultCategories);
		}

		const categories = await Category.find();
		res.json({ error: null, categories });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	getAllCategories,
	getCategoriesByType,
	getCategoryById,
	getDefaultCategories,
};
