// src/hooks/useURLParams.js
import { useSearchParams, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export const useURLParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	const getParams = useCallback(() => {
		const params = {};

		const page = searchParams.get('page');
		if (page && !isNaN(page) && parseInt(page) > 0) {
			params.page = parseInt(page);
		}

		const type = searchParams.get('type');
		if (type) params.type = type;

		const period = searchParams.get('period');
		if (period) params.period = period;

		const search = searchParams.get('search');
		if (search) params.search = search;

		const categories = searchParams.get('categories');
		if (categories) {
			params.categories = categories.split(',').filter(id => id);
		}

		const accounts = searchParams.get('accounts');
		if (accounts) {
			params.accounts = accounts.split(',').filter(id => id);
		}

		return params;
	}, [searchParams]);

	const updateParams = useCallback(
		newParams => {
			const currentParams = Object.fromEntries(searchParams.entries());
			const mergedParams = { ...currentParams, ...newParams };

			Object.keys(mergedParams).forEach(key => {
				if (
					mergedParams[key] === null ||
					mergedParams[key] === undefined ||
					mergedParams[key] === ''
				) {
					delete mergedParams[key];
				}
			});

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

	const clearParams = useCallback(() => {
		setSearchParams({});
	}, [setSearchParams]);

	const params = useMemo(() => getParams(), [getParams]);

	return {
		params,
		updateParams,
		clearParams,
		searchParams,
		location, 
	};
};
