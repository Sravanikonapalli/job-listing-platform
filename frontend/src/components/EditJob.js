import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/editjob.css";

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({
        Role: "",
        Employees: 0,
        WorkMode: "",
        Skills: "",
        JobType: "",
        Stipend: 0,
        Location: "",
        AboutJobInternship: "",
        AboutCompany: "",
        AdditionalInformation: "",
        Duration: "",
    });

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/jobs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setJobData(data);
                } else {
                    alert("Failed to fetch job details.");
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
                alert("An error occurred while fetching job details.");
            }
        };
        fetchJobDetails();
    }, [id]);

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/jobs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                alert("Job updated successfully!");
                navigate(`/job/${id}`);
            } else {
                const errorData = await response.json();
                alert(`Failed to update job: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error updating job:", error);
            alert("An error occurred while updating the job.");
        }
    };

    return (
        <div className="edit-job-container">
            <h2>Edit Job</h2>
            <form onSubmit={handleSubmit} className="edit-job-form">
                <input type="text" name="Role" placeholder="Role" value={jobData.Role} onChange={handleChange} required />
                <input type="number" name="Employees" placeholder="Employees" value={jobData.Employees} onChange={handleChange} required />
                <input type="text" name="WorkMode" placeholder="Work Mode" value={jobData.WorkMode} onChange={handleChange} required />
                <input type="text" name="Skills" placeholder="Skills" value={jobData.Skills} onChange={handleChange} required />
                <input type="text" name="JobType" placeholder="Job Type" value={jobData.JobType} onChange={handleChange} required />
                <input type="number" name="Stipend" placeholder="Stipend" value={jobData.Stipend} onChange={handleChange} required />
                <input type="text" name="Location" placeholder="Location" value={jobData.Location} onChange={handleChange} required />
                <textarea name="AboutJobInternship" placeholder="About Job/Internship" value={jobData.AboutJobInternship} onChange={handleChange} required />
                <textarea name="AboutCompany" placeholder="About Company" value={jobData.AboutCompany} onChange={handleChange} required />
                <textarea name="AdditionalInformation" placeholder="Additional Information" value={jobData.AdditionalInformation} onChange={handleChange} />
                <input type="text" name="Duration" placeholder="Duration" value={jobData.Duration} onChange={handleChange} />
                <button type="submit">Update Job</button>
            </form>
        </div>
    );
};

export default EditJob;