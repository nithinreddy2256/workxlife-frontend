import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPen } from "react-icons/fa";

function EmployeeProfile() {
    const [profile, setProfile] = useState(null);
    const [editingInfo, setEditingInfo] = useState(false);
    const [editingFiles, setEditingFiles] = useState(false);
    const [form, setForm] = useState({ firstName: "", lastName: "", department: "", bio: "" });
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const resumeInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const token = localStorage.getItem("token");
    let employeeId = null;
    try {
        const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
        employeeId = loginResponse?.employeeId;
    } catch (err) {
        console.error("Invalid loginResponse", err);
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/employee-service/api/employees/${employeeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setForm({
                firstName: res.data.firstName || "",
                lastName: res.data.lastName || "",
                department: res.data.department || "",
                bio: res.data.bio || ""
            });
            setSkills(res.data.skills || []);
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const addSkill = () => {
        if (newSkill.trim()) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };
    const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));

    const updateProfile = async () => {
        try {
            const payload = { ...form, skills };
            await axios.put(`http://localhost:8080/employee-service/api/employees/${employeeId}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profile updated!");
            setEditingInfo(false);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const uploadFiles = async () => {
        const formData = new FormData();
        if (profileImage) formData.append("profileImage", profileImage);
        if (resumeFile) formData.append("resume", resumeFile);

        try {
            await axios.put(
                `http://localhost:8080/employee-service/api/employees/${employeeId}/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            alert("Files uploaded!");
            setEditingFiles(false);
            fetchProfile();
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    if (!profile) {
        return <div className="text-center py-20 text-gray-600">Loading profile...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Block 1: Profile Image + Name + Dept */}
            <div className="flex items-center gap-6 border rounded-lg p-4 shadow">
                <div className="relative">
                    <img
                        src={
                            profileImage
                                ? URL.createObjectURL(profileImage)
                                : profile?.profileImageUrl
                                    ? `http://localhost:8082${profile.profileImageUrl}`
                                    : "https://via.placeholder.com/120"
                        }
                        alt="Profile"
                        className="w-28 h-28 rounded-lg object-cover border"
                    />
                    {editingFiles && (
                        <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => setProfileImage(e.target.files[0])} className="hidden" />
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{form.firstName} {form.lastName}</h2>
                    <p className="text-gray-500 text-lg">{form.department}</p>
                </div>
                <button onClick={() => setEditingFiles(true)} className="ml-auto text-blue-600 text-xl">
                    <FaPen />
                </button>
            </div>

            {/* Block 2: Resume Upload/Preview */}
            <div className="border rounded-lg p-4 shadow space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Resume</h3>
                    {editingFiles && (
                        <div>
                            <input type="file" accept="application/pdf" ref={resumeInputRef} onChange={(e) => setResumeFile(e.target.files[0])} className="hidden" />
                            <button onClick={() => resumeInputRef.current.click()} className="text-sm text-blue-600 hover:underline">Upload</button>
                        </div>
                    )}
                </div>

                {resumeFile ? (
                    <p className="text-sm text-gray-700">{resumeFile.name}</p>
                ) : profile?.resumeUrl ? (
                    <iframe
                        src={`http://localhost:8082${profile.resumeUrl}`}
                        width="100%"
                        height="400px"
                        className="border"
                        title="Resume Preview"
                    ></iframe>
                ) : (
                    <p className="text-gray-500 text-sm">No resume uploaded.</p>
                )}

                {editingFiles && (
                    <button onClick={uploadFiles} className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700">
                        Save Changes
                    </button>
                )}
            </div>

            {/* Block 3: Profile Info */}
            <div className="border rounded-lg p-6 shadow space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                    <button onClick={() => setEditingInfo(true)} className="text-blue-600 text-xl"><FaPen /></button>
                </div>

                {!editingInfo ? (
                    <>
                        <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
                        <p><strong>Department:</strong> {form.department}</p>
                        <p><strong>Bio:</strong> {form.bio}</p>
                        <div>
                            <strong>Skills:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="grid gap-4">
                        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="border rounded px-4 py-2" />
                        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="border rounded px-4 py-2" />
                        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="border rounded px-4 py-2" />
                        <textarea name="bio" placeholder="Bio" rows="3" value={form.bio} onChange={handleChange} className="border rounded px-4 py-2" />

                        <div>
                            <label className="block font-medium mb-1">Skills</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                        {skill}
                                        <button onClick={() => removeSkill(i)} className="text-xs font-bold hover:text-red-600">×</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill..." className="border px-3 py-2 rounded w-full" />
                                <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button onClick={updateProfile} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                                Save
                            </button>
                            <button onClick={() => setEditingInfo(false)} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeProfile;
