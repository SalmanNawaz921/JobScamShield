"use client";
import { signInFormFields } from "@/lib/constants/constants";
import { AuthTemplate } from "./AuthTemplate";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/services/authServices";
import { useUserContext } from "@/context/UserContext";

const Login = () => {
  const router = useRouter();
  const { setUserData } = useUserContext();
  const onLogin = async (values) => {
    try {
      const userData = await handleLogin(values);
      if (!userData.user) {
        message.error("Invalid email or password");
        return;
      } else if (userData.requires2FA) {
        message.success("2FA verification required!");
        setUserData(userData.user);
        router.push(`/account/verify-otp`);
        return;
      } else if (userData.emailVerified === false) {
        message.error("Email not verified. Please check your inbox.");
        
        return;
      }
      message.success("Login successful!");
      router.push(`/user/${userData.user.username}/dashboard`);
    } catch (error) {
      console.error("Login error:", error);
      message.error(error.message || "Invalid email or password");
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
