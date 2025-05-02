"use client";
import { signInFormFields } from "@/lib/constants/constants";
import { AuthTemplate } from "./AuthTemplate";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/services/authServices";

const Login = () => {
  const router = useRouter();
  const onLogin = async (values) => {
    try {
      const user = await handleLogin(values);
      if (!user) {
        message.error("Invalid email or password");
        return;
      }
      message.success("Login successful!");
      router.push(`/user/${user.username}/dashboard`);
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        error.message || "Invalid email or password"
      );
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
      onSubmit={onLogin}
    />
  );
};

export default Login;
