// authServices.js
import { message } from "antd";
import axios from "axios";

const API_BASE_URL = "/api/auth";

export const handleLogin = async (values) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Invalid email or password"
      );
    } else {
      throw new Error("Network error. Please try again.");
    }
  }
};

export const handleRegister = async (values) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data) {
      // Return user data and indicate email verification is needed
      return {
        ...response.data,
        requiresVerification: true,
      };
    }
    throw new Error("Registration failed");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      throw new Error("Network error. Please try again.");
    }
  }
};

export const handleLogout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

export const handleEmailVerification = async ({ otp, userId }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-email`, {
      otp,
      userId,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Verification failed");
    } else {
      throw new Error("Network error during verification");
    }
  }
};

export const sendVerificationEmail = async (emailData) => {
  try {
    const response = await axios.post("/api/send-email", emailData);
    return response.data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
};

export const generate2faQrCode = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/2fa/qrcode`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const verify2faCode = async (secret, code) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/2fa/verify`,
      { secret, code },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    throw new Error("Failed to verify 2FA code");
  }
};

export const verify2faLoginCode = async (userId, code) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/2fa/verify-two-fa-login`,
      { userId, code },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying 2FA login code:", error);
    throw new Error("Failed to verify 2FA login code");
  }
};
