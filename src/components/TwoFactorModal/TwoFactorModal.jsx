"use client";
import React, { useState, useEffect } from "react";
import { generate2faQrCode, verify2faCode } from "@/services/authServices";
import { message } from "antd";


const TwoFactorModal = () => {
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);

  const [qrImage, setQrImage] = useState();
  const [secret, setSecret] = useState();

  useEffect(() => {
    const generate2faQR = async () => {
      const qrCodeData = await generate2faQrCode();
      if (qrCodeData) {
        setQrImage(qrCodeData.qrCode);
        setSecret(qrCodeData.secret); // Store the secret for later use
      } else {
        console.error("Failed to generate 2FA QR code.");
      }
    };
    generate2faQR();
  }, []);

  /* Validate Code  */
  const handleOtpChange = async (e) => {
    setOtp(e.target.value);

    if (e.target.value.length === 6) {
      const token = e.target.value;
      const response = await verify2faCode(secret, token); // Use the secret stored in state
      if (response.data.verified) {
        message.success("2FA Enabled successfully!");
        setInvalidOtp(false);
        // 2FA Enabled successfully
      } else {
        setInvalidOtp(true);
      }
    }
  };

  return (
    <div className="flex justify-end w-full">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-1 justify-center items-center p-4 text-white rounded-md">
            {qrImage && (
              <img
                src={qrImage}
                alt="2FA QR Code"
                className="rounded-lg border-2"
              />
            )}
          </div>

          <div className="flex-1 p-4 text-white rounded-md">
            <p className="text-2xl text-gray-700 font-bold mb-4">
              Use an Authenticator App to enable 2FA
            </p>
            <ul className="list-none list-inside mb-4 text-gray-700">
              <li className="mb-2">
                <span className="font-bold">Step 1:</span> Scan the QR Code with
                your Authenticator app.
              </li>
              <li className="mb-2">
                <span className="font-bold">Step 2:</span> Enter the code below
                from your app.
              </li>
            </ul>

            {/* OTP Input */}
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Invalid Input */}
            {
              <p className="mt-3 text-red-500 text-sm text-center">
                {invalidOtp && "*Invalid Code"}
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
