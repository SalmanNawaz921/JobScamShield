import { Input } from "antd";
import React from "react";

const OtpInput = ({ value, onChange, error }) => {
  return (
    <div className="w-full">
      <label className="text-lg font-medium text-gray-300 mb-2 block">
        Enter the 6-digit code
      </label>
      <input
        type="text"
        maxLength="6"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="123456"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest placeholder:text-gray-400"
      />
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">*Invalid Code</p>
      )}
    </div>
  );
};

export default OtpInput;
