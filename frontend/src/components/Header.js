import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Header.css'
const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav>
            <h1>JobStation</h1>
            <div>
                <Link to="/">Dashboard</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/add-job">Add Job</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link className="login-btn" to="/login">Login</Link>
                        <Link className="register-btn" to="/signup">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
    
};

export default Header;
