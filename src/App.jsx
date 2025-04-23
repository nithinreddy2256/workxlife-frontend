import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import Register from "./pages/Register";

function App() {
    return (

        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/employer" element={<EmployerDashboard />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
