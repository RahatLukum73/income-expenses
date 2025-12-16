import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/UI/Button/Button';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #111 0%, #555 100%);
`;

const WelcomeCard = styled.div`
	background: #b5b8b1;
	padding: 48px;
	border-radius: 16px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
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
	background: #a13dd5;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
	color: white;
	width: 60px;
	height: 60px;
	border-radius: 50%;
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

	if (isLoggedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<WelcomeContainer>
			<WelcomeCard>
				<Logo>
					<LogoBadge>💰</LogoBadge>
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
						$variant="secondary"
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
