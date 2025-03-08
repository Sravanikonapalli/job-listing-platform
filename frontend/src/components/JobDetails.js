import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/jobdetails.css"; 

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            setError(null); 

            try {
                const response = await fetch(`http://localhost:3000/api/jobs/${id}`);

                if (!response.ok) {
                    throw new Error("Job not found.");
                }

                const data = await response.json();
                setJob(data);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching job details:", error);
            }
        };

        fetchJob();
    }, [id]);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!job) {
        return <p className="loading-message">Loading...</p>;
    }

    return (
        <div className="job-details-container">
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <Link to="/" className="back-button">Back to Jobs</Link>
        </div>
    );
};

export default JobDetails;
