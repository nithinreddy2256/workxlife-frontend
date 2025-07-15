import { useState, useEffect } from "react";

export default function EmployerProfilePage() {
    const [employer, setEmployer] = useState({
        companyName: "",
        industry: "",
        website: "",
        location: "",
        size: "",
        establishedYear: "",
        about: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        recruiterName: "",
        recruiterRole: "",
        recruiterBio: "",
    });

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchEmployer = async () => {
            const res = await fetch("http://localhost:8080/employer-service/api/employers/profile/1");
            if (res.ok) {
                const data = await res.json();
                setEmployer(data);
            }
        };

        fetchEmployer();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch("http://localhost:8080/employer-service/api/employers/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employer),
            });

            if (response.ok) {
                alert("Profile saved successfully!");
                setEditMode(false);
            }
        } catch (error) {
            console.error("Save error", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Employer Profile</h1>

            {!editMode ? (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded shadow">
                        <div className="flex justify-between items-center mb-4 bg-gray-400 px-3 py-2 rounded">
                            <h2 className="text-lg font-semibold">Company Information</h2>
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => setEditMode(true)}
                            >
                                 Edit
                            </button>
                        </div>
                        <div className="space-y-2">
                            <div><strong>Company:</strong> <span className="ml-2">{employer.companyName || "-"}</span></div>
                            <div><strong>Industry:</strong> <span className="ml-2">{employer.industry || "-"}</span></div>
                            <div><strong>Website:</strong> <span className="ml-2">{employer.website || "-"}</span></div>
                            <div><strong>Location:</strong> <span className="ml-2">{employer.location || "-"}</span></div>
                            <div><strong>Company Size:</strong> <span className="ml-2">{employer.size || "-"}</span></div>
                            <div><strong>Established Year:</strong> <span className="ml-2">{employer.establishedYear || "-"}</span></div>
                            <div><strong>About:</strong> <span className="ml-2">{employer.about || "-"}</span></div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <div className="bg-gray-400 px-3 py-2 rounded mb-4">
                            <h2 className="text-lg font-semibold">Contact Details</h2>
                        </div>
                        <div className="space-y-2">
                            <div><strong>Contact Person:</strong> <span className="ml-2">{employer.contactName || "-"}</span></div>
                            <div><strong>Email:</strong> <span className="ml-2">{employer.contactEmail || "-"}</span></div>
                            <div><strong>Phone:</strong> <span className="ml-2">{employer.contactPhone || "-"}</span></div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <div className="bg-gray-400 px-3 py-2 rounded mb-4">
                            <h2 className="text-lg font-semibold">Recruiter Info</h2>
                        </div>
                        <div className="space-y-2">
                            <div><strong>Name:</strong> <span className="ml-2">{employer.recruiterName || "-"}</span></div>
                            <div><strong>Role:</strong> <span className="ml-2">{employer.recruiterRole || "-"}</span></div>
                            <div><strong>Bio:</strong> <span className="ml-2">{employer.recruiterBio || "-"}</span></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="companyName" value={employer.companyName} onChange={handleChange} placeholder="Company Name" className="border rounded p-2" />
                        <input name="industry" value={employer.industry} onChange={handleChange} placeholder="Industry" className="border rounded p-2" />
                        <input name="website" value={employer.website} onChange={handleChange} placeholder="Website" className="border rounded p-2" />
                        <input name="location" value={employer.location} onChange={handleChange} placeholder="Location" className="border rounded p-2" />
                        <input name="size" value={employer.size} onChange={handleChange} placeholder="Company Size" className="border rounded p-2" />
                        <input name="establishedYear" value={employer.establishedYear} onChange={handleChange} placeholder="Established Year" className="border rounded p-2" />
                        <textarea name="about" value={employer.about} onChange={handleChange} placeholder="About the Company" className="sm:col-span-2 border rounded p-2" />

                        <input name="contactName" value={employer.contactName} onChange={handleChange} placeholder="Contact Person Name" className="border rounded p-2" />
                        <input name="contactEmail" value={employer.contactEmail} onChange={handleChange} placeholder="Contact Email" className="border rounded p-2" />
                        <input name="contactPhone" value={employer.contactPhone} onChange={handleChange} placeholder="Contact Phone" className="sm:col-span-2 border rounded p-2" />

                        <input name="recruiterName" value={employer.recruiterName} onChange={handleChange} placeholder="Your Name" className="border rounded p-2" />
                        <input name="recruiterRole" value={employer.recruiterRole} onChange={handleChange} placeholder="Your Role (e.g., HR Manager)" className="border rounded p-2" />
                        <textarea name="recruiterBio" value={employer.recruiterBio} onChange={handleChange} placeholder="Bio" className="sm:col-span-2 border rounded p-2" />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button onClick={() => setEditMode(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
                    </div>
                </div>
            )}
        </div>
    );
}