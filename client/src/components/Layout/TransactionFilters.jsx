import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input } from '../UI/Input/Input';
import MultiSelect from '../UI/MultiSelect/MultiSelect';
import Chip from '../UI/Chip/Chip';
import { Button } from '../UI/Button/Button';

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
	const [localFilters, setLocalFilters] = useState(filters);

	// Синхронизация с внешним состоянием
	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	const handleFilterChange = (key, value) => {
		const newFilters = { ...localFilters, [key]: value };
		setLocalFilters(newFilters);
		onFiltersChange(newFilters);
	};

	const handleReset = () => {
		const resetFilters = {
			search: '',
			categories: [],
			accounts: [],
		};
		setLocalFilters(resetFilters);
		if (onReset) {
			onReset();
		} else {
			onFiltersChange(resetFilters);
		}
	};

	// Получение названия категории по ID
	const getCategoryName = id => {
		const category = categories.find(cat => cat._id === id);
		return category ? category.name : 'Неизвестная категория';
	};

	// Получение названия счета по ID
	const getAccountName = id => {
		const account = accounts.find(acc => acc._id === id);
		return account ? account.name : 'Неизвестный счет';
	};

	// Подсчет активных фильтров
	const activeFiltersCount = [
		localFilters.search ? 1 : 0,
		localFilters.categories.length,
		localFilters.accounts.length,
	].reduce((a, b) => a + b, 0);

	// Рендер опции категории
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
						value={localFilters.search}
						onChange={e => handleFilterChange('search', e.target.value)}
					/>
				</FilterGroup>

				<FilterGroup>
					<FilterLabel>Категории</FilterLabel>
					<MultiSelect
						options={categories}
						selectedValues={localFilters.categories}
						onChange={values => handleFilterChange('categories', values)}
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
						selectedValues={localFilters.accounts}
						onChange={values => handleFilterChange('accounts', values)}
						placeholder="Выберите счета"
						getOptionLabel={acc => acc.name}
						getOptionValue={acc => acc._id}
					/>
				</FilterGroup>
			</FiltersGrid>

			{activeFiltersCount > 0 && (
				<SelectedFilters>
					{localFilters.search && (
						<Chip
							label={`Поиск: "${localFilters.search}"`}
							onRemove={() => handleFilterChange('search', '')}
						/>
					)}

					{localFilters.categories.map(categoryId => (
						<Chip
							key={categoryId}
							label={`Категория: ${getCategoryName(categoryId)}`}
							onRemove={() =>
								handleFilterChange(
									'categories',
									localFilters.categories.filter(id => id !== categoryId)
								)
							}
						/>
					))}

					{localFilters.accounts.map(accountId => (
						<Chip
							key={accountId}
							label={`Счет: ${getAccountName(accountId)}`}
							onRemove={() =>
								handleFilterChange(
									'accounts',
									localFilters.accounts.filter(id => id !== accountId)
								)
							}
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

export default TransactionFilters;
