import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/authService";
import { ROUTES } from "../utils/constants";
import "../styles/login.css";
import nxLogo from "../assets/logo.png";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

   const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!email.trim() || !password.trim()) {
        toast.error("Please enter both email and password");
        return;
    }

    setIsLoading(true);
    try {
        const response = await authService.login(email, password);
        
        if (response && response.success) {
            toast.success("Login successful!");
            
            // Normalize role (handle SUPER_ADMIN, SUPER-ADMIN, SUPERADMIN, etc.)
            const rawRole = (response.role || '').toString();
            let normalizedRole = rawRole.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

            // Backend seed uses ADMIN; treat it as SUPERADMIN for UI routing.
            if (normalizedRole === 'ADMIN') {
                normalizedRole = 'SUPERADMIN';
            }

            // Update stored user data with normalized role
            const userData = authService.getUserData();
            if (userData) {
                userData.role = normalizedRole;
                localStorage.setItem('userData', JSON.stringify(userData));
            }

            // Navigate based on normalized role
            if (normalizedRole === 'SUPERADMIN') {
                navigate(ROUTES.SUPERADMIN_DASHBOARD);
            } else if (normalizedRole === 'EMPLOYEE' || normalizedRole === 'HR') {
                navigate(ROUTES.EMPLOYEE_DASHBOARD);
            } else {
                toast.error("Unknown role: " + response.role);
                return;
            }
        } else {
            toast.error(response?.message || "Invalid credentials");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Login failed. Please try again.";
        toast.error(errorMessage);
        console.error("Login error:", error);
    } finally {
        setIsLoading(false);
    }
};

const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleSubmit();
    }
};


    return(
        <div className="login-page">
            <div className="login-card">
                <img className="login-logo" src={nxLogo} alt="Nippon Express" />

                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Enter email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        required
                        autoFocus
                    />
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        required
                    />

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default Login;