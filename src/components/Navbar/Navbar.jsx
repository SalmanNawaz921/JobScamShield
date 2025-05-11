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
import Settings from "../Settings/Settings";
import { useState } from "react";
import "./Navbar.css"; // Import your CSS file for custom styles

export default function Navbar({ mobile, setIsMenuOpen, userData }) {
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();
  const items = [
    {
      key: "4",
      label: `Name: ${userData?.firstName} ${userData?.lastName}`,
    },
    { type: "divider" },
    {
      key: "1",
      label: "Profile",
      extra: "⌘P",
      icon: <UserOutlined />,
      onClick: () => {
        router.push(`/user/${userData?.username}`);
      },
    },
    {
      key: "2",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => {
        setOpenSettings(true);
      },
      extra: "⌘S",
    },
    { type: "divider" },
    {
      key: "3",
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
        <button
          onClick={() => setIsMenuOpen((prevState) => !prevState)}
          className="flex items-center justify-center h-10 w-10 flex-shrink-0 backdrop-blur-lg bg-[#171d2b]/50 border border-white/20 text-white rounded-xl shadow-lg hover:bg-[#171d2b]/70 transition duration-300 cursor-pointer"
        >
          <MenuOutlined className="text-xl" />
        </button>
      )}

      {/* Profile Button - Right */}
      <div className="ml-auto">
        {/* <Dropdown menu={{ items }}>
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
              {userData?.username || "Guest"}
            </span>
          </Button>
        </Dropdown> */}
        <Dropdown
          overlayClassName="glass-dropdown"
          menu={{
            items,
            className: "glass-menu",
          }}
        >
          <Button
            type="text"
            className="flex items-center px-4 py-2 bg-[#9333EA] text-white rounded-full shadow-md border-2 border-white transition-all duration-300 ease-in-out hover:bg-[#8a2be2] hover:shadow-lg"
          >
            <Avatar
              size="large"
              icon={<UserOutlined className="text-white text-lg" />}
              style={{
                backgroundColor: "#111827",
                marginRight: "8px",
                border: "2px solid #ffffff",
              }}
            />
          </Button>
        </Dropdown>
      </div>
      {openSettings && (
        <Settings
          openSettings={openSettings}
          setOpenSettings={setOpenSettings}
        />
      )}
    </div>
  );
}
