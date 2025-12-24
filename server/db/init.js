const Category = require('../models/Category');

module.exports = async function initDatabase() {
	const categoryCount = await Category.countDocuments();

	if (categoryCount === 0) {
		console.log('Инициализация БД: создание стандартных категорий...');
		await Category.insertMany(Category.defaultCategories);
		console.log(`✅ Создано ${Category.defaultCategories.length} категорий`);
	}

	return true;
};
