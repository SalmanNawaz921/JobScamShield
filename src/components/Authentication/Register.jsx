"use client";
import { registerFormFields } from "@/lib/constants/constants";
import { AuthTemplate } from "./AuthTemplate";
import { useRouter } from "next/navigation";
import axios from "axios";
import { message } from "antd";

const Register = () => {
  const router = useRouter();
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
      message.success("User registered successfully!");
      // Send verification email
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

    } else {
      console.error("Error registering user:", resp.data);
    }
    //    router.push("/verify-email"); // Redirect to login page after successful registration
  };
  return (
    <AuthTemplate
      title="Join JobScamShield Protection"
      description="Create your secure account to detect fraudulent job postings"
      inputs={registerFormFields}
      formTitle="Create Your Account"
      submitText="Start Protection"
      footerText="Already protected?"
      footerLinkText="Sign in to your account"
      footerLinkHref="/login"
      securityNotice="Your information is encrypted and never shared. We only require what's needed for fraud detection."
      onSubmit={handleRegister} // Pass the handleRegister function to AuthTemplate
    />
  );
};

export default Register;
