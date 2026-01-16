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

const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleSubmit();
    }
};


    return(
        <div className="login-shell">
            <section className="login-hero">
                <div className="login-hero-brand">
                    <img className="login-logo" src={nxLogo} alt="Nippon Express" />
                    <span className="login-hero-pill">Enterprise Access</span>
                </div>
                <h1>NX Identity & Access Hub</h1>
                <p>Secure, audited access to employee onboarding, approvals, and operational tooling.</p>

                <div className="login-hero-metrics">
                    <div className="metric-card">
                        <span className="metric-label">Uptime</span>
                        <strong className="metric-value">99.99%</strong>
                        <span className="metric-note">Global availability</span>
                    </div>
                    <div className="metric-card">
                        <span className="metric-label">Compliance</span>
                        <strong className="metric-value">ISO 27001</strong>
                        <span className="metric-note">Policy aligned</span>
                    </div>
                    <div className="metric-card">
                        <span className="metric-label">Sessions</span>
                        <strong className="metric-value">24/7</strong>
                        <span className="metric-note">Continuous access</span>
                    </div>
                </div>

                <div className="login-hero-footer">
                    <span>Last audit sync: Today • 09:30 UTC</span>
                    <span className="login-hero-divider">•</span>
                    <span>Risk posture: Low</span>
                </div>
            </section>

            <section className="login-panel">
                <div className="login-card">
                    <div className="login-card-header">
                        <span className="login-badge">Secure Sign-In</span>
                        <h2>Sign in to continue</h2>
                        <p>Use your corporate credentials to access the NX portal.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="login-field">
                            <label htmlFor="email">Corporate Email</label>
                            <input 
                                id="email"
                                type="email" 
                                placeholder="name@nipponexpress.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <input 
                                id="password"
                                type="password" 
                                placeholder="Enter your secure password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="login-actions">
                            <button className="login-primary" type="submit" disabled={isLoading}>
                                {isLoading ? "Authenticating..." : "Sign In"}
                            </button>
                            <div className="login-help">
                                <span>Need access?</span>
                                <a href="#" onClick={(e) => e.preventDefault()}>Contact IT Support</a>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="login-panel-note">
                    By signing in you acknowledge monitoring, audit logging, and enterprise security controls.
                </div>
            </section>
        </div>
    );
}
export default Login;