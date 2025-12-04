import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
	const { isLoggedIn } = useSelector(state => state.auth);
	const location = useLocation();

	if (!isLoggedIn) {
		localStorage.setItem('redirectAfterLogin', location.pathname);
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
