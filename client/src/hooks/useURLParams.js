// src/hooks/useURLParams.js
import { useSearchParams, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export const useURLParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	// Получение параметров из URL
	const getParams = useCallback(() => {
		const params = {};

		// page
		const page = searchParams.get('page');
		if (page && !isNaN(page) && parseInt(page) > 0) {
			params.page = parseInt(page);
		}

		// type
		const type = searchParams.get('type');
		if (type) params.type = type;

		// period
		const period = searchParams.get('period');
		if (period) params.period = period;

		// search
		const search = searchParams.get('search');
		if (search) params.search = search;

		// categories (массив)
		const categories = searchParams.get('categories');
		if (categories) {
			params.categories = categories.split(',').filter(id => id);
		}

		// accounts (массив)
		const accounts = searchParams.get('accounts');
		if (accounts) {
			params.accounts = accounts.split(',').filter(id => id);
		}

		return params;
	}, [searchParams]);

	// Обновление параметров в URL
	const updateParams = useCallback(
		newParams => {
			const currentParams = Object.fromEntries(searchParams.entries());
			const mergedParams = { ...currentParams, ...newParams };

			// Очищаем пустые значения
			Object.keys(mergedParams).forEach(key => {
				if (
					mergedParams[key] === null ||
					mergedParams[key] === undefined ||
					mergedParams[key] === ''
				) {
					delete mergedParams[key];
				}
			});

			// Обрабатываем массивы
			if (mergedParams.categories && Array.isArray(mergedParams.categories)) {
				mergedParams.categories = mergedParams.categories.join(',');
			}

			if (mergedParams.accounts && Array.isArray(mergedParams.accounts)) {
				mergedParams.accounts = mergedParams.accounts.join(',');
			}

			setSearchParams(mergedParams);
		},
		[searchParams, setSearchParams]
	);

	// Очистка всех параметров
	const clearParams = useCallback(() => {
		setSearchParams({});
	}, [setSearchParams]);

	const params = useMemo(() => getParams(), [getParams]);

	return {
		params,
		updateParams,
		clearParams,
		searchParams, // для дебага
		location, // для дебага
	};
};
