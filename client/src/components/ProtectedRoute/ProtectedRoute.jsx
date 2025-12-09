import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
	const { isLoggedIn } = useSelector(state => state.auth);
	const location = useLocation();

	if (!isLoggedIn) {
		localStorage.setItem('redirectAfterLogin', location.pathname);
		return <Navigate to="/login" replace />;
	}

	return children;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
