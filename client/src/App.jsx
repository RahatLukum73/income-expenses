import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyles';
import { getCurrentUser } from './store/actions/authActions';
import Header from './components/Layout/Header';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionDetails from './pages/TransactionDetails';
import EditTransaction from './pages/EditTransaction';
import CategoryDetails from './pages/CategoryDetails';
import Profile from './pages/Profile';
import Accounts from './pages/Accounts';
import styled from 'styled-components';

const AppContainer = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
`;

const MainContent = styled.main`
	flex: 1;
	padding: ${props => (props.$hasHeader ? '20px' : '0')};
	max-width: 1200px;
	margin: 0 auto;
	width: 100%;
`;

const LoadingSpinner = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	font-size: 18px;
	color: #6c757d;
`;

function App() {
	const dispatch = useDispatch();
	const { loading } = useSelector(state => state.auth);

	useEffect(() => {
		dispatch(getCurrentUser());
	}, [dispatch]);

	if (loading) {
		return (
			<>
				<GlobalStyle />
				<LoadingSpinner>Loading...</LoadingSpinner>
			</>
		);
	}

	return (
		<>
			<GlobalStyle />
			<Router>
				<AppContainer>
					{!loading && <Header />}
					<MainContent $hasHeader={!loading}>
						<Routes>
							<Route path="/" element={<WelcomePage />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />

							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/add-transaction"
								element={
									<ProtectedRoute>
										<AddTransaction />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/transaction/:id"
								element={
									<ProtectedRoute>
										<TransactionDetails />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/edit-transaction/:id"
								element={
									<ProtectedRoute>
										<EditTransaction />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/categories/:id"
								element={
									<ProtectedRoute>
										<CategoryDetails />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/category/:id"
								element={
									<ProtectedRoute>
										<CategoryDetails />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/accounts"
								element={
									<ProtectedRoute>
										<Accounts />
									</ProtectedRoute>
								}
							/>

							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
					</MainContent>
				</AppContainer>
			</Router>
		</>
	);
}

export default App;
