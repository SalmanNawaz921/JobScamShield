import axios from "axios";

export const verifyToken = async () => {
  try {
    const response = await axios.post(
      `/api/auth/verify-token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return false; // Token is invalid or an error occurred
  }
};
