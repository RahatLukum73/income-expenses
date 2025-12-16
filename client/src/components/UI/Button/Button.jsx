import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ButtonSpinner = styled.div`
	border: 2px solid transparent;
	border-top: 2px solid currentColor;
	border-radius: 50%;
	width: 16px;
	height: 16px;
	animation: ${spin} 1s linear infinite;
	margin-right: 8px;
`;

const ButtonContent = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const Button = styled.button`
	background: #565656;
	color: ${props => (props.$variant === 'secondary' ? '#e1e1e1' : 'white')};
	border: none;
	padding: 12px 24px;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 600;
	cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
	transition: all 0.2s ease;
	width: ${props => (props.$fullWidth ? '100%' : 'auto')};
	opacity: ${props => (props.disabled ? 0.6 : 1)};

	&:hover {
		background: ${props => {
			if (props.disabled) return props.variant === 'secondary' ? '#7b7b7b' : 'white';
			return props.variant === 'secondary' ? '#7b7b7b' : '#7b7b7b';
		}};
		color: ${props => {
			if (props.disabled) return props.variant === 'secondary' ? '#7b7b7b' : 'white';
			return props.variant === 'secondary' ? 'white' : 'white';
		}};
		transform: ${props => (props.disabled ? 'none' : 'translateY(-1px)')};
	}

	&:active {
		transform: translateY(0);
	}
`;

Button.propTypes = {
	children: PropTypes.node,
	type: PropTypes.oneOf(['button', 'submit', 'reset']),
	$variant: PropTypes.oneOf(['primary', 'secondary']),
	disabled: PropTypes.bool,
	$fullWidth: PropTypes.bool,
	onClick: PropTypes.func,
};

export const LoadingButton = ({ children, loading, ...props }) => (
	<Button {...props} disabled={props.disabled || loading}>
		<ButtonContent>
			{loading && <ButtonSpinner />}
			{children}
		</ButtonContent>
	</Button>
);

LoadingButton.propTypes = {
	children: PropTypes.node.isRequired,
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
	$variant: PropTypes.oneOf(['primary', 'secondary']),
};

// Новый компонент BackButton
export const BackButton = ({ children, ...props }) => (
	<Button 
		{...props} 
		style={{
			background: '#adadad',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 'fit-content',
			padding: '12px 16px'
		}}
	>
		<i className="fas fa-arrow-left" style={{ marginRight: children ? '8px' : '0' }}></i>
		{children}
	</Button>
);

BackButton.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};