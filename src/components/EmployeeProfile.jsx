import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

function EmployeeProfile() {
    const { employeeId: paramId } = useParams(); // from URL
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));

    const ownEmployeeId = loginResponse?.employeeId?.toString();
    const viewedEmployeeId = paramId || ownEmployeeId;

    const isOwner = ownEmployeeId === viewedEmployeeId;

    const [profile, setProfile] = useState(null);
    const [editingInfo, setEditingInfo] = useState(false);
    const [editingFiles, setEditingFiles] = useState(false);
    const [form, setForm] = useState({
        firstName: "", lastName: "", department: "", bio: "",
        currentPosition: "", location: "", experienceYears: "",
        education: [], certifications: []
    });
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const resumeInputRef = useRef(null);
    const imageInputRef = useRef(null);

    useEffect(() => {
        if (!viewedEmployeeId) return;
        fetchProfile(viewedEmployeeId);
    }, [viewedEmployeeId]);

    const fetchProfile = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/employee-service/api/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProfile(res.data);
            setForm({
                firstName: res.data.firstName || "",
                lastName: res.data.lastName || "",
                department: res.data.department || "",
                bio: res.data.bio || res.data.summary || "",
                currentPosition: res.data.currentPosition || "",
                location: res.data.location || "",
                experienceYears: res.data.experienceYears || "",
                education: res.data.education || [],
                certifications: res.data.certifications || [],
                newEducation: "",
                newCertification: ""
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
            const payload = { ...form, skills, summary: form.bio };
            await axios.put(`http://localhost:8080/employee-service/api/employees/${employeeId}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profile updated!");
            setEditingInfo(false);
            fetchProfile();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const uploadFiles = async () => {
        const formData = new FormData();
        if (profileImage) formData.append("profileImage", profileImage);
        if (resumeFile) formData.append("resume", resumeFile);

        try {
            await axios.put(`http://localhost:8080/employee-service/api/employees/${employeeId}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
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

            <button
                onClick={() => navigate(-1)}
                className="text-blue-600 underline text-sm mb-4"
            >
                ← Back to Dashboard
            </button>


            {/* Block 1: Profile Image + Name + Dept + Location */}
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
                        className="w-28 h-28 rounded-md object-cover border"
                    />
                    {isOwner && editingFiles && (
                        <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => setProfileImage(e.target.files[0])} className="hidden" />
                    )}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{form.firstName} {form.lastName}</h2>
                    <p className="text-gray-500">{form.department}</p>
                    <p className="text-sm text-gray-600">{form.location}</p>
                </div>
                {isOwner && (
                    <button onClick={() => setEditingFiles(true)} className="text-blue-600 text-xl">
                        <FaPen />
                    </button>
                )}
            </div>

            {/* Block 2: profile info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"> Profile Information</h2>
                    {isOwner && (
                        <button onClick={() => setEditingInfo(true)} className="text-blue-600 hover:text-blue-800 text-xl">
                            <FaPen />
                        </button>
                    )}
                </div>

                {!editingInfo ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-gray-700 text-[15px]">
                            <p><strong className="text-gray-800">Current Position:</strong> {form.currentPosition}</p>
                            <p><strong className="text-gray-800">Experience (years):</strong> {form.experienceYears}</p>
                            <p className="col-span-2"><strong className="text-gray-800">Bio:</strong> {form.bio}</p>
                        </div>

                        <div>
                            <strong className="text-gray-800 block mb-1">Skills:</strong>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {skills.map((skill, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <strong className="text-gray-800 block mb-1">Education:</strong>
                            <ul className="list-disc ml-6 mt-1 text-sm text-gray-700">
                                {form.education.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        </div>

                        <div>
                            <strong className="text-gray-800 block mb-1">Certifications:</strong>
                            <ul className="list-disc ml-6 mt-1 text-sm text-gray-700">
                                {form.certifications.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        </div>
                    </>
                ) : isOwner && (
                    <div className="grid gap-4">
                        {/* ... leave your editable form unchanged here ... */}
                    </div>
                )}
            </div>

            {/* Block 3: Resume Upload/Preview */}
            <div className="border rounded-lg p-4 shadow space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Resume</h3>
                    {isOwner && editingFiles && (
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
                        width="100%" height="400px" title="Resume"
                        className="border rounded-md"
                    ></iframe>
                ) : (
                    <p className="text-gray-500 text-sm">No resume uploaded.</p>
                )}
                {isOwner && editingFiles && (
                    <button onClick={uploadFiles} className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700">
                        Save Changes
                    </button>
                )}
            </div>


        </div>
    );
}

export default EmployeeProfile;
