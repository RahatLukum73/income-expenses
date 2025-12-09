import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BurgerMenu from './BurgerMenu';

const HeaderContainer = styled.header`
	background: white;
	border-bottom: 1px solid #e1e5e9;
	position: sticky;
	top: 0;
	z-index: 100;
`;

const HeaderContent = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 70px;
`;

const Logo = styled(Link)`
	font-size: 24px;
	font-weight: 700;
	color: #333;
	text-decoration: none;
	display: flex;
	align-items: center;
	gap: 8px;

	&:hover {
		color: #007bff;
	}
`;

const LogoBadge = styled.span`
	background: #007bff;
	color: white;
	width: 40px;
	height: 40px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	font-weight: 700;
`;

const Nav = styled.nav`
	display: flex;
	align-items: center;
	gap: 16px;
`;

const Header = () => {

	return (
		<HeaderContainer>
			<HeaderContent>
				<Logo to="/dashboard">
					<LogoBadge>ОР</LogoBadge>
				</Logo>

				<Nav>
					<BurgerMenu />
				</Nav>
			</HeaderContent>
		</HeaderContainer>
	);
};

export default Header;
