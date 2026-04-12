import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
  if (role === "STAFF") return <Navigate to="/reservations" replace />;
  if (role === "MANAGER") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/unauthorized" replace />;
}

  return children;
}

export default ProtectedRoute;