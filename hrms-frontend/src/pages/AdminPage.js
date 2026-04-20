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

import "../styles/AdminPage.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("STAFF");

  const [pricing, setPricing] = useState([]);
  const [pricingForm, setPricingForm] = useState({
    date: "",
    multiplier: "",
    description: "",
  });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPricing = async () => {
    try {
      const data = await getAllPricing();
      setPricing(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPricing();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setLoadingUserId(userId);
      await updateUserRole(userId, role);
      fetchUsers();
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
  };

  const handleCreatePricing = async (e) => {
    e.preventDefault();

    if (!pricingForm.date || !pricingForm.multiplier) {
      alert("Date and multiplier are required");
      return;
    }

    await createPricing(pricingForm);

    alert("Pricing added successfully");

    setPricingForm({
      date: "",
      multiplier: "",
      description: "",
    });

    fetchPricing();
  };

  const handleDeletePricing = async (id) => {
    await deletePricing(id);
    fetchPricing();
  };

  return (
    <div className="admin-page">

      <h2 className="page-title mb-4">Admin Panel</h2>

      {/* Create User */}
      <div className="glass-chart-card mb-4">

        <h4 className="mb-3">Create User</h4>

        <form onSubmit={handleCreateUser}>
          <input
            className="form-control glass-input mb-2"
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />

          <input
            className="form-control glass-input mb-2"
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <select
            className="form-control glass-input mb-3"
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

      {/* Users Table */}
      <div className="glass-chart-card mb-4">

        <table className="table table-dark table-hover custom-table mb-0">
          <thead>
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
                    className="form-select glass-input"
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

      {/* Pricing */}
      <div className="glass-chart-card">

        <h4 className="mb-3">Pricing Management</h4>

        <form onSubmit={handleCreatePricing}>

          <input
            className="form-control glass-input mb-2"
            type="date"
            value={pricingForm.date}
            onChange={(e) =>
              setPricingForm({ ...pricingForm, date: e.target.value })
            }
          />

          <input
            className="form-control glass-input mb-2"
            type="number"
            step="0.01"
            placeholder="Multiplier (e.g. 1.40)"
            value={pricingForm.multiplier}
            onChange={(e) =>
              setPricingForm({
                ...pricingForm,
                multiplier: e.target.value,
              })
            }
          />

          <input
            className="form-control glass-input mb-3"
            type="text"
            placeholder="Description"
            value={pricingForm.description}
            onChange={(e) =>
              setPricingForm({
                ...pricingForm,
                description: e.target.value,
              })
            }
          />

          <button className="btn btn-primary">
            Add Pricing
          </button>

        </form>

        <table className="table table-dark table-hover custom-table mt-4">
          <thead>
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