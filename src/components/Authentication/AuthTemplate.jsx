"use client";

import { ShieldCheck, LockKeyhole, AlertTriangle } from "lucide-react";
import Link from "next/link";
import ReusableForm from "../ReusableForm/ReusableForm";

export const AuthTemplate = ({
  title,
  description,
  formTitle,
  submitText,
  inputs,
  footerText,
  footerLinkText,
  footerLinkHref,
  securityNotice = "Always verify emails asking for personal information. JobScamShield will never ask for sensitive data via email.",
  showForgotPassword = true,
  showSSO = true,
  onSubmit,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      {/* Security Badge - Fixed in corner */}
      <div className="fixed bottom-4 right-4 flex items-center space-x-1 text-green-400 text-sm">
        <ShieldCheck className="h-4 w-4" />
        <span>Secure Connection</span>
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header with logo placeholder */}
        <div className="text-center">
          <div className="mx-auto flex justify-center">
            <div className="bg-purple-600 p-3 rounded-lg shadow-lg">
              <LockKeyhole className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-gray-300">{description}</p>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-100">{securityNotice}</p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 border border-gray-700 rounded-xl shadow-2xl">
          <ReusableForm 
            inputs={inputs} 
            formTitle={formTitle}
            submitText={submitText}
            showLabel={false} 
            formType="authentication"
            onSubmit={onSubmit} // Pass the onSubmit function to ReusableForm
          />
          
          <div className="mt-4 text-center space-y-3">
            {showForgotPassword && (
              <Link 
                href="/forgot-password" 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-block"
              >
                Forgot credentials?
              </Link>
            )}
            <p className="text-xs text-gray-400 mt-4">
              {footerText}{' '}
              <Link 
                href={footerLinkHref} 
                className="font-medium text-purple-400 hover:text-purple-300"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>

        {/* Secure Auth Divider */}
        {showSSO && (
          <>
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Secure authentication
                </span>
              </div>
            </div>

            {/* Alternative Auth */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-600 rounded-md bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 transition-colors"
              >
                <ShieldCheck className="h-4 w-4 mr-2 text-green-400" />
                Enterprise SSO
              </button>
              <p className="text-xs text-center text-gray-400">
                Two-factor authentication recommended for all accounts
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};