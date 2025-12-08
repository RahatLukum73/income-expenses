// // utils/dateHelpers.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
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

// [ИЗМЕНЕНИЕ] Функция для получения дат периода - ИСПРАВЛЕНА!
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

	// [ИЗМЕНЕНИЕ] Возвращаем ISO строки с полным временем
	return {
		startDate: startDate.toISOString(), // Пример: '2025-11-07T00:00:00.000Z'
		endDate: endDate.toISOString(),     // Пример: '2025-12-07T23:59:59.999Z'
	};
};

// [ИЗМЕНЕНИЕ] Добавляем вспомогательную функцию для старых компонентов
export const getPeriodDatesShort = period => {
	const dates = getPeriodDates(period);
	return {
		startDate: dates.startDate.split('T')[0], // Только дата
		endDate: dates.endDate.split('T')[0],     // Только дата
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