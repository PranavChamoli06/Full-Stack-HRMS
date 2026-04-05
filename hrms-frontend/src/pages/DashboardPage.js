import { useEffect, useState } from "react";
import { getReservations } from "../services/reservationService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function DashboardPage() {

  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [dateFilter, setDateFilter] = useState("ALL");

  useEffect(() => {
    fetchReservations();
    fetchStats();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations(0, 100);
      setReservations(data?.content || []);
    } catch (error) {
      console.error("Error loading reservations", error);
      setReservations([]);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/v1/reservations/stats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats", error);
      setStats({});
    }
  };

  /* FILTER */
  const filterReservations = () => {
    if (dateFilter === "ALL") return reservations;

    const now = new Date();
    let days = 0;

    if (dateFilter === "7D") days = 7;
    if (dateFilter === "30D") days = 30;
    if (dateFilter === "6M") days = 180;

    const cutoff = new Date();
    cutoff.setDate(now.getDate() - days);

    return reservations.filter((r) => new Date(r.checkInDate) >= cutoff);
  };

  const filteredReservations = filterReservations();

  /* KPIs */
  const totalReservations = filteredReservations.length;

  /* CHART DATA */
  const reservationsPerMonth = {};
  filteredReservations.forEach((r) => {
    const month = r.checkInDate.substring(0, 7);
    reservationsPerMonth[month] = (reservationsPerMonth[month] || 0) + 1;
  });

  const chartData = Object.keys(reservationsPerMonth).map((month) => ({
    month,
    reservations: reservationsPerMonth[month]
  }));

  /* REVENUE */
  const revenuePerMonth = {};
  filteredReservations.forEach((r) => {
    const month = r.checkInDate.substring(0, 7);
    const price = r.price || 2500;

    const nights = Math.max(
      (new Date(r.checkOutDate) - new Date(r.checkInDate)) /
        (1000 * 60 * 60 * 24),
      1
    );

    revenuePerMonth[month] =
      (revenuePerMonth[month] || 0) + nights * price;
  });

  const revenueChartData = Object.keys(revenuePerMonth).map((month) => ({
    month,
    revenue: revenuePerMonth[month]
  }));

  const totalRevenue = Object.values(revenuePerMonth).reduce(
    (a, b) => a + b,
    0
  );

  const months = Object.keys(revenuePerMonth).sort();
  let revenueGrowth = 0;

  if (months.length >= 2) {
    const curr = revenuePerMonth[months.at(-1)];
    const prev = revenuePerMonth[months.at(-2)];
    if (prev > 0) {
      revenueGrowth = ((curr - prev) / prev) * 100;
    }
  }

  revenueGrowth = Math.round(revenueGrowth);

  /* OCCUPANCY */
  const totalRooms = 20;
  const occupiedRooms = filteredReservations.length;

  const occupancyPercent = Math.min(
    Math.round((occupiedRooms / totalRooms) * 100),
    100
  );

  const gaugeData = [
    { name: "Occupied", value: occupancyPercent },
    { name: "Available", value: 100 - occupancyPercent }
  ];

  return (
    <div className="container-fluid">

      <h2 className="mb-4">Dashboard</h2>

      {/* FILTER */}
      <div className="btn-group mb-4">
        <button className="btn btn-outline-primary" onClick={() => setDateFilter("ALL")}>All</button>
        <button className="btn btn-outline-primary" onClick={() => setDateFilter("7D")}>7D</button>
        <button className="btn btn-outline-primary" onClick={() => setDateFilter("30D")}>30D</button>
        <button className="btn btn-outline-primary" onClick={() => setDateFilter("6M")}>6M</button>
      </div>

      {/* KPI CARDS */}
      <div className="d-flex gap-3 flex-wrap mb-4">

        <div className="card text-center p-3" style={{ width: "200px" }}>
          <h6>Total Reservations</h6>
          <h3>{totalReservations}</h3>
        </div>

        <div className="card text-center p-3" style={{ width: "200px" }}>
          <h6>Revenue</h6>
          <h3>₹{totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="card text-center p-3" style={{ width: "200px" }}>
          <h6>Growth</h6>
          <h3 className={revenueGrowth >= 0 ? "text-success" : "text-danger"}>
            {revenueGrowth >= 0 ? "↑" : "↓"} {Math.abs(revenueGrowth)}%
          </h3>
        </div>

        {/* STATUS CARDS */}
        <div className="card text-center p-3" style={{ width: "200px" }}>
          <h6>Pending</h6>
          <h3>{stats.PENDING || 0}</h3>
        </div>

        <div className="card text-center p-3" style={{ width: "200px" }}>
          <h6>Confirmed</h6>
          <h3>{stats.CONFIRMED || 0}</h3>
        </div>

        <div className="card text-center p-3" style={{ width: "200px" }}>
          <h6>Completed</h6>
          <h3>{stats.COMPLETED || 0}</h3>
        </div>

        <div className="card text-center p-3" style={{ width: "200px" }}>
          <h6>Cancelled</h6>
          <h3>{stats.CANCELLED || 0}</h3>
        </div>

      </div>

      {/* CHARTS */}
      <div className="row g-4">

        <div className="col-md-6">
          <div className="card p-3">
            <h5>Reservation Trends</h5>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reservations" stroke="#0d6efd" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h5>Revenue Trend</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#198754" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* OCCUPANCY */}
      <div className="card p-3 mt-4 text-center">
        <h5>Room Occupancy</h5>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
            >
              <Cell fill="#dc3545" />
              <Cell fill="#e9ecef" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <h3 className="mt-2">{occupancyPercent}%</h3>
      </div>

    </div>
  );
}

export default DashboardPage;