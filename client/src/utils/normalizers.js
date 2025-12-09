export const normalizeTransaction = transactionData => {
	if (!transactionData) return null;

	const transaction = transactionData.transaction || transactionData;
	if (!transaction) return null;

	return {
		_id: transaction._id,
		id: transaction._id || transaction.id,

		amount: transaction.amount || 0,
		type: transaction.type || 'expense',
		description: transaction.description || '',
		date: transaction.date,
		createdAt: transaction.createdAt,
		updatedAt: transaction.updatedAt,

		account: normalizeAccount(transaction.accountId),
		category: normalizeCategory(transaction.categoryId),

		accountId: extractId(transaction.accountId),
		categoryId: extractId(transaction.categoryId),
	};
};

export const normalizeTransactions = transactionsData => {
	if (!transactionsData) return [];

	if (transactionsData.transactions && Array.isArray(transactionsData.transactions)) {
		return transactionsData.transactions.map(normalizeTransaction);
	}

	if (Array.isArray(transactionsData)) {
		return transactionsData.map(normalizeTransaction);
	}

	if (typeof transactionsData === 'object') {
		for (const key in transactionsData) {
			if (Array.isArray(transactionsData[key])) {
				return transactionsData[key].map(normalizeTransaction);
			}
		}
	}

	return [];
};

export const normalizeAccount = accountData => {
	if (!accountData) return null;

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

export const normalizeCategory = categoryData => {
	if (!categoryData) return null;

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

export const normalizeAccounts = accountsData => {
	if (!accountsData) return [];

	if (accountsData.accounts && Array.isArray(accountsData.accounts)) {
		return accountsData.accounts.map(normalizeAccount);
	}

	if (Array.isArray(accountsData)) {
		return accountsData.map(normalizeAccount);
	}

	if (typeof accountsData === 'object') {
		for (const key in accountsData) {
			if (Array.isArray(accountsData[key])) {
				return accountsData[key].map(normalizeAccount);
			}
		}
	}

	return [];
};

export const normalizeCategories = categoriesData => {
	if (!categoriesData) return [];

	if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
		return categoriesData.categories.map(normalizeCategory);
	}

	if (Array.isArray(categoriesData)) {
		return categoriesData.map(normalizeCategory);
	}

	if (typeof categoriesData === 'object') {
		for (const key in categoriesData) {
			if (Array.isArray(categoriesData[key])) {
				return categoriesData[key].map(normalizeCategory);
			}
		}
	}

	return [];
};

const extractId = item => {
	if (!item) return '';
	if (typeof item === 'string') return item;
	return item._id || item.id || '';
};

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
