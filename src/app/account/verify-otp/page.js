"use client";
import { AuthTemplate } from "@/components/Authentication/AuthTemplate";
import OtpPage from "@/components/Authentication/Verification/TwoFAPage";
import { useUserContext } from "@/context/UserContext";
import { verifyEmailFormFields } from "@/lib/constants/constants";
import { verify2faLoginCode } from "@/services/authServices";
import { message } from "antd";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const { userData, setUserData } = useUserContext();
  const router = useRouter();
  const handelVerifyOTP = async (values) => {
    const { verificationCode } = values;
    const code = verificationCode;
    const response = await verify2faLoginCode(userData?.id, code);
    if (response?.verified) {
      console.log("OTP verified successfully!", response);
      const user = response?.user;
      if (user) {
        message.success("OTP verified successfully!");
        setUserData(user);
        if (user?.role === "admin") {
          router.push("/admin");
          return;
        }
        router.push(`/user/${userData.username}/dashboard`);
      }
    } else {
      message.error("Invalid OTP. Please try again.");
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <AuthTemplate
        title="Secure your account"
        description="Enter the code from your authenticator app"
        formTitle=""
        inputs={verifyEmailFormFields}
        submitText="Continue"
        footerText=""
        footerLinkText=""
        footerLinkHref=""
        customForm={<OtpPage />} // If your AuthTemplate supports custom form injection
        onSubmit={handelVerifyOTP} // Handle form submission
      />
    </div>
  );
}
