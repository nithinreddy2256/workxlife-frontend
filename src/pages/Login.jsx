import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ username, password });
            const { token, userId, employeeId } = response.data;

            console.log("Login Response:", response.data);

            localStorage.setItem("token", token);
            localStorage.setItem("loginResponse", JSON.stringify({ token, userId, employeeId }));

            const payload = JSON.parse(atob(token.split('.')[1]));
            const roles = payload.roles || [];
            const role = roles[0]?.toLowerCase().replace("role_", "");
            localStorage.setItem("role", role);

            if (role === "employee") {
                if (employeeId !== undefined && employeeId !== null) {
                    localStorage.setItem("employeeId", employeeId);
                } else {
                    localStorage.removeItem("employeeId");
                }
                navigate("/employee/dashboard");
            } else if (role === "employer") {
                localStorage.setItem("employerId", userId);
                navigate("/employer/dashboard");
            } else {
                alert("Unknown role in token");
            }

            alert("Login Successful!");
        } catch (error) {
            console.error("Login Failed!", error);
            alert("Login Failed!");
        }
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-start bg-[#f2f2f5] pt-36 overflow-hidden">
            <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md border border-gray-200">
                <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8 tracking-tight">
                    Work<span className="text-black">X</span>Life Login
                </h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition duration-200"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline font-medium">
                        Register here
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;
