import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.jpeg";
import user from "../assets/user.jpeg";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        setIsLoggedIn(!!token);
        setRole(userRole);
    }, [location.pathname]); // updates on route change

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setShowDropdown(false);
        navigate("/");
    };

    let homeLink = "/";
    if (role === "employee") {
        homeLink = "/employee/dashboard";
    } else if (role === "employer") {
        homeLink = "/employer/dashboard";
    }


    return (
        <header className="bg-white shadow-sm border-b border-gray-200 relative">
            <div className="w-full px-6 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3">
                    <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="text-xl font-bold text-gray-900">
                        Work<span className="text-blue-600">X</span>Life
                    </span>
                </Link>

                {/* Profile icon only if logged in */}
                {isLoggedIn && (
                    <div className="relative ml-6">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center space-x-2 hover:opacity-80 focus:outline-none"
                        >
                            <img src={user} alt="Profile" className="h-9 w-9 rounded-full border border-gray-300" />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate(role === "employee" ? "/employee/dashboard" : "/employer/dashboard");
                                    }}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Home
                                </button>



                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate("/employee/profile");
                                    }}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </button>


                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
