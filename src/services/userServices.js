import axios from "axios";
const API_BASE_URL = "/api";
export const getUsers = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch users");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getUserById = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch user");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/users/delete?userid=${userId}`,
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};

export const updateUser = async (userId, data) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/users/update?userId=${userId}`,
      data,
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};
