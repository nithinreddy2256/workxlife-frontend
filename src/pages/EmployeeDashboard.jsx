import { useState, useEffect } from "react";
import axios from "axios";

function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState("jobs");
    const [jobs, setJobs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loadedRecommendations, setLoadedRecommendations] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [applications, setApplications] = useState([]);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [companyName, setCompanyName] = useState("");

    const token = localStorage.getItem("token");

    let employeeId = null;
    try {
        const loginResponseRaw = localStorage.getItem("loginResponse");
        const loginResponse = JSON.parse(loginResponseRaw);
        employeeId = loginResponse?.employeeId;
    } catch (err) {
        console.error("Invalid loginResponse in localStorage", err);
    }

    useEffect(() => {
        fetchAllJobs();
    }, []);

    useEffect(() => {
        if (!title && !location && !companyName) {
            fetchAllJobs();
        }
    }, [title, location, companyName]);

    useEffect(() => {
        if (activeTab === "jobs") {
            fetchAppliedJobs();
        }
    }, [activeTab]);

    const fetchAllJobs = async () => {
        try {
            const response = await fetch("http://localhost:8080/job-service/api/jobs");
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    const fetchRecommendations = async () => {
        try {
            if (!token || !employeeId) return;

            const response = await fetch(`http://localhost:8080/recommendation-service/api/recommendations/${employeeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) return;
            const data = await response.json();
            setRecommendations(Array.isArray(data) ? data : []);
            setLoadedRecommendations(true);
        } catch (error) {
            console.error("Failed to fetch recommendations", error);
        }
    };

    const fetchAppliedJobs = async () => {
        if (!employeeId) return;
        try {
            const res = await axios.get(`http://localhost:8080/job-service/api/applications/applicant/${employeeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const appliedIds = res.data.map(app => app.job?.id);
            setAppliedJobIds(appliedIds);
            setApplications(res.data);
        } catch (err) {
            console.error("Failed to fetch applied jobs", err);
        }
    };

    const applyToJob = async (jobId) => {
        try {
            await axios.post("http://localhost:8080/job-service/api/applications", {
                job: { id: jobId },
                applicantId: employeeId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Application submitted successfully!");
            const updatedApplied = [...appliedJobIds, jobId];
            setAppliedJobIds(updatedApplied);
            if (selectedJob?.id === jobId) {
                setSelectedJob(prev => ({ ...prev }));
            }
        } catch (error) {
            console.error("Failed to apply to job", error);
            alert("Failed to apply: You might have already applied.");
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectedJob(null);
        if (tab === "recommendations" && !loadedRecommendations) {
            fetchRecommendations();
        }
        if (tab === "applications") {
            fetchAppliedJobs();
        }
    };

    const handleSearch = async () => {
        const params = new URLSearchParams();
        if (title) params.append("title", title);
        if (location) params.append("location", location);
        if (companyName) params.append("companyName", companyName);

        try {
            const response = await fetch(`http://localhost:8080/job-service/api/jobs/search?${params.toString()}`);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to search jobs", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const renderJobDetails = (job) => (
        <div className="w-full md:w-1/2 h-[70vh] overflow-y-auto border rounded-lg shadow-sm bg-white p-6 relative">
            <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
            >
                &times;
            </button>
            <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-1">{job.companyName}</p>
            <p className="text-gray-600 mb-3">{job.location}</p>
            <p>{job.description}</p>
            {!appliedJobIds.includes(job.id) ? (
                <button
                    onClick={() => applyToJob(job.id)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                >
                    Apply
                </button>
            ) : (
                <p className="mt-4 text-sm text-blue-600 font-medium">You have already applied to this job</p>
            )}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>

            <div className="flex gap-4 mb-6 border-b pb-2">
                <button onClick={() => handleTabClick("jobs")} className={`text-lg font-medium ${activeTab === "jobs" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}>Jobs</button>
                <button onClick={() => handleTabClick("recommendations")} className={`text-lg font-medium ${activeTab === "recommendations" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}>Recommendations</button>
                <button onClick={() => handleTabClick("applications")} className={`text-lg font-medium ${activeTab === "applications" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}>My Applications</button>
            </div>

            {activeTab === "jobs" && (
                <div className="mb-6 w-full flex flex-wrap gap-4">
                    <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={handleKeyDown} className="border rounded px-3 py-2 flex-1 min-w-[200px]" />
                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} onKeyDown={handleKeyDown} className="border rounded px-3 py-2 flex-1 min-w-[200px]" />
                    <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onKeyDown={handleKeyDown} className="border rounded px-3 py-2 flex-1 min-w-[200px]" />
                    <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
                </div>
            )}

            {activeTab === "jobs" && (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className={`space-y-4 ${selectedJob ? "md:w-1/2 h-[70vh] overflow-y-auto pr-2" : "w-full"}`}>
                        {jobs.length === 0 ? (
                            <p>No jobs available.</p>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.id} className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:shadow-md" onClick={() => setSelectedJob(job)}>
                                    <h2 className="text-xl font-semibold">{job.title}</h2>
                                    <p className="text-gray-600">{job.companyName} — {job.location}</p>
                                    <p className="mt-1 line-clamp-2">{job.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedJob && renderJobDetails(selectedJob)}
                </div>
            )}

            {activeTab === "recommendations" && (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className={`space-y-4 ${selectedJob ? "md:w-1/2 h-[70vh] overflow-y-auto pr-2" : "w-full"}`}>
                        {recommendations.length === 0 ? (
                            <p>No recommendations available.</p>
                        ) : (
                            recommendations.map((job) => (
                                <div
                                    key={job.id}
                                    className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:shadow-md"
                                    onClick={() => setSelectedJob(job)}
                                >
                                    <h2 className="text-xl font-semibold">{job.title}</h2>
                                    <p className="text-gray-600">{job.companyName} — {job.location}</p>
                                    <p className="mt-1 line-clamp-2">{job.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedJob && renderJobDetails(selectedJob)}
                </div>
            )}

            {activeTab === "applications" && (
                <div className="space-y-4">
                    {applications.length === 0 ? (
                        <p>You have not applied to any jobs yet.</p>
                    ) : (
                        applications.map((app, index) => (
                            <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
                                <h2 className="text-xl font-semibold">{app.job?.title || "Job Title"}</h2>
                                <p className="text-gray-600">Status: {app.status || "PENDING"}</p>
                                <p className="text-sm text-gray-500">Applied At: {app.appliedAt || "--"}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default EmployeeDashboard;
