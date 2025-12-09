import styled from 'styled-components';
import PropTypes from 'prop-types';

const ChipContainer = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	background: #e9ecef;
	border-radius: 16px;
	padding: 6px 12px;
	font-size: 14px;
	color: #333;
	margin: 4px;
`;

const ChipLabel = styled.span`
	white-space: nowrap;
`;

const CloseButton = styled.button`
	background: none;
	border: none;
	padding: 0;
	width: 16px;
	height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #6c757d;

	&:hover {
		color: #dc3545;
	}

	svg {
		width: 10px;
		height: 10px;
	}
`;

const Chip = ({ label, onRemove, ...props }) => {
	return (
		<ChipContainer {...props}>
			<ChipLabel>{label}</ChipLabel>
			{onRemove && (
				<CloseButton onClick={onRemove} aria-label="Удалить">
					✕
				</CloseButton>
			)}
		</ChipContainer>
	);
};

Chip.propTypes = {
	label: PropTypes.string.isRequired,
	onRemove: PropTypes.func,
};
export default Chip;

