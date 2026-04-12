import { Routes, Route } from "react-router-dom";

import PublicHome from "../pages/PublicHome";
import RoomSearch from "../pages/RoomSearch";
import BookingPage from "../pages/BookingPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import ViewBookingPage from "../pages/ViewBookingPage";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/search" element={<RoomSearch />} />
      <Route path="/book" element={<BookingPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/view-booking" element={<ViewBookingPage />} />
    </Routes>
  );
}