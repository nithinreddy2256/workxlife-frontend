import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [department, setDepartment] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register({
                username,
                email,
                password,
                role: `ROLE_${role.toUpperCase()}`,
                firstName,
                middleName,
                lastName,
                department
            });
            alert("Registration Successful! Please Login.");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Registration Failed!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f2f2f5]">
            <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-xl border border-gray-200">
                <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8 tracking-tight">
                    Create Account
                </h1>
                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name (optional)</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Middle Name"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Register as</label>
                        <select
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="employee">Employee</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition duration-200"
                        >
                            Register
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/" className="text-blue-600 hover:underline font-medium">
                        Login here
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Register;
