import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import JobDetails from "./components/JobDetails";
import AddJob from "./components/AddJob";
import Header from "./components/Header";
import EditJob from "./components/EditJob";
const PrivateRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem("token");
    return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => (
    <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
            <Route path="/add-job" element={<PrivateRoute element={<AddJob />} />} />
        </Routes>
    </BrowserRouter>
);

export default App;
