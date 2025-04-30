"use client";
import React, { useEffect } from "react";
const VerifyEmail = ({ token }) => {
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("Verifying email with token:", token);
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Email verified successfully:", data);
        } else {
          console.error("Error verifying email:", data.error);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };

    verifyEmail();
  }, [token]);
  return <div>Verify your email....</div>;
};

export default VerifyEmail;
