import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { RxCross2 } from "react-icons/rx";
import { IoIosAdd } from "react-icons/io";

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skills] = useState(["JavaScript", "Python", "HTML", "CSS", "React", "Node.js"]);
    const isAuthenticated = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/jobs");
                const data = await res.json();
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    const handleSkillSelect = (skill) => {
        if (skill && !selectedSkills.includes(skill)) {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleSkillRemove = (skill) => {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedSkills([]);
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedSkills.length === 0 || selectedSkills.every(skill => Array.isArray(job.skills) && job.skills.includes(skill)))
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>JobStation</h1>
                <div className="auth-buttons">
                    {isAuthenticated ? (
                        <>
                            <button className="logout-button" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
                            <button className="add-job-button" onClick={() => navigate("/add-job")}><IoIosAdd size={20}/> Add Job</button>
                        </>
                    ) : (
                        <>
                            <Link className="auth-link" to="/login">Login</Link>
                            <Link className="auth-link" to="/signup">Register</Link>
                        </>
                    )}
                </div>
            </header>

            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search job title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select onChange={(e) => handleSkillSelect(e.target.value)} className="skill-select">
                    <option value="">Select Skill</option>
                    {skills.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
                <div className="selected-skills">
                    {selectedSkills.map(skill => (
                        <span key={skill} className="skill-tag">
                            {skill} <button onClick={() => handleSkillRemove(skill)}><RxCross2 size={20}/></button>
                        </span>
                    ))}
                </div>
                <button onClick={clearFilters} className="clear-button">Clear</button>
            </div>

            <div className="job-list">
                {filteredJobs.map((job) => (
                    <div key={job.id} className="job-card">
                        <h3>{job.title}</h3>
                        <p><strong>Salary:</strong> {job.salaryRange}</p>
                        <p><strong>Job Type:</strong> {job.jobType}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Skills:</strong> {Array.isArray(job.skills) ? job.skills.join(", ") : "No skills listed"}</p>
                        <Link to={`/job/${job.id}`} className="details-link">View Details</Link>

                        {isAuthenticated && (
                            <button onClick={() => navigate(`/edit-job/${job.id}`)} className="edit-button">Edit</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
