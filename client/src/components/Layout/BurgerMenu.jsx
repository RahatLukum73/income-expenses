import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/actions/authActions';
import styled from 'styled-components';

const BurgerButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	position: relative;
	z-index: 1002;

	&:hover {
		opacity: 0.7;
	}
`;

const BurgerLine = styled.span`
	width: 24px;
	height: 2px;
	background: #333;
	transition: all 0.3s ease;
`;

const MenuOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
`;

const MenuContainer = styled.div`
	position: fixed;
	top: 70px;
	right: 20px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	min-width: 200px;
	overflow: hidden;
	z-index: 1001;
`;

const MenuItem = styled.button`
	width: 100%;
	padding: 16px 20px;
	background: none;
	border: none;
	text-align: left;
	cursor: pointer;
	font-size: 16px;
	color: #333;
	transition: background-color 0.2s ease;

	&:hover {
		background: #f8f9fa;
	}

	&:not(:last-child) {
		border-bottom: 1px solid #e1e5e9;
	}
`;

const BurgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);
	const buttonRef = useRef(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleDashboardClick = () => {
		setIsOpen(false);
		navigate('/dashboard');
	};

	const handleAccountsClick = () => {
		setIsOpen(false);
		navigate('/accounts');
	};
	
	const handleCategoriesClick = () => {
		setIsOpen(false);
		navigate('/categories');// - этот хэндлер я только добавил, он еще не работает
	};

	const handleAddTransactionClick = () => {
		setIsOpen(false);
		navigate('/add-transaction');
	};

	const handleProfileClick = () => {
		setIsOpen(false);
		navigate('/profile');
	};

	const handleLogoutClick = () => {
		setIsOpen(false);
		dispatch(logoutUser());
		navigate('/login');
	};

	useEffect(() => {
		const handleClickOutside = event => {
			if (
				isOpen &&
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		const handleEscapeKey = event => {
			if (event.key === 'Escape' && isOpen) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleEscapeKey);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [isOpen]);

	return (
		<div>
			<BurgerButton ref={buttonRef} onClick={toggleMenu}>
				<BurgerLine />
				<BurgerLine />
				<BurgerLine />
			</BurgerButton>

			{isOpen && (
				<>
					<MenuOverlay />
					<MenuContainer ref={menuRef}>
						<MenuItem onClick={handleDashboardClick}>Главная</MenuItem>
						<MenuItem onClick={handleAccountsClick}>Счета</MenuItem>
						<MenuItem onClick={handleCategoriesClick}>Категории</MenuItem>{/*Мне нужно чтоб это приводило к списку категорий, где напротив каждой была суума расходов/доходов*/}
						<MenuItem onClick={handleAddTransactionClick}>Добавить транзакцию</MenuItem>
						<MenuItem onClick={handleProfileClick}>Профиль</MenuItem>
						<MenuItem onClick={handleLogoutClick}>Выйти</MenuItem>
					</MenuContainer>
				</>
			)}
		</div>
	);
};

export default BurgerMenu;
