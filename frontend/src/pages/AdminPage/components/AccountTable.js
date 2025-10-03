import { useState, useEffect } from "react";
import axios from "axios";

export default function UserTable({ users: initialUsers }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleBlockToggle = async (user) => {
    if (user.role === "ADMIN") {
      alert("You cannot block administrators.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8080/WebShopAppREST/rest/users/${user.id}/block`,
        { blocked: !user.blocked },
        { headers: { "Content-Type": "application/json" } }
      );

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, blocked: response.data.blocked } : u
        )
      );
    } catch (err) {
      console.error("Error updating user block status", err);
      alert("Failed to update block status.");
    }
  };

  if (!users || users.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.blocked ? "Blocked" : "Active"}</td>
            <td>
              <button
                className={`btn btn-sm ${u.blocked ? "btn-success" : "btn-danger"}`}
                onClick={() => handleBlockToggle(u)}
              >
                {u.blocked ? "Unblock" : "Block"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}