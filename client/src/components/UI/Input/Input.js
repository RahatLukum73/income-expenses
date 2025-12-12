import styled from 'styled-components';

export const Input = styled.input`
	width: 100%;
	padding: 12px 16px;
	border-radius: 8px;
	font-size: 16px;
	transition: all 0.2s ease;
	background: #7b7b7b;
	outline: none;
	color: #e1e1e1;
	border: none;

	&:focus {
		outline: none;
		box-shadow: 0 0 6px rgba(249, 255, 224, 0.5);
	}

	&::placeholder {
		color: #e1e1e1;
	}

`;
