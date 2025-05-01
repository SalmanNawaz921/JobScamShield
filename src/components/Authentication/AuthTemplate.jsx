"use client";

import { ShieldCheck, LockKeyhole, AlertTriangle } from "lucide-react";
import Link from "next/link";
import ReusableForm from "../ReusableForm/ReusableForm";
import {
  textColor,
  bgColor,
  borderColor,
  layout,
  spacing,
  borderRadius,
  shadow,
  font,
  textSize,
  flex,
} from "@/app/theme/tailwind.theme";

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
    <div
      className={`${layout.container} ${bgColor.gradient} ${spacing.section}`}
    >
      {/* Secure Badge */}
      <div className={`${layout.fixedBadge} ${textColor.secure}`}>
        <ShieldCheck className="h-4 w-4" />
        <span>Secure Connection</span>
      </div>

      <div className={layout.card}>
        {/* Header */}
        <div className="text-center">
          <div className={flex.center}>
            <div
              className={`${bgColor.badge} ${spacing.p3} ${borderRadius.lg} ${shadow.badge}`}
            >
              <LockKeyhole className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2
            className={`${spacing.mt6} ${textSize.xl} ${font.bold} ${textColor.primary}`}
          >
            {title}
          </h2>
          <p className={`${spacing.mt2} ${textSize.sm} ${textColor.secondary}`}>
            {description}
          </p>
        </div>

        {/* Security Notice */}
        <div
          className={`${bgColor.warning} ${borderColor.warning} ${borderRadius.lg} ${spacing.p3} flex items-start`}
        >
          <AlertTriangle
            className={`h-5 w-5 ${textColor.alert} mr-2 mt-0.5 flex-shrink-0`}
          />
          <p className={`${textSize.xs} ${textColor.notice}`}>
            {securityNotice}
          </p>
        </div>

        {/* Form Container */}
        <div
          className={`${bgColor.form} ${borderColor.form} ${spacing.p8} ${borderRadius.xl} ${shadow.card}`}
        >
          <ReusableForm
            inputs={inputs}
            formTitle={formTitle}
            submitText={submitText}
            showLabel={false}
            formType="authentication"
            onSubmit={onSubmit}
          />

          <div className="mt-4 text-center space-y-3">
            {showForgotPassword && (
              <Link href="/forgot-password" className={textColor.link}>
                Forgot credentials?
              </Link>
            )}
            <p className={`${textSize.xs} ${textColor.footer} mt-4`}>
              {footerText}{" "}
              <Link
                href={footerLinkHref}
                className={`${font.medium} ${textColor.link}`}
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>

        {/* Divider and SSO */}
        {showSSO && (
          <>
            <div className={`${spacing.mt8} relative`}>
              <div className="absolute inset-0 flex items-center">
                <div className={`${borderColor.divider} w-full`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Secure authentication
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className={`w-full flex items-center justify-center py-2.5 px-4 ${borderColor.form} ${borderRadius.md} ${bgColor.button} ${textSize.sm} ${font.medium} ${textColor.primary}`}
              >
                <ShieldCheck className={`h-4 w-4 mr-2 ${textColor.secure}`} />
                Enterprise SSO
              </button>
              <p className={`${textSize.xs} text-center ${textColor.footer}`}>
                Two-factor authentication recommended for all accounts
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
