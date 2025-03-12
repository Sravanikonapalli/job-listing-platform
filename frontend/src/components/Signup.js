import React, { Component } from "react";
import "../styles/login.css";

class Signup extends Component {
    state = {
        name: "",
        email: "",
        mobile: "",
        password: "",
        agreeToTerms: false,
        errorMessage: "",
    };

    onChangeInputField = (event) => {
        this.setState({ [event.target.name]: event.target.value.trim() });
    };

    onCheckboxChange = () => {
        this.setState((prevState) => ({ agreeToTerms: !prevState.agreeToTerms }));
    };

    submitForm = async (event) => {
        event.preventDefault();
        const { name, email, mobile, password, agreeToTerms } = this.state;

        if (!name || !email || !mobile || !password) {
            this.setState({ errorMessage: "All fields are required" });
            return;
        }

        if (!agreeToTerms) {
            this.setState({ errorMessage: "You must agree to the terms to proceed." });
            return;
        }

        const userDetails = { name, email, mobile, password };  

        try {
            const response = await fetch("http://localhost:3000/signup", {  
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDetails),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully! Please log in.");
                window.location.href = "/login"; 
            } else {
                this.setState({ errorMessage: data.error || "Signup failed. Try again!" });
            }
        } catch (error) {
            this.setState({ errorMessage: "Something went wrong. Try again!" });
        }
    };

    render() {
        const { name, email, mobile, password, agreeToTerms, errorMessage } = this.state;

        return (
            <div className="login-container">
                <div className="login-form-container">
                    <h1>Create an Account</h1>
                    <p>Your personal job finder is here</p>
                    <form onSubmit={this.submitForm} className="login-form">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input-field"
                            name="name"
                            value={name}
                            onChange={this.onChangeInputField}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="input-field"
                            name="email"
                            value={email}
                            onChange={this.onChangeInputField}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Phone Number"
                            className="input-field"
                            name="mobile"  
                            value={mobile}
                            onChange={this.onChangeInputField}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            name="password"
                            value={password}
                            onChange={this.onChangeInputField}
                            required
                        />
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={agreeToTerms}
                                onChange={this.onCheckboxChange}
                                required
                            />
                            <label>
                                By creating an account, I agree to the terms of use and privacy policy
                            </label>
                        </div>
                        {errorMessage && <p className="error-text">{errorMessage}</p>}
                        <button type="submit" className="form-btn">Create Account</button>
                    </form>
                    <p>Already have an account? <a href="/login">Sign In</a></p>
                </div>

                <div className="signin-img-con">
                    <img src="https://i.postimg.cc/pXM1KK1F/Job-Listing-Platform.jpg" alt="login-page-img" className="image"/>
                </div>
            </div>
        );
    }
}

export default Signup;
