"use client";

import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { menuItems } from "@/lib/constants/constants";
import Logo from "@/assets/Logo";

export default function Header({ mobile, setIsMenuOpen }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
      <Logo size="md"/>        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.url}
              className="text-white hover:text-purple-300 transition-colors duration-300 text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        {mobile && (
          <Button
            icon={<MenuOutlined className="text-white" />}
            onClick={() => setIsMenuOpen((prevState) => !prevState)}
            type="text"
            className="md:hidden bg-transparent hover:bg-white/10 text-white"
          />
        )}
      </div>
    </header>
  );
}