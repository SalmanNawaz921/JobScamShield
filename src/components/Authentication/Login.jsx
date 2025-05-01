"use client";
import { signInFormFields } from "@/lib/constants/constants";
import { AuthTemplate } from "./AuthTemplate";
import { message } from "antd";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
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
        router.push(`user/${data.user.username}/dashboard`);
        // Handle successful login (e.g., redirect to dashboard)
      } else {
        console.error("Error logging in:", resp.statusText);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  return (
    <AuthTemplate
      title="Secure JobScamShield Login"
      description="Protect yourself from fraudulent job postings"
      inputs={signInFormFields}
      formTitle="Login"
      submitText="Authenticate"
      footerText="New to JobScamShield?"
      footerLinkText="Activate protection"
      footerLinkHref="/register"
      onSubmit={handleLogin}
    />
  );
};

export default Login;
