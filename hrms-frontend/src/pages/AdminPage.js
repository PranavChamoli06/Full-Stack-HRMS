import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserRole,
  createUser,
} from "../services/userService";

import {
  getAllPricing,
  createPricing,
  deletePricing,
} from "../services/pricingService";

function AdminPage() {

  // ================= USER STATE =================
  const [users, setUsers] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("STAFF");

  // ================= PRICING STATE =================
  const [pricing, setPricing] = useState([]);
  const [pricingForm, setPricingForm] = useState({
    date: "",
    multiplier: "",
    description: "",
  });

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // ================= FETCH PRICING =================
  const fetchPricing = async () => {
    try {
      const data = await getAllPricing();
      setPricing(data);
    } catch (error) {
      console.error("Error fetching pricing", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPricing();
  }, []);

  // ================= USER ACTIONS =================
  const handleRoleChange = async (userId, role) => {
    try {
      setLoadingUserId(userId);
      await updateUserRole(userId, role);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!newUsername || !newPassword) {
      alert("Username and password are required");
      return;
    }

    try {
      await createUser({
        username: newUsername,
        password: newPassword,
        role: newRole,
      });

      alert("User created successfully");

      setNewUsername("");
      setNewPassword("");
      setNewRole("STAFF");

      fetchUsers();
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  // ================= PRICING ACTIONS =================
  const handleCreatePricing = async (e) => {
    e.preventDefault();

    if (!pricingForm.date || !pricingForm.multiplier) {
      alert("Date and multiplier are required");
      return;
    }

    try {
      await createPricing(pricingForm);

      alert("Pricing added successfully");

      setPricingForm({
        date: "",
        multiplier: "",
        description: "",
      });

      fetchPricing();
    } catch (error) {
      console.error("Error creating pricing", error);
    }
  };

  const handleDeletePricing = async (id) => {
    try {
      await deletePricing(id);
      fetchPricing();
    } catch (error) {
      console.error("Error deleting pricing", error);
    }
  };

  return (
    <div className="container-fluid">

      <h2 className="mb-4">Admin Panel</h2>

      {/* ================= USER MANAGEMENT ================= */}
      <div className="card p-3 mb-4">

        <h4>Create User</h4>

        <form onSubmit={handleCreateUser}>

          <input
            className="form-control mb-2"
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />

          <input
            className="form-control mb-2"
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <select
            className="form-control mb-2"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="STAFF">STAFF</option>
          </select>

          <button className="btn btn-success">
            Create User
          </button>

        </form>

      </div>

      {/* USERS TABLE */}
      <div className="card p-3 mb-4">

        <table className="table table-bordered table-striped mb-0">

          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Change Role</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id}>

                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>

                <td>

                  <select
                    className="form-select"
                    value={user.role}
                    disabled={loadingUserId === user.id}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value)
                    }
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="STAFF">STAFF</option>
                  </select>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ================= PRICING MANAGEMENT ================= */}
      <div className="card p-3">

        <h4>Pricing Management</h4>

        {/* FORM */}
        <form onSubmit={handleCreatePricing}>

          <input
            className="form-control mb-2"
            type="date"
            value={pricingForm.date}
            onChange={(e) =>
              setPricingForm({ ...pricingForm, date: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            type="number"
            step="0.01"
            placeholder="Multiplier (e.g. 1.40)"
            value={pricingForm.multiplier}
            onChange={(e) =>
              setPricingForm({ ...pricingForm, multiplier: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            type="text"
            placeholder="Description"
            value={pricingForm.description}
            onChange={(e) =>
              setPricingForm({ ...pricingForm, description: e.target.value })
            }
          />

          <button className="btn btn-primary">
            Add Pricing
          </button>

        </form>

        {/* TABLE */}
        <table className="table table-bordered table-striped mt-3">

          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Multiplier</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {pricing.map((p) => (
              <tr key={p.id}>
                <td>{p.date}</td>
                <td>{p.multiplier}</td>
                <td>{p.description}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeletePricing(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminPage;