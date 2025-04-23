import { useState } from "react";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        alert(`Registered: ${name} (${email})`);
        // TODO: connect to backend registration endpoint
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f2f2f5]">
            <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md border border-gray-200">
                <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8 tracking-tight">
                    Create Account
                </h1>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 text-gray-800"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
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
