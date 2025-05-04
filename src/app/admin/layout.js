// app/user/layout.js
"use client";

import DashboardLayout from "@/components/AdminLayout/AdminLayout";

export default function Admin({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
