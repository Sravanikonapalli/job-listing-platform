import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addjob.css";

const AddJob = ({ onJobAdded }) => {
    const [jobData, setJobData] = useState({
        Role: "",
        Employees: 0,
        WorkMode: "",
        Skills: [],
        JobType: "",
        Stipend: 0,
        Location: "",
        AboutJobInternship: "",
        AboutCompany: "",
        AdditionalInformation: "",
        Duration: "",
        CompanyName: "",
        CompanyLocation: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSkillsChange = (e) => {
        const selectedSkill = e.target.value;
        if (selectedSkill && !jobData.Skills.includes(selectedSkill)) {
            setJobData((prevData) => ({
                ...prevData,
                Skills: [...prevData.Skills, selectedSkill],
            }));
        }
        e.target.value = ""; // Reset dropdown after selection
    };

    const removeSkill = (skill) => {
        setJobData((prevData) => ({
            ...prevData,
            Skills: prevData.Skills.filter((s) => s !== skill),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        if (
            jobData.AboutCompany.length < 20 ||
            jobData.AboutJobInternship.length < 20 ||
            jobData.AdditionalInformation.length < 20
        ) {
            alert("Descriptions must be at least 20 characters.");
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(jobData).forEach((key) => {
                if (key === "Skills") {
                    formData.append(key, jobData.Skills.join(", "));
                } else {
                    formData.append(key, jobData[key]);
                }
            });

            const response = await fetch("http://localhost:3000/api/jobs", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const newJob = await response.json();
                alert("Job added successfully!");

                // Update the dashboard job list
                if (onJobAdded) {
                    onJobAdded(newJob);
                }

                navigate("/"); // Redirect to dashboard
            } else {
                const errorData = await response.json();
                alert(`Failed to add job: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error adding job:", error);
            alert("An error occurred while adding the job.");
        }
    };

    return (
        <div className="add-job-container">
            <div className="add-job-con">
            <h2>Add Job Description</h2>
            <form onSubmit={handleSubmit} className="add-job-form">
                <div className="label-and-input">
                <label>Role</label>
                <input type="text" name="Role" placeholder="Role" value={jobData.Role} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>no.of employees</label>
                <input type="number" name="Employees" placeholder="Employees" value={jobData.Employees} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>Work Mode:</label>
                <select name="WorkMode" value={jobData.WorkMode} onChange={handleChange} required>
                    <option value="">Select Work Mode</option>
                    <option value="Office">Office</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
                </div>
                <div className="label-and-input">
                <label>Select Required Skills:</label>
                <select name="Skills" onChange={handleSkillsChange}>
                    <option value="">Select a Skill</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="SQL">SQL</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                </select>

                <div className="selected-skills">
                    {jobData.Skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                            {skill} <button type="button" onClick={() => removeSkill(skill)}>×</button>
                        </span>
                    ))}
                </div>
                </div>
                <div className="label-and-input">
                <label>Job Type:</label>
                <select name="JobType" value={jobData.JobType} onChange={handleChange} required>
                    <option value="">Select Job Type</option>
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contractual">Contractual</option>
                </select>
                </div>
                <div className="label-and-input">
                <label>Stipend</label>
                <input type="number" name="Stipend" placeholder="Stipend" value={jobData.Stipend} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>Location</label>
                <input type="text" name="Location" placeholder="Location" value={jobData.Location} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>Company Name</label>
                <input type="text" name="CompanyName" placeholder="Company Name" value={jobData.CompanyName} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>Company Location</label>
                <input type="text" name="CompanyLocation" placeholder="Company Location" value={jobData.CompanyLocation} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>Job Description</label>
                <textarea name="AboutJobInternship" placeholder="About Job/Internship (min 20 chars)" value={jobData.AboutJobInternship} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>About Company</label>
                <textarea name="AboutCompany" placeholder="About Company (min 20 chars)" value={jobData.AboutCompany} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>Information</label>
                <textarea name="AdditionalInformation" placeholder="Additional Information (min 20 chars)" value={jobData.AdditionalInformation} onChange={handleChange} required />
                </div>
                <div className="label-and-input">
                <label>Duration</label>
                <input type="text" name="Duration" placeholder="Duration" value={jobData.Duration} onChange={handleChange} />
                </div>
                <button type="submit">Add Job</button>
            </form>
            </div>
            <div>
                <img src="https://i.postimg.cc/Qd0HWsmp/Job-Listing-Platform.png" alt="add-image" />
            </div>
        </div>
    );
};

export default AddJob;
