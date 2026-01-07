import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './auth/login.jsx';
import EmployeeDashboard from './EmployeeDashboard.jsx';
import SuperAdminDashboard from './SuperAdminDashboard.jsx';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/employee-dashboard" element={<EmployeeDashboard/>}/>
        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard/>}/>
        <Route path="*" element={<Navigate to="/login" />}/>
      </Routes> 
    </BrowserRouter>
  );
}
  
export default App;
