"use client";

import VerifyEmail from "@/components/Authentication/VerifyEmail";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="flex flex-col min-h-screen">
      <VerifyEmail token={token} />
    </div>
  );
}
