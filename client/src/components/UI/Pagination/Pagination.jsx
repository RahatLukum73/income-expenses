import PropTypes from 'prop-types';
import { Button } from '../Button/Button';
import styled from 'styled-components';

const PaginationContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	margin-top: 24px;
	padding-top: 24px;
	border-top: 1px solid #e9ecef;
`;

const PaginationInfo = styled.div`
	font-size: 14px;
	color: #6c757d;
	text-align: center;
`;

const PaginationControls = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	justify-content: center;
`;

const PageButton = styled(Button)`
	min-width: 40px;
	height: 40px;
	padding: 0;
	font-weight: ${props => (props.$active ? '600' : '400')};
	background: ${props => (props.$active ? '#007bff' : 'white')};
	color: ${props => (props.$active ? 'white' : '#007bff')};
	border: 1px solid ${props => (props.$active ? '#007bff' : '#dee2e6')};

	&:hover:not(:disabled) {
		background: ${props => (props.$active ? '#0056b3' : '#f8f9fa')};
		border-color: ${props => (props.$active ? '#0056b3' : '#007bff')};
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

const Ellipsis = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	color: #6c757d;
	font-size: 14px;
`;

const PageSizeSelect = styled.select`
	padding: 8px 12px;
	border: 1px solid #dee2e6;
	border-radius: 8px;
	font-size: 14px;
	color: #333;
	background: white;
	cursor: pointer;

	&:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}
`;

const PageSizeOption = styled.option`
	padding: 8px;
`;

const Pagination = ({
	currentPage = 1,
	totalPages = 1,
	totalCount = 0,
	limit = 10,
	onPageChange,
	onLimitChange,
	showPageSize = true,
}) => {
	if (totalPages <= 1 && !showPageSize) {
		return null;
	}

	const getDisplayedPages = () => {
		const maxDisplayed = 5;
		const halfDisplayed = Math.floor(maxDisplayed / 2);

		let startPage = Math.max(1, currentPage - halfDisplayed);
		let endPage = Math.min(totalPages, currentPage + halfDisplayed);

		if (currentPage <= halfDisplayed) {
			endPage = Math.min(totalPages, maxDisplayed);
		}

		if (currentPage > totalPages - halfDisplayed) {
			startPage = Math.max(1, totalPages - maxDisplayed + 1);
		}

		const pages = [];
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
	};

	const displayedPages = getDisplayedPages();
	const startItem = Math.min((currentPage - 1) * limit + 1, totalCount);
	const endItem = Math.min(currentPage * limit, totalCount);

	const handlePageClick = page => {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			onPageChange(page);
		}
	};

	const handleLimitChange = e => {
		const newLimit = parseInt(e.target.value);
		if (onLimitChange) {
			onLimitChange(newLimit);
		}
	};

	const pageSizeOptions = [
		{ value: 10, label: '10' },
		{ value: 25, label: '25' },
		{ value: 50, label: '50' },
	];

	return (
		<PaginationContainer>
			<PaginationInfo>
				Показано {startItem}-{endItem} из {totalCount} транзакций
			</PaginationInfo>

			<PaginationControls>
				<PageButton
					$variant="secondary"
					onClick={() => handlePageClick(currentPage - 1)}
					disabled={currentPage === 1}
					title="Предыдущая страница"
				>
					←
				</PageButton>

				{displayedPages[0] > 1 && (
					<>
						<PageButton
							$variant="secondary"
							onClick={() => handlePageClick(1)}
							$active={currentPage === 1}
						>
							1
						</PageButton>
						{displayedPages[0] > 2 && <Ellipsis>...</Ellipsis>}
					</>
				)}

				{displayedPages.map(page => (
					<PageButton
						key={page}
						$variant="secondary"
						onClick={() => handlePageClick(page)}
						$active={currentPage === page}
					>
						{page}
					</PageButton>
				))}

				{displayedPages[displayedPages.length - 1] < totalPages && (
					<>
						{displayedPages[displayedPages.length - 1] < totalPages - 1 && <Ellipsis>...</Ellipsis>}
						<PageButton
							$variant="secondary"
							onClick={() => handlePageClick(totalPages)}
							$active={currentPage === totalPages}
						>
							{totalPages}
						</PageButton>
					</>
				)}

				<PageButton
					$variant="secondary"
					onClick={() => handlePageClick(currentPage + 1)}
					disabled={currentPage === totalPages}
					title="Следующая страница"
				>
					→
				</PageButton>

				{showPageSize && (
					<PageSizeSelect value={limit} onChange={handleLimitChange} title="Количество на странице">
						{pageSizeOptions.map(option => (
							<PageSizeOption key={option.value} value={option.value}>
								{option.label} на странице
							</PageSizeOption>
						))}
					</PageSizeSelect>
				)}
			</PaginationControls>
		</PaginationContainer>
	);
};

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	totalCount: PropTypes.number.isRequired,
	limit: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	onLimitChange: PropTypes.func,
	showPageSize: PropTypes.bool,
};

Pagination.defaultProps = {
	showPageSize: true,
};

export default Pagination;
