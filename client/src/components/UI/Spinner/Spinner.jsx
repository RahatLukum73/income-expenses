import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 40px;
`;

const SpinnerElement = styled.div`
	border: 4px solid #f3f3f3;
	border-top: 4px solid #007bff;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	animation: ${spin} 1s linear infinite;
`;

export const Spinner = () => (
	<SpinnerContainer>
		<SpinnerElement />
	</SpinnerContainer>
);
