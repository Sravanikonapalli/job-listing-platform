import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/jobdetails.css";

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const isAuthenticated = localStorage.getItem("token");

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`https://job-listing-platform-tyqw.onrender.com/api/jobs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setJob(data);
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

    if (!job) {
        return <div>Loading...</div>;
    }

    return (
        <div className="job-details-container">
            <div className="job-details-header">
                <h2>{job.Role}</h2>
                {isAuthenticated && 
                <Link to={`/edit-job/${job.JobID}`} className="edit-job-button">Edit Job</Link>
                }
            </div>
            
            <p><strong>Employees:</strong> {job.Employees}</p>
            <p><strong>Work Mode:</strong> {job.WorkMode}</p>
            <p><strong>Skills:</strong> {job.Skills}</p>
            <p><strong>Job Type:</strong> {job.JobType}</p>
            <p><strong>Stipend:</strong> {job.Stipend}</p>
            <p><strong>Location:</strong> {job.Location}</p>
            <p><strong>About Job/Internship:</strong> {job.AboutJobInternship}</p>
            <p><strong>About Company:</strong> {job.AboutCompany}</p>
            <p><strong>Additional Information:</strong> {job.AdditionalInformation}</p>
            <p><strong>Duration:</strong> {job.Duration}</p>
        </div>
    );
};

export default JobDetails;
