import { useEffect, useState } from "react";
import { getUsers, updateUserRole, createUser } from "../services/userService";

function AdminPage() {

  const [users, setUsers] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("STAFF");

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  // ✅ VALIDATION START
  if (!newUsername || !newPassword) {
    alert("Username and password are required");
    return;
  }
  // ✅ VALIDATION END

  try {
    await createUser({
      username: newUsername,
      password: newPassword,
      role: newRole
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

  return (
    <div className="container-fluid">

      <h2 className="mb-4">Admin Panel</h2>

      {/* CREATE USER FORM */}
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
      <div className="card p-3">

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

    </div>
  );
}

export default AdminPage;