// utils/chartHelpers.js
export const calculateChartData = (transactions, categories) => {
	const transactionsArray = Array.isArray(transactions) ? transactions : [];
	const categoriesArray = Array.isArray(categories) ? categories : [];

	if (transactionsArray.length === 0 || categoriesArray.length === 0) {
		return [];
	}

	const categoryTotals = transactionsArray.reduce((acc, transaction) => {
		const categoryId = transaction.category?._id;
		if (!categoryId) return acc;

		if (!acc[categoryId]) {
			acc[categoryId] = 0;
		}
		acc[categoryId] += transaction.amount || 0;
		return acc;
	}, {});

	const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

	const chartData = Object.entries(categoryTotals).map(([categoryId, amount]) => {
		const category = categoriesArray.find(cat => cat._id?.toString() === categoryId?.toString());
		const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0;

		return {
			categoryId,
			categoryName: category ? category.name : 'Неизвестная категория',
			amount,
			percentage: parseFloat(percentage),
			color: category ? category.color : '#6c757d',
		};
	});

	return chartData.sort((a, b) => b.amount - a.amount);
};
