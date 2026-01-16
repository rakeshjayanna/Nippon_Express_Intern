import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './auth/login.jsx';
import EmployeeDashboard from './EmployeeDashboard.jsx';
import SuperAdminDashboard from './SuperAdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES, USER_ROLES } from './utils/constants';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />}/>
        <Route path={ROUTES.LOGIN} element={<Login/>}/>
        <Route 
          path={ROUTES.EMPLOYEE_DASHBOARD} 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE, USER_ROLES.HR]}>
              <EmployeeDashboard/>
            </ProtectedRoute>
          }
        />
        <Route 
          path={ROUTES.SUPERADMIN_DASHBOARD} 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
              <SuperAdminDashboard/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />}/>
      </Routes> 
    </BrowserRouter>
  );
}
  
export default App;
