import styled from 'styled-components';

export const Input = styled.input`
	width: 100%;
	padding: 12px 16px;
	border: 2px solid #e1e5e9;
	border-radius: 8px;
	font-size: 16px;
	transition: all 0.2s ease;
	background: white;

	&:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}

	&::placeholder {
		color: #6c757d;
	}

	&:invalid {
		border-color: #dc3545;
	}
`;
