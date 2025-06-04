import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function EmployerDashboard() {
    const [activeTab, setActiveTab] = useState("jobs");
    const [jobs, setJobs] = useState([]);
    const [applicationsByJob, setApplicationsByJob] = useState({});

    const rawEmployerId = localStorage.getItem("employerId");
    const employerId = rawEmployerId ? parseInt(rawEmployerId) : null;

    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        salary: "",
        location: "",
        employmentType: "FULL_TIME",
        companyName: ""
    });

    useEffect(() => {
        if (employerId) fetchJobsByEmployer();
    }, [employerId]);

    const fetchJobsByEmployer = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/job-service/api/jobs/by-employer/${employerId}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`HTTP ${response.status}: ${message}`);
            }

            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to load jobs:", error);
        }
    };

    const handleInputChange = (e) => {
        setNewJob({ ...newJob, [e.target.name]: e.target.value });
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const jobToPost = { ...newJob, postedBy: employerId };
            const response = await fetch("http://localhost:8080/job-service/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(jobToPost),
            });
            if (response.ok) {
                alert("Job posted successfully!");
                setNewJob({
                    title: "",
                    description: "",
                    salary: "",
                    location: "",
                    employmentType: "FULL_TIME",
                    companyName: ""
                });
                fetchJobsByEmployer();
            } else {
                const message = await response.text();
                alert(`Failed to post job: ${message}`);
            }
        } catch (err) {
            alert("Error posting job");
            console.error(err);
        }
    };

    const fetchApplicationsForJob = async (jobId) => {
        try {
            const response = await fetch(`http://localhost:8080/job-service/api/applications/by-job/${jobId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(`HTTP ${response.status}: ${message}`);
            }
            const data = await response.json();
            setApplicationsByJob((prev) => ({ ...prev, [jobId]: data }));
        } catch (error) {
            console.error("Failed to load applications:", error);
        }
    };

    const handleDeleteJob = async (jobId) => {
        try {
            const response = await fetch(`http://localhost:8080/job-service/api/jobs/${jobId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(`HTTP ${response.status}: ${message}`);
            }
            fetchJobsByEmployer();
        } catch (error) {
            alert("Failed to delete job");
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b pb-2 mb-6">
                <button
                    onClick={() => setActiveTab("jobs")}
                    className={`text-lg ${activeTab === "jobs" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                >
                    My Jobs
                </button>
                <button
                    onClick={() => setActiveTab("post")}
                    className={`text-lg ${activeTab === "post" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                >
                    Post Job
                </button>
            </div>

            {activeTab === "jobs" && (
                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <p>No jobs posted yet.</p>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="bg-white p-4 border rounded shadow-sm">
                                <h2 className="text-xl font-semibold">{job.title}</h2>
                                <p className="text-gray-600">{job.location} | {job.employmentType} | ${job.salary}</p>
                                <p className="mt-2 text-sm text-gray-700">{job.description}</p>

                                <div className="flex gap-4 mt-4">
                                    <button
                                        className="text-blue-600 underline"
                                        onClick={() => fetchApplicationsForJob(job.id)}
                                    >
                                        View Applications
                                    </button>
                                    <button
                                        className="text-red-600 underline"
                                        onClick={() => handleDeleteJob(job.id)}
                                    >
                                        Delete Job
                                    </button>
                                </div>

                                {applicationsByJob[job.id] && (
                                    <div className="mt-4">
                                        <h3 className="font-semibold mb-2">Applications:</h3>
                                        <ul className="space-y-2">
                                            {applicationsByJob[job.id].map((app) => (
                                                <li key={app.id} className="p-2 border rounded bg-gray-50">
                                                    <p><strong>Employee ID:</strong> {app.employeeId}</p>
                                                    <p><strong>Status:</strong> {app.status}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "post" && (
                <div className="bg-white p-6 rounded shadow-md max-w-xl">
                    <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
                    <form onSubmit={handlePostJob} className="grid gap-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Job Title"
                            value={newJob.title}
                            onChange={handleInputChange}
                            required
                            className="border p-2 rounded"
                        />
                        <textarea
                            name="description"
                            placeholder="Job Description"
                            value={newJob.description}
                            onChange={handleInputChange}
                            required
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={newJob.location}
                            onChange={handleInputChange}
                            required
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            value={newJob.companyName}
                            onChange={handleInputChange}
                            required
                            className="border p-2 rounded"
                        />
                        <input
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={newJob.salary}
                            onChange={handleInputChange}
                            required
                            className="border p-2 rounded"
                        />
                        <select
                            name="employmentType"
                            value={newJob.employmentType}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        >
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="INTERN">Intern</option>
                        </select>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Post Job
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EmployerDashboard;
