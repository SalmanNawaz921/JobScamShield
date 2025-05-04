"use client";
import { resetPasswordFormFields } from "@/lib/constants/constants";
import { AuthTemplate } from "./AuthTemplate";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { handleResetPassword } from "@/services/authServices";

const ResetPassword = ({ token,email }) => {
  const router = useRouter();

  const onResetPassword = async (values) => {
    const { newPassword, confirmNewPassword } = values;

    if (newPassword !== confirmNewPassword) {
      message.error("Passwords don't match!");
      return;
    }
    try {
      const resp = await handleResetPassword(email, newPassword, token);
      if (resp?.success) {
        message.success("Password has been reset successfully!");
        router.push("/login");
      } else {
        message.error(resp?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password: ", error);
      message.error(
        error.response?.data?.message || "Error resetting password"
      );
    }
  };

  return (
    <AuthTemplate
      title="Set New Password"
      description="Create a strong, secure password for your account"
      inputs={resetPasswordFormFields}
      formTitle="Reset Password"
      submitText="Update Password"
      footerText="Remember your password?"
      footerLinkText="Sign in instead"
      footerLinkHref="/login"
      securityNotice={[
        "Your new password must be at least 12 characters long",
        "Include uppercase, lowercase, numbers and special characters",
        "This reset link can only be used once",
      ].join("\n")}
      onSubmit={onResetPassword}
      showResetPassword={false}
    />
  );
};

export default ResetPassword;
