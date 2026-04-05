import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ReservationsPage from "./pages/ReservationsPage";
import AdminPage from "./pages/AdminPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>

      <Routes>

        {/* 🔥 SMART DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            token ? (
              role === "ADMIN" || role === "MANAGER" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/reservations" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard (ADMIN + MANAGER only) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Reservations (ALL roles) */}
        <Route
          path="/reservations"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "STAFF"]}>
              <DashboardLayout>
                <ReservationsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin (ADMIN only) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout>
                <AdminPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;