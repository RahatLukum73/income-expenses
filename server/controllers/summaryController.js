// controllers/summaryController.js
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

const getSummary = async (req, res) => {
	try {
		const { startDate, endDate } = req.query;

		const start = startDate
			? new Date(startDate)
			: new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		const end = endDate
			? new Date(endDate)
			: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

		end.setHours(23, 59, 59, 999);

		const incomeExpenseStats = await Transaction.aggregate([
			{
				$match: {
					userId: req.user._id,
					date: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: '$type',
					total: { $sum: '$amount' },
					count: { $sum: 1 },
				},
			},
		]);

		const accountsBalance = await Account.aggregate([
			{
				$match: { userId: req.user._id },
			},
			{
				$group: {
					_id: null,
					totalBalance: { $sum: '$balance' },
				},
			},
		]);

		let totalIncome = 0;
		let totalExpense = 0;
		let incomeCount = 0;
		let expenseCount = 0;

		incomeExpenseStats.forEach(stat => {
			if (stat._id === 'income') {
				totalIncome = stat.total;
				incomeCount = stat.count;
			} else if (stat._id === 'expense') {
				totalExpense = stat.total;
				expenseCount = stat.count;
			}
		});

		const netIncome = totalIncome - totalExpense;
		const totalBalance = accountsBalance[0]?.totalBalance || 0;

		const total = totalIncome + totalExpense;
		const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;
		const expensePercentage = total > 0 ? (totalExpense / total) * 100 : 0;

		res.json({
			error: null,
			summary: {
				period: {
					startDate: start,
					endDate: end,
				},
				income: {
					total: totalIncome,
					count: incomeCount,
					percentage: incomePercentage.toFixed(1),
				},
				expense: {
					total: totalExpense,
					count: expenseCount,
					percentage: expensePercentage.toFixed(1),
				},
				netIncome,
				totalBalance,
				incomeExpenseRatio: {
					incomePercentage: incomePercentage.toFixed(1),
					expensePercentage: expensePercentage.toFixed(1),
				},
			},
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getDailySummary = async (req, res) => {
	try {
		const { startDate, endDate } = req.query;

		const start = startDate
			? new Date(startDate)
			: new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		const end = endDate ? new Date(endDate) : new Date();
		end.setHours(23, 59, 59, 999);

		const dailyStats = await Transaction.aggregate([
			{
				$match: {
					userId: req.user._id,
					date: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: {
						date: {
							$dateToString: {
								format: '%Y-%m-%d',
								date: '$date',
							},
						},
						type: '$type',
					},
					total: { $sum: '$amount' },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { '_id.date': 1 },
			},
		]);

		const dailyData = {};
		dailyStats.forEach(stat => {
			const date = stat._id.date;
			const type = stat._id.type;

			if (!dailyData[date]) {
				dailyData[date] = {
					date,
					income: 0,
					expense: 0,
					netIncome: 0,
					transactions: 0,
				};
			}

			dailyData[date][type] = stat.total;
			dailyData[date].netIncome = dailyData[date].income - dailyData[date].expense;
			dailyData[date].transactions += stat.count;
		});

		const result = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

		res.json({
			error: null,
			dailySummary: result,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getExpenseCategoriesPie = async (req, res) => {
	try {
		const { startDate, endDate } = req.query;

		const start = startDate
			? new Date(startDate)
			: new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		const end = endDate
			? new Date(endDate)
			: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
		end.setHours(23, 59, 59, 999);

		const categoryStats = await Transaction.aggregate([
			{
				$match: {
					userId: req.user._id,
					type: 'expense',
					date: { $gte: start, $lte: end },
				},
			},
			{
				$lookup: {
					from: 'categories',
					localField: 'categoryId',
					foreignField: '_id',
					as: 'category',
				},
			},
			{
				$unwind: '$category',
			},
			{
				$group: {
					_id: {
						categoryId: '$categoryId',
						categoryName: '$category.name',
						color: '$category.color',
						icon: '$category.icon',
					},
					total: { $sum: '$amount' },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { total: -1 },
			},
		]);

		const totalExpenses = categoryStats.reduce((sum, stat) => sum + stat.total, 0);

		const pieData = categoryStats.map(stat => ({
			categoryId: stat._id.categoryId,
			name: stat._id.categoryName,
			value: stat.total,
			count: stat.count,
			color: stat._id.color,
			icon: stat._id.icon,
			percentage: totalExpenses > 0 ? ((stat.total / totalExpenses) * 100).toFixed(1) : 0,
		}));

		res.json({
			error: null,
			pieChart: {
				type: 'expenses',
				total: totalExpenses,
				data: pieData,
			},
			period: { startDate: start, endDate: end },
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getIncomeAccountsPie = async (req, res) => {
	try {
		const { startDate, endDate } = req.query;

		const start = startDate
			? new Date(startDate)
			: new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		const end = endDate
			? new Date(endDate)
			: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
		end.setHours(23, 59, 59, 999);

		const accountStats = await Transaction.aggregate([
			{
				$match: {
					userId: req.user._id,
					type: 'income',
					date: { $gte: start, $lte: end },
				},
			},
			{
				$lookup: {
					from: 'accounts',
					localField: 'accountId',
					foreignField: '_id',
					as: 'account',
				},
			},
			{
				$unwind: '$account',
			},
			{
				$group: {
					_id: {
						accountId: '$accountId',
						accountName: '$account.name',
						color: '$account.color',
						icon: '$account.icon',
					},
					total: { $sum: '$amount' },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { total: -1 },
			},
		]);

		const totalIncome = accountStats.reduce((sum, stat) => sum + stat.total, 0);

		const pieData = accountStats.map(stat => ({
			accountId: stat._id.accountId,
			name: stat._id.accountName,
			value: stat.total,
			count: stat.count,
			color: stat._id.color,
			icon: stat._id.icon,
			percentage: totalIncome > 0 ? ((stat.total / totalIncome) * 100).toFixed(1) : 0,
		}));

		res.json({
			error: null,
			pieChart: {
				type: 'income',
				total: totalIncome,
				data: pieData,
			},
			period: { startDate: start, endDate: end },
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getIncomeExpenseTrend = async (req, res) => {
	try {
		const { period = 'month', year = new Date().getFullYear() } = req.query;

		let groupFormat, startDate, endDate;

		switch (period) {
			case 'year':
				groupFormat = '%Y-%m';
				startDate = new Date(year, 0, 1);
				endDate = new Date(year, 11, 31, 23, 59, 59, 999);
				break;
			case 'month':
			default:
				groupFormat = '%Y-%m-%d';
				const currentDate = new Date();
				startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
				endDate = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth() + 1,
					0,
					23,
					59,
					59,
					999,
				);
				break;
		}

		const trendData = await Transaction.aggregate([
			{
				$match: {
					userId: req.user._id,
					date: { $gte: startDate, $lte: endDate },
				},
			},
			{
				$group: {
					_id: {
						period: {
							$dateToString: {
								format: groupFormat,
								date: '$date',
							},
						},
						type: '$type',
					},
					total: { $sum: '$amount' },
				},
			},
			{
				$sort: { '_id.period': 1 },
			},
		]);

		const result = {};
		trendData.forEach(item => {
			const period = item._id.period;
			const type = item._id.type;

			if (!result[period]) {
				result[period] = {
					period,
					income: 0,
					expense: 0,
					net: 0,
				};
			}

			result[period][type] = item.total;
			result[period].net = result[period].income - result[period].expense;
		});

		const chartData = Object.values(result);

		res.json({
			error: null,
			trend: chartData,
			period: {
				type: period,
				startDate,
				endDate,
			},
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	getSummary,
	getDailySummary,
	getExpenseCategoriesPie,
	getIncomeAccountsPie,
	getIncomeExpenseTrend,
};
