import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Login(){
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

   const navigate = useNavigate();

   const handleSubmit = async () => {
    try {
        const response = await axios.post(
            "http://localhost:8080/api/login",
            {
                email: employeeId,
                password: password
            }
        );
        console.log(response.data);
        if (response.data && response.data.success) {
            setMessage("Login successful!");
            
            // Normalize role (handle SUPER_ADMIN, SUPER-ADMIN, SUPERADMIN, etc.)
            const rawRole = (response.data.role || '').toString();
            const normalizedRole = rawRole.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

            // Store user data in localStorage with normalized role
            const userData = {
                ...response.data,
                role: normalizedRole
            };
            localStorage.setItem('userData', JSON.stringify(userData));

            // Navigate based on normalized role
            if (normalizedRole === 'SUPERADMIN') {
                navigate('/superadmin-dashboard');
            } else if (normalizedRole === 'EMPLOYEE') {
                navigate('/employee-dashboard');
            } else {
                setMessage("Unknown role: " + response.data.role);
                return;
            }
            return;
        }
        setMessage("Invalid credentials");
    } catch (error) {
        if (error.response) {
            // Backend responded with error
            setMessage("Login failed: " + (error.response.data.message || JSON.stringify(error.response.data)));
        } else {
            // Network / other error
            setMessage("Login failed: " + error.message);
        }
        console.error(error);
    }

};


    return(
        <div className="container">
            <h2>Nippon Express</h2>
    
            <input 
                type="text" 
                placeholder="Enter email address" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSubmit}>Login</button>
            
            {message && <p className="message">{message}</p>}
        </div>
    );
}
export default Login;