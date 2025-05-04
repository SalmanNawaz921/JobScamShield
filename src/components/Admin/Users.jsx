"use client";
import { deleteUser, getUsers } from "@/services/userServices";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import UserTable from "./UsersTable";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Fetch users from the server or perform any other side effects here
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers(); // Adjust the API endpoint as needed
        if (response) {
          console.log("Users fetched successfully:", response);
          message.success("Users fetched successfully!");
          setUsers(response || []);
        }
      } catch (error) {
        message.error("Failed to fetch users. Please try again.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const onDeleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await deleteUser(userId); // Adjust the API endpoint as needed
      if (response) {
        message.success("User deleted successfully!");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
    } catch (error) {
      message.error("Failed to delete user. Please try again.");
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <UserTable users={users} loading={loading} onDelete={onDeleteUser} />
    </div>
  );
};

export default Users;
