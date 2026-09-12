import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ApplyRTI from "./pages/ApplyRTI.jsx";
import TrackStatus from "./pages/TrackStatus.jsx";
import Departments from "./pages/Departments.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ApplicationDetail from "./pages/ApplicationDetail.jsx";
import Payment from "./pages/Payment.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track" element={<TrackStatus />} />
          <Route path="/departments" element={<Departments />} />

          <Route
            path="/apply"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <ApplyRTI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute roles={["citizen", "admin", "pio"]}>
                <ApplicationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id/pay"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
