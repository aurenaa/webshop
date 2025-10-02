import { useState, useEffect } from "react";
import axios from "axios";

export function useUsersList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/WebShopAppREST/rest/users/");
      setUsers(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return users;
}