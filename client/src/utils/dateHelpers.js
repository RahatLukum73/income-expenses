// utils/dateHelpers.js - ДОБАВЛЯЕМ НОВЫЕ ФУНКЦИИ
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

// Функция для группировки дат (сегодня, вчера, и т.д.)
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

// Функция для получения дат периода
export const getPeriodDates = period => {
	const now = new Date();
	const startDate = new Date();

	switch (period) {
		case 'day':
			startDate.setHours(0, 0, 0, 0);
			break;
		case 'week':
			startDate.setDate(now.getDate() - 7);
			break;
		case 'month':
			startDate.setMonth(now.getMonth() - 1);
			break;
		case 'year':
			startDate.setFullYear(now.getFullYear() - 1);
			break;
		default:
			startDate.setMonth(now.getMonth() - 1);
	}

	return {
		startDate: startDate.toISOString().split('T')[0],
		endDate: now.toISOString().split('T')[0],
	};
};

// Функция для форматирования времени
export const formatTime = dateString => {
	return new Date(dateString).toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};
