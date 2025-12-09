import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../store/actions/authActions';
import { Input } from '../components/UI/Input/Input';
import { Button } from '../components/UI/Button/Button';
import { loginSchema } from '../utils/validationSchemas';
import styled from 'styled-components';

const LoginContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 20px;
`;

const LoginCard = styled.div`
	background: white;
	padding: 40px;
	border-radius: 16px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	width: 100%;
	max-width: 440px;
`;

const Logo = styled.div`
	text-align: center;
	margin-bottom: 32px;
`;

const LogoBadge = styled.span`
	background: #007bff;
	color: white;
	width: 60px;
	height: 60px;
	border-radius: 12px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	font-weight: 700;
	margin-bottom: 16px;
`;

const Title = styled.h1`
	font-size: 28px;
	color: #333;
	text-align: center;
	margin-bottom: 8px;
`;

const Subtitle = styled.p`
	color: #6c757d;
	text-align: center;
	margin-bottom: 32px;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
`;

const FormGroup = styled.div`
	margin-bottom: 20px;
`;

const ErrorText = styled.div`
	color: #dc3545;
	font-size: 14px;
	margin-top: 6px;
	display: flex;
	align-items: center;
	gap: 4px;
`;

const ErrorMessage = styled.div`
	background: #f8d7da;
	color: #721c24;
	padding: 12px 16px;
	border-radius: 8px;
	margin-bottom: 20px;
	text-align: center;
	border: 1px solid #f5c6cb;
`;

const RegisterLink = styled.div`
	text-align: center;
	margin-top: 24px;
	color: #6c757d;
`;

const StyledLink = styled(Link)`
	color: #007bff;
	text-decoration: none;
	font-weight: 600;

	&:hover {
		text-decoration: underline;
	}
`;

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, isLoggedIn } = useSelector(state => state.auth);

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	useEffect(() => {
		if (isLoggedIn) {
			navigate('/dashboard');
		}
	}, [isLoggedIn, navigate]);

	useEffect(() => {
		return () => {
			dispatch(clearError());
		};
	}, [dispatch]);

	const handleChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}));

		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: '',
			}));
		}
	};

	const handleBlur = field => {
		setTouched(prev => ({
			...prev,
			[field]: true,
		}));

		validateField(field, formData[field]);
	};

	const validateField = async (field, value) => {
		try {
			await loginSchema.validateAt(field, {
				...formData,
				[field]: value,
			});
			setErrors(prev => ({
				...prev,
				[field]: '',
			}));
		} catch (error) {
			setErrors(prev => ({
				...prev,
				[field]: error.message,
			}));
		}
	};

	const validateForm = async () => {
		try {
			await loginSchema.validate(formData, { abortEarly: false });
			setErrors({});
			return true;
		} catch (error) {
			const validationErrors = {};
			error.inner.forEach(err => {
				validationErrors[err.path] = err.message;
			});
			setErrors(validationErrors);
			return false;
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const allTouched = Object.keys(formData).reduce((acc, key) => {
			acc[key] = true;
			return acc;
		}, {});
		setTouched(allTouched);

		const isValid = await validateForm();
		if (isValid) {
			dispatch(loginUser(formData));
		}
	};


	return (
		<LoginContainer>
			<LoginCard>
				<Logo>
					<LogoBadge>ОР</LogoBadge>
					<Title>Вход в аккаунт</Title>
					<Subtitle>Введите ваши данные для входа</Subtitle>
				</Logo>

				<Form onSubmit={handleSubmit}>
					{error && <ErrorMessage>{error}</ErrorMessage>}

					<FormGroup>
						<Input
							type="email"
							placeholder="Email"
							value={formData.email}
							onChange={e => handleChange('email', e.target.value)}
							onBlur={() => handleBlur('email')}
							style={{
								borderColor: errors.email && touched.email ? '#dc3545' : '#e1e5e9',
							}}
						/>
						{errors.email && touched.email && <ErrorText>{errors.email}</ErrorText>}
					</FormGroup>

					<FormGroup>
						<Input
							type="password"
							placeholder="Пароль"
							value={formData.password}
							onChange={e => handleChange('password', e.target.value)}
							onBlur={() => handleBlur('password')}
							style={{
								borderColor: errors.password && touched.password ? '#dc3545' : '#e1e5e9',
							}}
						/>
						{errors.password && touched.password && <ErrorText>{errors.password}</ErrorText>}
					</FormGroup>

					<Button type="submit" $fullWidth disabled={loading}>
						{loading ? 'Вход...' : 'Войти'}
					</Button>

					<RegisterLink>
						Нет аккаунта? <StyledLink to="/register">Зарегистрироваться</StyledLink>
					</RegisterLink>
				</Form>
			</LoginCard>
		</LoginContainer>
	);
};

export default Login;
