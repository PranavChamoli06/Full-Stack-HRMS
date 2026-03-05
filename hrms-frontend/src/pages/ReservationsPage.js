import { useEffect } from "react";
import { getReservations } from "../services/reservationService";

function ReservationsPage() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReservations();
        console.log("Reservations:", data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Reservations</h2>
      <p>Check console for API response</p>
    </div>
  );
}

export default ReservationsPage;