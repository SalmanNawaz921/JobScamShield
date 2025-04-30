"use client";
import { signInFormFields } from "@/lib/constants/constants";
import { AuthTemplate } from "./AuthTemplate";

const Login = () => {
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
    />
  );
};

export default Login;