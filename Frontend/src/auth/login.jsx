import { useState } from "react";
import axios from "axios";
import "../styles/login.css";

function Login(){
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/login', {
                employeeId: employeeId,
                password: password
            });
            setMessage("Login successful!");
            console.log(response.data);
        } catch (error) {
            setMessage("Login failed: " + (error.response?.data?.message || error.message));
            console.error("Error:", error);
        }
    };

    return(
        <div className="container">
            <h2>Login</h2>
    
            <input 
                type="text" 
                placeholder="Enter employee ID" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
            />
            <br />
            <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />

            <button onClick={handleSubmit}>Submit</button>
            
            {message && <p className="message">{message}</p>}
        </div>
    );
}
export default Login;