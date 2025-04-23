import { useState } from "react";
import Header from "../components/Header";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === "employee@workxlife.com" && password === "password") {
            localStorage.setItem("token", "mock-token");
            alert("Login successful (mock)!");
        } else {
            alert("Invalid credentials (mock)");
        }
    };

    return (
        <>
            <Header />

            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#f2f2f5]">
                <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md border border-gray-200">
                    <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8 tracking-tight">
                        Work<span className="text-black">X</span>Life Login
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 text-gray-800"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 text-gray-800"
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

                    {/* Register Link */}
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:underline font-medium">
                            Register here
                        </a>
                    </div>

                    {/* Google Login Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            className="w-full border border-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center space-x-2"
                            onClick={() => alert("Google login coming soon!")}
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            <span>Continue with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );


}

export default Login;
