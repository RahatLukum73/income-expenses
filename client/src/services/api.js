import { getToken, setToken, removeToken } from '../utils/token';

//const BASE_URL = 'http://localhost:3001/api';
const BASE_URL = import.meta.env.MODE === 'development' ? '/api' : 'http://localhost:3001/api';

// Базовая функция для API запросов
export const apiRequest = async (endpoint, options = {}) => {
	const url = `${BASE_URL}${endpoint}`;

	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
		...options,
	};

	// Добавляем токен авторизации, если он есть
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	try {
		const response = await fetch(url, config);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}

		// Для DELETE запросов может не быть тела ответа
		if (response.status === 204) {
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error('API request failed:', error);
		throw error;
	}
};

// Функции-обертки для различных HTTP методов
export const get = url => apiRequest(url, { method: 'GET' });

export const post = (url, data) =>
	apiRequest(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});

export const put = (url, data) =>
	apiRequest(url, {
		method: 'PUT',
		body: JSON.stringify(data),
	});

export const del = url => apiRequest(url, { method: 'DELETE' });



// Re-export утилит для работы с токеном для удобства
export { getToken, setToken, removeToken };
