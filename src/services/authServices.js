import { message } from "antd";
import axios from "axios";

const handleLogin = async (values) => {
  const { email, password } = values;
  const requestBody = {
    email,
    password,
  };
  try {
    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (resp.ok) {
      const data = await resp.json();
      message.success("User logged in successfully!");
      console.log("User logged in successfully:", data);
      // Handle successful login (e.g., redirect to dashboard)
    } else {
      console.error("Error logging in:", resp.statusText);
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

const handleRegister = async (values) => {
  const { email, password, firstName, lastName, username } = values;
  const requestBody = {
    email,
    password,
    firstName,
    lastName,
    username,
  };
  const resp = await axios.post("/api/auth/register", requestBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (resp.status === 200) {
    console.log("User registered successfully:", resp.data);
    message.success("User registered successfully!");
    // Send verification email
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random OTP
    const emailData = {
      name: firstName,
      email: email,
      link: `${window.location.origin}/verify-email`,
      subject: "Verify your email address",
      message: `Welcome To JobScamShield, In order to complete your registration, please verify your email address.`,
      userId: resp.data.userId,
    };
    const emailResp = await axios.post("/api/send-email", emailData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (emailResp.status === 200) {
      message.success("Verification email sent successfully!");
    }
    // Handle email sending error
    else {
      message.error("Error sending verification email.");
    }

    console.log("User registered successfully:", resp.data);
  } else {
    console.error("Error registering user:", resp.data);
  }
  //    router.push("/verify-email"); // Redirect to login page after successful registration
};

export const handleLogout = async () => {
  try {
    const resp = await axios.post("/api/auth/logout");
    if (resp.status === 200) {
      return true; // Logout successful
    }
    return false; // Logout failed
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
