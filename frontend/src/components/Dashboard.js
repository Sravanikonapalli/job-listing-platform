import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { RxCross2 } from "react-icons/rx";
import { IoIosAdd } from "react-icons/io";

const Dashboard = ({ newJob }) => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skills] = useState(["JavaScript", "Python", "HTML", "CSS", "React", "Node.js", "SEO", 
                   "Google Ads", "Content Marketing"]);
    const isAuthenticated = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("https://job-listing-platform-tyqw.onrender.com/api/jobs");
                const data = await res.json();
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();
    }, [newJob]); 

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
        job.Role.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedSkills.length === 0 || selectedSkills.every(skill => job.Skills && job.Skills.includes(skill)))
    );

    return (
        <div className="dashboard-container">
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search job title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div className="select-skills">
                <select onChange={(e) => handleSkillSelect(e.target.value)} className="skill-select">
                    <option value="">Select Skill</option>
                    {skills.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
                <div className="selected-skills">
                    {selectedSkills.map(skill => (
                        <span key={skill} className="skill-tag">
                            {skill} <button onClick={() => handleSkillRemove(skill)}>
                                <RxCross2 size={20} />
                            </button>
                        </span>
                    ))}
                </div>
                <button onClick={clearFilters} className="clear-button">Clear</button>
                </div>
                <div>
                {isAuthenticated && 
                <button className="add-job-button" onClick={() => navigate("/add-job")}>
                    <IoIosAdd size={20} /> Add Job
                </button>
                }
                </div>
            </div>
            

            <div className="job-list">
                {filteredJobs.map((job) => (
                    <div key={job.JobID} className="job-card">
                        <h3>{job.Role}</h3>
                        <p><strong>Employees:</strong> {job.Employees}</p>
                        <p><strong>Salary:</strong> {job.Stipend}</p>
                        <p><strong>Location:</strong> {job.Location}</p>
                        <p><strong>Skills:</strong> {job.Skills ? job.Skills : "No skills listed"}</p>
                        {isAuthenticated && 
                        <Link to={`/edit-job/${job.JobID}`} className="edit-btn">Edit Job</Link>
                        }
                        <Link to={`/job/${job.JobID}`} className="details-link">View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
