// app/user/layout.js
"use client";

import DashboardLayout from "@/components/UserLayout/UserLayout";

export default function UserLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
