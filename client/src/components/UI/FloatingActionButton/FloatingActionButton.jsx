import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FloatingButton = styled(Link)`
	width: 100px;
	height: 100px;
	background: #007bff;
	color: white;
	border: none;
	border-radius: 50%;
	font-size: 72px;
	font-weight: 600;
	text-decoration: none;
	display: inline-block;
	text-align: center;
	line-height: 85px;
	margin: 20px;
	cursor: pointer;
	box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
	transition: all 0.3s ease;

	&:hover {
		background: #0056b3;
		transform: scale(1.1);
		box-shadow: 0 6px 25px rgba(0, 123, 255, 0.4);
	}

	&:active {
		transform: scale(0.95);
	}
`;

const FloatingActionButton = ({ transactionType = 'expense' }) => {
	return (
		<FloatingButton to="/add-transaction" state={{ transactionType }}>
			+
		</FloatingButton>
	);
};

FloatingActionButton.propTypes = {
	transactionType: PropTypes.oneOf(['income', 'expense']),
};

FloatingActionButton.defaultProps = {
	transactionType: 'expense',
};

export default FloatingActionButton;
