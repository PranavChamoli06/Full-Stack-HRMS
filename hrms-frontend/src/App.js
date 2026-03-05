import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ReservationsPage from "./pages/ReservationsPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;