import { useNavigate } from "react-router-dom";
import publicBg from "../assets/public-bg.jpg";
import "../styles/PublicHome.css";

export default function PublicHome() {
  const navigate = useNavigate();

  return (
    <div
      className="public-home-page"
      style={{ backgroundImage: `url(${publicBg})` }}
    >
      <div className="public-home-card">

        <h1>Welcome to HRMS Booking</h1>

        <p>Book your stay quickly and easily</p>

        <div className="public-home-actions">

          <button
            onClick={() => navigate("/search")}
            className="btn-start-booking"
          >
            Start Booking
          </button>

          <button
            onClick={() => navigate("/view-booking")}
            className="btn-view-booking"
          >
            View Booking
          </button>

        </div>

      </div>
    </div>
  );
}