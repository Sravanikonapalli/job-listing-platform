import React, { Component } from "react";
import "../styles/login.css";

class Login extends Component {
    state = {
        email: "",
        password: "",
        errorMessage: "",
    };

    onChangeInputField = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    submitForm = async (event) => {
        event.preventDefault();
        const { email, password } = this.state;

        if (!email || !password) {
            this.setState({ errorMessage: "Both fields are required" });
            return;
        }

        const userDetails = { email, password };

        try {
            const response = await fetch("https://job-listing-platform-tyqw.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDetails),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                localStorage.setItem("token", data.token);
                window.location.href = "/"; 
            } else {
                this.setState({ errorMessage: data.message || "Invalid Credentials" });
            }
        } catch (error) {
            this.setState({ errorMessage: "Something went wrong. Try again!" });
        }
    };

    render() {
        const { email, password, errorMessage } = this.state;

        return (
            <div className="login-container">
                {/* Left Section - Login Form */}
                <div className="login-form-container">
                    <h1>Already have an account?</h1>
                    <p>Your personal job finder is here</p>
                    <form onSubmit={this.submitForm} className="login-form">
                        <input
                            type="email"
                            placeholder="Email"
                            className="input-field"
                            name="email"
                            value={email}
                            onChange={this.onChangeInputField} required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            name="password"
                            value={password}
                            onChange={this.onChangeInputField} required
                        />
                        {errorMessage && <p className="error-text">{errorMessage}</p>}
                        <button type="submit" className="form-btn">Sign In</button>
                    </form>
                    <p>Don’t have an account? <a href="/signup">Sign Up</a></p>
                </div>

                {/* Right Section - Background Image */}
                <div className="login-bg-container">
                    <p className="overlay-text">Your Personal Job Finder</p>
                </div>
            </div>
        );
    }
}

export default Login;
