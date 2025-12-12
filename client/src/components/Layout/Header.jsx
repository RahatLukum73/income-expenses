// import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BurgerMenu from './BurgerMenu';
import { getCurrencySymbol } from '../../utils/dateHelpers';

const HeaderContainer = styled.header`
  background: #353535;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 0 12px #222;
  padding: 0;
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
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
  background: #A13DD5;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  text-align: center;
  font-size: 32px;
  text-shadow: 0 0 10px #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BalanceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 2;
  padding: 10px 0;
`;

const BalanceTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #e1e1e1;
  margin-bottom: 4px;
`;

const BalanceAmount = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

const Header = () => {
  const { user } = useSelector(state => state.auth);
  const { summary } = useSelector(state => state.summary);
  
  const currencySymbol = getCurrencySymbol(user?.currency || 'RUB');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handleLogoClick = () => {
    scrollToTop();
    
    if (window.location.pathname !== '/dashboard') {
      window.location.href = '/dashboard';
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <Logo onClick={handleLogoClick}>
            <LogoBadge>💰</LogoBadge>
          </Logo>
        </LogoSection>
        
        <BalanceSection>
          <BalanceTitle>Общий баланс</BalanceTitle>
          <BalanceAmount>
            {summary?.totalBalance?.toLocaleString('ru-RU') || '0'} {currencySymbol}
          </BalanceAmount>
        </BalanceSection>
        
        <NavSection>
          <BurgerMenu />
        </NavSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;