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
            <h1>Job Portal</h1>
            <div>
                <Link to="/">Dashboard</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/add-job">Add Job</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
    
};

export default Header;
