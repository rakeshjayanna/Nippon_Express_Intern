import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ROUTES } from '../utils/constants';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const userData = authService.getUserData();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && userData) {
    const normalizedRole = (userData.role || '').toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const isAllowed = allowedRoles.some(role => 
      normalizedRole === role.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    );

    if (!isAllowed) {
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
