import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '../Button/Button';

const MultiSelectContainer = styled.div`
	position: relative;
	width: 100%;
`;

const SelectButton = styled(Button)`
	width: 100%;
	justify-content: space-between;
	text-align: left;

	&::after {
		content: '▼';
		font-size: 10px;
		margin-left: 8px;
	}
`;

const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	border: 1px solid #dee2e6;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	max-height: 300px;
	overflow-y: auto;
	margin-top: 4px;
`;

const DropdownItem = styled.div`
	padding: 10px 16px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f8f9fa;
	}

	${props =>
		props.$selected &&
		`
    background-color: #e7f3ff;
    font-weight: 500;
  `}
`;

const Checkbox = styled.div`
	width: 16px;
	height: 16px;
	border: 2px solid #adb5bd;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;

	${props =>
		props.$checked &&
		`
    background-color: #007bff;
    border-color: #007bff;
    
    &::after {
      content: '✓';
      color: white;
      font-size: 12px;
    }
  `}
`;

const SelectedCount = styled.span`
	background: #007bff;
	color: white;
	border-radius: 10px;
	padding: 2px 8px;
	font-size: 12px;
	margin-left: 8px;
`;

const MultiSelect = ({
	options = [],
	selectedValues = [],
	onChange,
	placeholder = 'Выберите...',
	renderOption,
	getOptionLabel = option => option.name || option,
	getOptionValue = option => option._id || option,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = option => {
		const value = getOptionValue(option);
		const newSelected = selectedValues.includes(value)
			? selectedValues.filter(v => v !== value)
			: [...selectedValues, value];

		onChange(newSelected);
	};

	const handleClickOutside = event => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const selectedOptions = options.filter(option => selectedValues.includes(getOptionValue(option)));

	const buttonText =
		selectedOptions.length > 0 ? `${placeholder} (${selectedOptions.length})` : placeholder;

	return (
		<MultiSelectContainer ref={dropdownRef}>
			<SelectButton onClick={handleToggle} $variant="secondary" type="button">
				<span>{buttonText}</span>
				{selectedOptions.length > 0 && <SelectedCount>{selectedOptions.length}</SelectedCount>}
			</SelectButton>

			{isOpen && (
				<Dropdown>
					{options.map((option, index) => {
						const value = getOptionValue(option);
						const isSelected = selectedValues.includes(value);
						const label = renderOption ? renderOption(option) : getOptionLabel(option);

						return (
							<DropdownItem
								key={value || index}
								onClick={() => handleSelect(option)}
								$selected={isSelected}
							>
								<Checkbox $checked={isSelected} />
								{label}
							</DropdownItem>
						);
					})}
				</Dropdown>
			)}
		</MultiSelectContainer>
	);
};

MultiSelect.propTypes = {
	options: PropTypes.array.isRequired,
	selectedValues: PropTypes.array,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
};

export default MultiSelect;
