import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/editjob.css'
const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({ title: "", description: "", company: "", location: "", salary: "", jobType: "" });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/jobs/${id}`);
                const data = await res.json();
                setJobData(data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };
        fetchJob();
    }, [id]);

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Unauthorized: No token found.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/jobs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(jobData),
            });

            if (!response.ok) {
                throw new Error("Failed to update job.");
            }

            navigate("/");
        } catch (error) {
            console.error("Error updating job:", error);
        }
    };

    return (
        <div className="edit-job-container">
            <h2>Edit Job</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={jobData.title} onChange={handleChange} required />
                <textarea name="description" value={jobData.description} onChange={handleChange} required />
                <input type="text" name="company" value={jobData.company} onChange={handleChange} required />
                <input type="text" name="location" value={jobData.location} onChange={handleChange} required />
                <input type="text" name="salary" value={jobData.salary} onChange={handleChange} />
                <input type="text" name="jobType" value={jobData.jobType} onChange={handleChange} />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
    
};

export default EditJob;
