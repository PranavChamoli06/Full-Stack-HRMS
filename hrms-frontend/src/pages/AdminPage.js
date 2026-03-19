import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../services/userService";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoadingUserId(userId);

      await updateUserRole(userId, newRole);

      console.log("Role updated successfully");

      await fetchUsers(); // ensure fresh data

    } catch (error) {
      console.error("Error updating role", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>

      <table border="1" style={{ marginTop: "20px", width: "60%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>

              <td>
                <select
                  value={user.role}
                  disabled={loadingUserId === user.id}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value)
                  }
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>

                {loadingUserId === user.id && (
                  <span style={{ marginLeft: "10px" }}>
                    Updating...
                  </span>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;