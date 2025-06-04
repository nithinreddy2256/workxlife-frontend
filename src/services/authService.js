import axios from "axios";

const API_URL = "http://localhost:8080/authentication-service/api/auth";

export const login = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true // ✅ Add this
    });
};

export const register = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
    });
};



