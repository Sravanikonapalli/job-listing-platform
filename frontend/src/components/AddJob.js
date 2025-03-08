import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addjob.css"; 

const AddJob = () => {
    const [jobData, setJobData] = useState({ title: "", description: "", company: "", location: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unauthorized: Please log in first.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:3000/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(jobData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add job.");
            }
    
            setJobData({ title: "", description: "", company: "", location: "" }); // Clear form
            navigate("/"); // Redirect to dashboard
        } catch (error) {
            setError(error.message);
            console.error("Error adding job:", error);
        }
    };
    
    

    return (
        <div className="add-job-container">
            <h2>Add New Job</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="add-job-form">
                <div className="input-group">
                    <label>Job Title</label>
                    <input type="text" name="title" value={jobData.title} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Job Description</label>
                    <textarea name="description" value={jobData.description} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Company Name</label>
                    <input type="text" name="company" value={jobData.company} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Location</label>
                    <input type="text" name="location" value={jobData.location} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-button">Add Job</button>
            </form>
        </div>
    );
};

export default AddJob;
