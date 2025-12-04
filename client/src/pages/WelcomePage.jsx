import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/UI/Button/Button';

const WelcomeContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const WelcomeCard = styled.div`
	background: white;
	padding: 48px;
	border-radius: 16px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	text-align: center;
	max-width: 400px;
	width: 90%;
`;

const Logo = styled.div`
	font-size: 32px;
	font-weight: 700;
	color: #333;
	margin-bottom: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
`;

const LogoBadge = styled.span`
	background: #007bff;
	color: white;
	width: 50px;
	height: 50px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
`;

const Title = styled.h1`
	font-size: 28px;
	color: #333;
	margin-bottom: 16px;
`;

const Subtitle = styled.p`
	color: #6c757d;
	margin-bottom: 32px;
	line-height: 1.6;
`;

const ButtonGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const WelcomePage = () => {
	const { isLoggedIn } = useSelector(state => state.auth);

	// Если пользователь уже авторизован, перенаправляем на dashboard
	if (isLoggedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<WelcomeContainer>
			<WelcomeCard>
				<Logo>
					<LogoBadge>ОР</LogoBadge>
					Организатор Расходов
				</Logo>
				<Title>Добро пожаловать</Title>
				<Subtitle>
					Управляйте вашими финансами легко и эффективно. Отслеживайте расходы, анализируйте
					статистику и достигайте финансовых целей.
				</Subtitle>
				<ButtonGroup>
					<Button
						as="a"
						href="/login"
						$fullWidth
						style={{ textDecoration: 'none', display: 'block' }}
					>
						Войти
					</Button>
					<Button
						as="a"
						href="/register"
						variant="secondary"
						$fullWidth
						style={{ textDecoration: 'none', display: 'block' }}
					>
						Зарегистрироваться
					</Button>
				</ButtonGroup>
			</WelcomeCard>
		</WelcomeContainer>
	);
};

export default WelcomePage;
