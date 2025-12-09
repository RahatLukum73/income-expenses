import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../UI/Input/Input';
import MultiSelect from '../UI/MultiSelect/MultiSelect';
import Chip from '../UI/Chip/Chip';
import { Button } from '../UI/Button/Button';
import styled from 'styled-components';

const useDebounce = (callback, delay) => {
	const timeoutRef = useRef(null);

	const debouncedCallback = useCallback(
		(...args) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay]
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedCallback;
};

const FiltersContainer = styled.div`
	background: white;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	margin-bottom: 24px;
`;

const FiltersHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
`;

const FiltersTitle = styled.h3`
	margin: 0;
	color: #333;
	font-size: 18px;
	font-weight: 600;
`;

const FiltersCount = styled.span`
	background: #007bff;
	color: white;
	border-radius: 12px;
	padding: 4px 12px;
	font-size: 14px;
`;

const FiltersGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 16px;
	margin-bottom: 16px;
`;

const FilterGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const FilterLabel = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #495057;
`;

const SelectedFilters = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 16px;
	padding-top: 16px;
	border-top: 1px solid #e9ecef;
`;

const ActionButtons = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	margin-top: 16px;
`;

const CategoryOption = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const CategoryColor = styled.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: ${props => props.color || '#007bff'};
`;

const TransactionFilters = ({
	filters,
	onFiltersChange,
	onReset,
	categories = [],
	accounts = [],
	transactionsCount = 0,
}) => {
	const [localSearch, setLocalSearch] = useState(filters.search || '');
	const [localCategories, setLocalCategories] = useState(filters.categories || []);
	const [localAccounts, setLocalAccounts] = useState(filters.accounts || []);

	useEffect(() => {
		setLocalSearch(filters.search || '');
		setLocalCategories(filters.categories || []);
		setLocalAccounts(filters.accounts || []);
	}, [filters]);

	const debouncedSearchUpdate = useDebounce(searchValue => {
		onFiltersChange({
			...filters,
			search: searchValue,
		});
	}, 500);

	const handleSearchChange = e => {
		const value = e.target.value;
		setLocalSearch(value);
		debouncedSearchUpdate(value);
	};

	const handleCategoriesChange = values => {
		setLocalCategories(values);
		onFiltersChange({
			...filters,
			categories: values,
		});
	};

	const handleAccountsChange = values => {
		setLocalAccounts(values);
		onFiltersChange({
			...filters,
			accounts: values,
		});
	};

	const handleReset = () => {
		setLocalSearch('');
		setLocalCategories([]);
		setLocalAccounts([]);

		const resetFilters = {
			...filters,
			search: '',
			categories: [],
			accounts: [],
		};

		if (onReset) {
			onReset();
		} else {
			onFiltersChange(resetFilters);
		}
	};

	const handleRemoveCategory = categoryId => {
		const newCategories = localCategories.filter(id => id !== categoryId);
		setLocalCategories(newCategories);
		onFiltersChange({
			...filters,
			categories: newCategories,
		});
	};

	const handleRemoveAccount = accountId => {
		const newAccounts = localAccounts.filter(id => id !== accountId);
		setLocalAccounts(newAccounts);
		onFiltersChange({
			...filters,
			accounts: newAccounts,
		});
	};

	const handleClearSearch = () => {
		setLocalSearch('');
		onFiltersChange({
			...filters,
			search: '',
		});
	};

	const getCategoryName = id => {
		const category = categories.find(cat => cat._id === id);
		return category ? category.name : 'Неизвестная категория';
	};

	const getAccountName = id => {
		const account = accounts.find(acc => acc._id === id);
		return account ? account.name : 'Неизвестный счет';
	};

	const activeFiltersCount = [
		localSearch ? 1 : 0,
		localCategories.length,
		localAccounts.length,
	].reduce((a, b) => a + b, 0);

	const renderCategoryOption = category => (
		<CategoryOption>
			<CategoryColor color={category.color} />
			<span>{category.name}</span>
		</CategoryOption>
	);

	return (
		<FiltersContainer>
			<FiltersHeader>
				<FiltersTitle>Фильтры транзакций</FiltersTitle>
				<FiltersCount>Всего: {transactionsCount}</FiltersCount>
			</FiltersHeader>

			<FiltersGrid>
				<FilterGroup>
					<FilterLabel>Поиск по описанию</FilterLabel>
					<Input
						type="text"
						placeholder="Введите текст..."
						value={localSearch}
						onChange={handleSearchChange}
					/>
				</FilterGroup>

				<FilterGroup>
					<FilterLabel>Категории</FilterLabel>
					<MultiSelect
						options={categories}
						selectedValues={localCategories}
						onChange={handleCategoriesChange}
						placeholder="Выберите категории"
						renderOption={renderCategoryOption}
						getOptionLabel={cat => cat.name}
						getOptionValue={cat => cat._id}
					/>
				</FilterGroup>

				<FilterGroup>
					<FilterLabel>Счета</FilterLabel>
					<MultiSelect
						options={accounts}
						selectedValues={localAccounts}
						onChange={handleAccountsChange}
						placeholder="Выберите счета"
						getOptionLabel={acc => acc.name}
						getOptionValue={acc => acc._id}
					/>
				</FilterGroup>
			</FiltersGrid>

			{activeFiltersCount > 0 && (
				<SelectedFilters>
					{localSearch && <Chip label={`Поиск: "${localSearch}"`} onRemove={handleClearSearch} />}

					{localCategories.map(categoryId => (
						<Chip
							key={categoryId}
							label={`Категория: ${getCategoryName(categoryId)}`}
							onRemove={() => handleRemoveCategory(categoryId)}
						/>
					))}

					{localAccounts.map(accountId => (
						<Chip
							key={accountId}
							label={`Счет: ${getAccountName(accountId)}`}
							onRemove={() => handleRemoveAccount(accountId)}
						/>
					))}
				</SelectedFilters>
			)}

			<ActionButtons>
				<Button $variant="secondary" onClick={handleReset} disabled={activeFiltersCount === 0}>
					Сбросить фильтры
				</Button>
			</ActionButtons>
		</FiltersContainer>
	);
};

TransactionFilters.propTypes = {
	filters: PropTypes.object.isRequired,
	onFiltersChange: PropTypes.func.isRequired,
	onReset: PropTypes.func,
	categories: PropTypes.array,
	accounts: PropTypes.array,
	transactionsCount: PropTypes.number,
};

export default TransactionFilters;
