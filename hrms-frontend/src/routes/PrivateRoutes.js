import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ReservationsPage from "../pages/ReservationsPage";
import AdminPage from "../pages/AdminPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

export default function PrivateRoutes() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* OPTIONAL SMART REDIRECT */}
      <Route
        path="/app"
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

      {/* DASHBOARD */}
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

      {/* RESERVATIONS */}
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

      {/* ADMIN */}
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

      {/* UNAUTHORIZED */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

    </Routes>
  );
}