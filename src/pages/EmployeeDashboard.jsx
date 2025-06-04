import { useState, useEffect } from "react";

function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState("jobs");
    const [jobs, setJobs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loadedRecommendations, setLoadedRecommendations] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [companyName, setCompanyName] = useState("");

    useEffect(() => {
        fetchAllJobs();
    }, []);

    useEffect(() => {
        if (!title && !location && !companyName) {
            fetchAllJobs();
        }
    }, [title, location, companyName]);

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
            const token = localStorage.getItem("token");
            const loginResponseRaw = localStorage.getItem("loginResponse");

            if (!token || !loginResponseRaw) {
                console.error(" Missing token or loginResponse in localStorage");
                return;
            }

            let employeeId = null;
            try {
                const loginResponse = JSON.parse(loginResponseRaw);
                employeeId = loginResponse?.employeeId;

                if (!employeeId || isNaN(employeeId)) {
                    console.error(" employeeId is invalid or missing:", employeeId);
                    return;
                }

            } catch (parseError) {
                console.error(" Failed to parse loginResponse:", parseError.message);
                return;
            }

            console.log(" Fetching recommendations for employeeId:", employeeId);

            const response = await fetch(`http://localhost:8080/recommendation-service/api/recommendations/${employeeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error(` Failed to fetch: ${response.status} ${response.statusText}`);
                return;
            }

            const data = await response.json();
            console.log(" Recommendations received:", data);
            setRecommendations(Array.isArray(data) ? data : []);
            setLoadedRecommendations(true);
        } catch (error) {
            console.error(" fetchRecommendations unexpected error:", error.message);
        }
    };


    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectedJob(null);
        if (tab === "recommendations" && !loadedRecommendations) {
            fetchRecommendations();
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
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b pb-2">
                <button
                    onClick={() => handleTabClick("jobs")}
                    className={`text-lg font-medium ${
                        activeTab === "jobs" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                    }`}
                >
                    Jobs
                </button>
                <button
                    onClick={() => handleTabClick("recommendations")}
                    className={`text-lg font-medium ${
                        activeTab === "recommendations" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                    }`}
                >
                    Recommendations
                </button>
            </div>

            {/* Search Fields */}
            {activeTab === "jobs" && (
                <div className="mb-6 w-full flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Job Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border rounded px-3 py-2 flex-1 min-w-[200px]"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border rounded px-3 py-2 flex-1 min-w-[200px]"
                    />
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border rounded px-3 py-2 flex-1 min-w-[200px]"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Search
                    </button>
                </div>
            )}

            {/* Job Listing & Detail View */}
            {activeTab === "jobs" && (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className={`space-y-4 ${selectedJob ? "md:w-1/2 h-[70vh] overflow-y-auto pr-2" : "w-full"}`}>
                        {jobs.length === 0 ? (
                            <p>No jobs available.</p>
                        ) : (
                            jobs.map((job) => (
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

            {/* Recommendations */}
            {activeTab === "recommendations" && (
                <div className="space-y-4">
                    {recommendations.length === 0 ? (
                        <p>No recommendations available.</p>
                    ) : (
                        recommendations.map((job) => (
                            <div key={job.id} className="p-4 border rounded-lg shadow-sm bg-white">
                                <h2 className="text-xl font-semibold">{job.title}</h2>
                                <p className="text-gray-600">{job.companyName} — {job.location}</p>
                                <p className="mt-1">{job.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default EmployeeDashboard;
