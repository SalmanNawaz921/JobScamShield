import React from "react";
import { AuthTemplate } from "./AuthTemplate";
import { signInFormFields } from "@/lib/constants/constants";

const OtpPage = () => {
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

export default OtpPage;
