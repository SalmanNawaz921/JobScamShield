import React from "react";
import { CopyOutlined } from "@ant-design/icons";
import { message } from "antd";

const QRCodeSection = ({ qrImage, secret }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    message.success("Secret copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center text-center">
      {qrImage && (
        <img src={qrImage} alt="QR Code" className="rounded-lg border-2 mb-4" />
      )}
      <p className="text-gray-300 font-medium mb-2">
        Scan the QR Code using your preferred authenticator app or copy the
        secret below and paste in your preferred authenticator app .
      </p>
      <div className="bg-gray-100 p-2 rounded-md flex items-center gap-2">
        <code className="text-sm text-gray-600">{secret}</code>
        <CopyOutlined
          className="!text-blue-500 cursor-pointer"
          onClick={handleCopy}
        />
      </div>
    </div>
  );
};

export default QRCodeSection;
