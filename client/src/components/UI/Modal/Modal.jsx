import styled from 'styled-components';
import PropTypes from 'prop-types';

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

export const ModalContent = styled.div`
	background: white;
	padding: 32px;
	border-radius: 12px;
	max-width: 500px;
	width: 90%;
	max-height: 90vh;
	overflow-y: auto;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
`;

export const ModalTitle = styled.h2`
	margin: 0;
	color: #333;
`;

export const ModalCloseButton = styled.button`
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #6c757d;

	&:hover {
		color: #333;
	}
`;

const Modal = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<ModalOverlay onClick={onClose}>
			<ModalContent onClick={e => e.stopPropagation()}>
				<ModalHeader>
					<ModalTitle>{title}</ModalTitle>
					<ModalCloseButton onClick={onClose}>×</ModalCloseButton>
				</ModalHeader>
				{children}
			</ModalContent>
		</ModalOverlay>
	);
};

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	children: PropTypes.node,
};

export default Modal;
