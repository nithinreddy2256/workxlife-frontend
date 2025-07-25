import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployeeProfile from "./components/EmployeeProfile";
import EmployerProfilePage from './components/EmployerProfilePage';

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
                <Route path="/employee/profile/:employeeId" element={<EmployeeProfile />} />
                <Route path="/employer/profile" element={<EmployerProfilePage />} />

            </Routes>
        </Router>
    );
}

export default App;
