/**
 * Утилиты для нормализации данных с сервера
 */

// Основная функция нормализации транзакции
export const normalizeTransaction = transactionData => {
	if (!transactionData) return null;

	// Извлекаем транзакцию из ответа сервера
	const transaction = transactionData.transaction || transactionData;
	if (!transaction) return null;

	return {
		// Идентификаторы
		_id: transaction._id,
		id: transaction._id || transaction.id,

		// Основные данные
		amount: transaction.amount || 0,
		type: transaction.type || 'expense',
		description: transaction.description || '',
		date: transaction.date,
		createdAt: transaction.createdAt,
		updatedAt: transaction.updatedAt,

		// Связанные данные (нормализованные)
		account: normalizeAccount(transaction.accountId),
		category: normalizeCategory(transaction.categoryId),

		// ID для форм (строки)
		accountId: extractId(transaction.accountId),
		categoryId: extractId(transaction.categoryId),
	};
};

// Нормализация списка транзакций
export const normalizeTransactions = transactionsData => {
	if (!transactionsData) return [];

	// Если это ответ от API с полем transactions
	if (transactionsData.transactions && Array.isArray(transactionsData.transactions)) {
		return transactionsData.transactions.map(normalizeTransaction);
	}

	// Если это просто массив
	if (Array.isArray(transactionsData)) {
		return transactionsData.map(normalizeTransaction);
	}

	// Если это объект, ищем любой массив внутри
	if (typeof transactionsData === 'object') {
		for (const key in transactionsData) {
			if (Array.isArray(transactionsData[key])) {
				return transactionsData[key].map(normalizeTransaction);
			}
		}
	}

	return [];
};

// Нормализация счета
export const normalizeAccount = accountData => {
	if (!accountData) return null;

	// Если это строка (ID), возвращаем минимальный объект
	if (typeof accountData === 'string') {
		return {
			_id: accountData,
			id: accountData,
			name: 'Неизвестный счет',
			balance: 0,
			currency: '₽',
			color: '#3B82F6',
			icon: 'wallet',
			transactionCount: 0,
		};
	}

	// Если это объект
	return {
		_id: accountData._id || accountData.id,
		id: accountData._id || accountData.id,
		name: accountData.name || 'Неизвестный счет',
		balance: accountData.balance || 0,
		currency: accountData.currency || '₽',
		color: accountData.color || '#3B82F6',
		icon: accountData.icon || 'wallet',
		transactionCount: accountData.transactionCount || 0,
		userId: accountData.userId,
		createdAt: accountData.createdAt,
		updatedAt: accountData.updatedAt,
	};
};

// Нормализация категории
export const normalizeCategory = categoryData => {
	if (!categoryData) return null;

	// Если это строка (ID), возвращаем минимальный объект
	if (typeof categoryData === 'string') {
		return {
			_id: categoryData,
			id: categoryData,
			name: 'Неизвестная категория',
			type: 'expense',
			color: '#6c757d',
			icon: 'other',
		};
	}

	// Если это объект
	return {
		_id: categoryData._id || categoryData.id,
		id: categoryData._id || categoryData.id,
		name: categoryData.name || 'Неизвестная категория',
		type: categoryData.type || 'expense',
		color: categoryData.color || '#6c757d',
		icon: categoryData.icon || 'other',
		createdAt: categoryData.createdAt,
		updatedAt: categoryData.updatedAt,
	};
};

// Нормализация списка счетов
export const normalizeAccounts = accountsData => {
	if (!accountsData) return [];

	// Если это объект с полем accounts
	if (accountsData.accounts && Array.isArray(accountsData.accounts)) {
		return accountsData.accounts.map(normalizeAccount);
	}

	// Если это просто массив
	if (Array.isArray(accountsData)) {
		return accountsData.map(normalizeAccount);
	}

	// Если это объект, ищем любой массив внутри
	if (typeof accountsData === 'object') {
		for (const key in accountsData) {
			if (Array.isArray(accountsData[key])) {
				return accountsData[key].map(normalizeAccount);
			}
		}
	}

	return [];
};

// Нормализация списка категорий
export const normalizeCategories = categoriesData => {
	if (!categoriesData) return [];

	// Если это объект с полем categories
	if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
		return categoriesData.categories.map(normalizeCategory);
	}

	// Если это просто массив
	if (Array.isArray(categoriesData)) {
		return categoriesData.map(normalizeCategory);
	}

	// Если это объект, ищем любой массив внутри
	if (typeof categoriesData === 'object') {
		for (const key in categoriesData) {
			if (Array.isArray(categoriesData[key])) {
				return categoriesData[key].map(normalizeCategory);
			}
		}
	}

	return [];
};

// Вспомогательная функция для извлечения ID
const extractId = item => {
	if (!item) return '';
	if (typeof item === 'string') return item;
	return item._id || item.id || '';
};

// Функция для подготовки данных формы
export const prepareTransactionForForm = transaction => {
	if (!transaction) return null;

	let dateObj;
	try {
		dateObj = new Date(transaction.date);
		if (isNaN(dateObj.getTime())) {
			dateObj = new Date();
		}
	} catch {
		dateObj = new Date();
	}

	// Безопасное извлечение accountId
	const getAccountId = () => {
		if (transaction.accountId) {
			if (typeof transaction.accountId === 'string') return transaction.accountId;
			if (typeof transaction.accountId === 'object') return transaction.accountId._id;
		}
		if (transaction.account && transaction.account._id) {
			return transaction.account._id;
		}
		return '';
	};

	// Безопасное извлечение categoryId
	const getCategoryId = () => {
		if (transaction.categoryId) {
			if (typeof transaction.categoryId === 'string') return transaction.categoryId;
			if (typeof transaction.categoryId === 'object') return transaction.categoryId._id;
		}
		if (transaction.category && transaction.category._id) {
			return transaction.category._id;
		}
		return '';
	};

	return {
		amount: transaction.amount ? transaction.amount.toString() : '',
		type: transaction.type || 'expense',
		accountId: getAccountId(),
		categoryId: getCategoryId(),
		description: transaction.description || '',
		date: dateObj.toISOString().split('T')[0],
		time: dateObj.toTimeString().slice(0, 5),
	};
};
