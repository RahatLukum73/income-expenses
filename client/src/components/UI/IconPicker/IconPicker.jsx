// src/components/UI/IconPicker/IconPicker.jsx
import styled from 'styled-components';
import PropTypes from 'prop-types';

const IconPickerContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 8px;
`;

const IconOption = styled.button`
	width: 48px;
	height: 48px;
	border-radius: 8px;
	border: ${props => (props.$selected ? '2px solid #565656' : '1px solid #e1e5e9')};
	background: ${props => (props.$selected ? '#e7f3ff' : '#7b7b7b')};
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;

	&:hover {
		background: #f8f9fa;
		transform: scale(1.05);
	}
`;

// Простые эмодзи для иконок
const iconMap = {
	wallet: '💰',
	'credit-card': '💳',
	bank: '🏦',
	cash: '💵',
	'piggy-bank': '🐷',
	mobile: '📱',
	card: '💳',
	savings: '📈',
	invest: '📊',
};

const IconPicker = ({ icons, selectedIcon, onChange }) => {
	return (
		<IconPickerContainer>
			{icons.map(icon => (
				<IconOption
					key={icon}
					$selected={icon === selectedIcon}
					onClick={() => onChange(icon)}
					type="button"
					title={icon}
				>
					{iconMap[icon] || '📁'}
				</IconOption>
			))}
		</IconPickerContainer>
	);
};

IconPicker.propTypes = {
	icons: PropTypes.array.isRequired,
	selectedIcon: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

export default IconPicker;
