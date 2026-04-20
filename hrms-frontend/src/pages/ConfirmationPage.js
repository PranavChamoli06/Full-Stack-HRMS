import { useLocation } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import confirmBg from "../assets/confirm-bg.jpg";
import "../styles/ConfirmationPage.css";

export default function ConfirmationPage() {
  const location = useLocation();
  const data = location.state || {};

  return (
    <PublicLayout>
      <div
        className="confirmation-page"
        style={{ backgroundImage: `url(${confirmBg})` }}
      >
        <div className="confirmation-card">

          <h2>🎉 Booking Confirmed</h2>

          <p>
            <strong>Booking ID:</strong> {data.bookingId}
          </p>

          <p>
            <strong>Status:</strong> {data.status}
          </p>

          <p>
            <strong>Reference:</strong> {data.bookingReference}
          </p>

          <a href="/search">
            <button className="confirm-action-btn">
              Book Another Room
            </button>
          </a>

        </div>
      </div>
    </PublicLayout>
  );
}