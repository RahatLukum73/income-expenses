import styled from 'styled-components';
import PropTypes from 'prop-types';

const ColorPickerContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 8px;
`;

const ColorOption = styled.button`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: ${props => props.$color};
	border: ${props => (props.$selected ? '3px solid #007bff' : '2px solid #e1e5e9')};
	cursor: pointer;
	padding: 0;

	&:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}
`;

const ColorPicker = ({ colors, selectedColor, onChange }) => {
	return (
		<ColorPickerContainer>
			{colors.map(color => (
				<ColorOption
					key={color}
					$color={color}
					$selected={color === selectedColor}
					onClick={() => onChange(color)}
					type="button"
					aria-label={`Выбрать цвет ${color}`}
				/>
			))}
		</ColorPickerContainer>
	);
};

ColorPicker.propTypes = {
	colors: PropTypes.array.isRequired,
	selectedColor: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

export default ColorPicker;
