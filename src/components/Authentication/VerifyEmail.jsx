"use client";
import { message } from "antd";
import { useRouter } from 'next/navigation';
import React, { useEffect } from "react";
const VerifyEmail = ({ token }) => {
  const router = useRouter();
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
        });
        const data = await response.json();
        if (response.ok) {
          message.success("Email verified successfully:", data);
          router.push("/login"); // Redirect to login page after successful verification
        } else {
          console.error("Error verifying email:", data.error);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };

    verifyEmail();
  }, [token]);
  return <div>Your email has been successfully verified....</div>;
};

export default VerifyEmail;
