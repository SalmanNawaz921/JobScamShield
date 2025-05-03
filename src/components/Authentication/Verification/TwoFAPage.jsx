// "use client";
// import React from "react";
// import { AuthTemplate } from "../AuthTemplate";
// import {
//   verifyEmailFormFields,
// } from "@/lib/constants/constants";
// import TwoFactorModal from "../../TwoFactorModal/TwoFactorModal";
// import { verify2faCode } from "@/services/authServices";

// const OtpPage = () => {
//   return (
//     <AuthTemplate
//       title="Secure JobScamShield Login"
//       description="Protect yourself from fraudulent job postings"
//       inputs={verifyEmailFormFields}
//       formTitle="Login"
//       submitText="Authenticate"
//       footerText="New to JobScamShield?"
//       footerLinkText="Activate protection"
//       footerLinkHref="/register"
//       onSubmit={verify2faCode}
//       ExtraComponent={TwoFactorModal}
//     />
//   );
// };

// export default OtpPage;

"use client";
import React, { useState, useEffect } from "react";
import QRCodeSection from "./QRCodeSection";
import OtpInput from "./OtpInput";
import { generate2faQrCode, verify2faCode } from "@/services/authServices";
import { message } from "antd";
import Logo from "@/assets/Logo";
import { useRouter } from "next/navigation";

const TwoFAPage = () => {
  const [qrImage, setQrImage] = useState("");
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const generateQr = async () => {
      const res = await generate2faQrCode();
      if (res) {
        setQrImage(res.qrCode);
        setSecret(res.secret);
      } else {
        console.error("Failed to generate QR Code");
      }
    };
    generateQr();
  }, []);

  const handleOtpSubmit = async (value) => {
    setOtp(value);
    if (value.length === 6) {
      const response = await verify2faCode(secret, value);
      if (response?.verified) {
        message.success("2FA Enabled successfully!");
        router.push("/login")
        setInvalidOtp(false);
      } else {
        setInvalidOtp(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Logo/>
      <h1 className="text-2xl font-semibold mb-6">Secure your account</h1>
      <div className="flex flex-col gap-10 items-center justify-center w-full max-w-3xl">
        <QRCodeSection qrImage={qrImage} secret={secret} />
        <OtpInput value={otp} onChange={handleOtpSubmit} error={invalidOtp} />
      </div>
    </div>
  );
};

export default TwoFAPage;
