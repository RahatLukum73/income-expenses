export const formatDate = date => {
	return new Date(date).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
};

export const getCurrencySymbol = currency => {
	const symbols = {
		RUB: '₽',
		USD: '$',
		EUR: '€',
		KZT: '₸',
	};
	return symbols[currency] || currency;
};

export const groupTransactionsByDate = transactions => {
	if (!Array.isArray(transactions)) return {};

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const groups = {};

	transactions.forEach(transaction => {
		const transactionDate = new Date(transaction.date);
		transactionDate.setHours(0, 0, 0, 0);

		let groupKey;

		if (transactionDate.getTime() === today.getTime()) {
			groupKey = 'Сегодня';
		} else if (transactionDate.getTime() === yesterday.getTime()) {
			groupKey = 'Вчера';
		} else {
			groupKey = formatDate(transaction.date);
		}

		if (!groups[groupKey]) {
			groups[groupKey] = [];
		}

		groups[groupKey].push(transaction);
	});

	return groups;
};

export const getPeriodDates = period => {
	const now = new Date();
	const startDate = new Date();
	const endDate = new Date();

	switch (period) {
		case 'day':
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		case 'week':
			startDate.setDate(now.getDate() - 7);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		case 'month':
			startDate.setMonth(now.getMonth() - 1);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		case 'year':
			startDate.setFullYear(now.getFullYear() - 1);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		default:
			startDate.setMonth(now.getMonth() - 1);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
	}

	return {
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
	};
};

export const getPeriodDatesShort = period => {
	const dates = getPeriodDates(period);
	return {
		startDate: dates.startDate.split('T')[0],
		endDate: dates.endDate.split('T')[0],
	};
};


export const formatTime = dateString => {
	return new Date(dateString).toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};