"use client";
import { Avatar, Button, Dropdown, message } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/services/authServices";

export default function Navbar({ mobile, setIsMenuOpen, userData }) {
  const router = useRouter();
  const items = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      extra: "⌘P",
    },
    {
      key: "3",
      label: "Billing",
      extra: "⌘B",
    },
    {
      key: "4",
      label: "Settings",
      icon: <SettingOutlined />,
      extra: "⌘S",
    },
    {
      key: "5",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: async () => {
        const resp = await handleLogout();
        if (resp) {
          router.push("/login");
          message.success("Logged out successfully!");
        }
      },
      extra: "⌘S",
    },
  ];
  return (
    <div className="flex items-center px-4 py-2 w-full">
      {/* Burger Menu Button - Mobile */}
      {mobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => setIsMenuOpen((prevState) => !prevState)}
          className="flex-shrink-0 bg-purple-600 text-white rounded-lg shadow-md"
        />
      )}

      {/* Profile Button - Right */}
      <div className="ml-auto">
        <Dropdown menu={{ items }}>
          <Button
            type="text"
            className="flex items-center px-4 py-2 bg-[#9333EA] text-white rounded-full shadow-md border-2 border-white transition-all duration-300 ease-in-out"
          >
            <Avatar
              size="large"
              icon={<UserOutlined className="text-white text-lg" />}
              style={{
                backgroundColor: "#9333EA",
                marginRight: "8px",
                border: "2px solid #ffffff",
              }}
            />
            <span className="text-lg text-white">
              {userData?.name || "Guest"}
            </span>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
