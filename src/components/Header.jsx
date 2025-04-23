import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Header() {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="w-full px-6 py-3 flex items-center">
                <Link to="/" className="flex items-center space-x-3">
                    <img src={logo}
                         alt="Logo"
                         className="h-8 w-8 object-contain -translate-y-[2px]" />
                    <span className="text-xl font-bold text-gray-900">
            Work<span className="text-blue-600">X</span>Life
          </span>
                </Link>
            </div>
        </header>
    );
}

export default Header;
