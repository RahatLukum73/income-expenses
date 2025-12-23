import { getToken, setToken, removeToken } from '../utils/token';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiRequest = async (endpoint, options = {}) => {
	const url = `${BASE_URL}${endpoint}`;

	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
		...options,
	};

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

		if (response.status === 204) {
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error('API request failed:', error);
		throw error;
	}
};

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

export { getToken, setToken, removeToken };
