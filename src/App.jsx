import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployeeProfile from "./components/EmployeeProfile";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/employee/profile" element={<EmployeeProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
