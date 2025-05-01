"use client";

import VerifyEmail from "@/components/Authentication/VerifyEmail";

export default function VerifyEmailPage({searchParams}) {
  const token = searchParams?.token;

  return (
    <div className="flex flex-col min-h-screen">
      <VerifyEmail token={token} />
    </div>
  );
}
