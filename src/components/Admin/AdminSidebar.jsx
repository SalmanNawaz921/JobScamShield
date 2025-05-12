"use client";

import { useUserContext } from "@/context/UserContext";
import { Menu } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/assets/Logo";
import Link from "next/link";

const AdminMenuItems = [
  {
    label: "Dashboard",
    key: "/admin",
  },
  {
    label: "Users",
    key: "/admin/users",
  },
];

const AdminSidebar = () => {
  const { userData: user } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 backdrop-blur shadow-lg">
      {/* Header */}
      <div className="py-8 mt-4">
        <Link href="/">
          <Logo size="lg" />
        </Link>
      </div>

      {/* Navigation Menu */}
      <Menu
        items={AdminMenuItems}
        selectedKeys={[pathname]}
        onClick={({ key }) => router.push(key)}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          backgroundColor: "transparent",
        }}
        theme="dark"
        mode="inline"
        className="custom-sidebar-menu"
      />

      {/* Footer - User Info */}
      <div className="mt-auto px-6 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-white font-medium">{user?.username}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
