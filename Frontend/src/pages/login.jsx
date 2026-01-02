import "./login.css";
function Login(){
    return(
        <div className="container">
            <h2>Login</h2>
    
            <input type="text" placeholder="Enter employee ID" />
            <br />
            <input type="password" placeholder="Enter your password" />
            <br /><br />

            <button>Submit</button>
        </div>
    );
}
export default Login;