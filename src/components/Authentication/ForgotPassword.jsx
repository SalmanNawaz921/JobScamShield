"use client";
import { forgotPasswordFormFields } from "@/lib/constants/constants";
import { AuthTemplate } from "./AuthTemplate";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { handleForgotPassword } from "@/services/authServices";

const ForgotPassword = () => {
  const router = useRouter();

  const onForgotPassword = async (values) => {
    const { email } = values;
    try {
      const resp = await handleForgotPassword(email);
      if (resp) {
        message.success("Password reset link sent to your email!");
      } else {
        message.error("Error sending password reset link.");
      }
    } catch (error) {
      console.error("Error sending password reset link:", error);
      message.error("Error sending password reset link.");
    }
  };
  return (
    <AuthTemplate
      title="Reset Your Password"
      description="Enter your email to receive password reset instructions"
      inputs={forgotPasswordFormFields}
      formTitle="Forgot Password"
      submitText="Reset Password"
      footerText="Remember your password?"
      footerLinkText="Sign in instead"
      footerLinkHref="/login"
      securityNotice="We'll send you a secure link to reset your password. This link will expire in 1 hour."
      onSubmit={onForgotPassword} // You might want to rename this to handleForgotPassword
      showForgotPassword={false}
    />
  );
};

export default ForgotPassword;
