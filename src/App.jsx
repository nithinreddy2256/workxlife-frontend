import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployerDashboard from "./pages/EmployerDashboard"; // ✅ updated import

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
