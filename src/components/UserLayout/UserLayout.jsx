import { Drawer, Layout } from "antd";
import SideBar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import {
  bgColor,
  shadow,
  borderRadius,
  textColor,
} from "@/app/theme/tailwind.theme";

const { Header, Sider, Content, Footer } = Layout;

export default function DashboardLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { userData, userCredits } = useUserContext();

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout className={`${bgColor.gradient} min-h-screen`}>
      {/* Sidebar */}
      {!mobile && (
        <Sider
          width={300}
          className={`${bgColor.form} ${shadow.card} sticky top-0 h-screen overflow-auto`}
        >
          <SideBar />
        </Sider>
      )}

      {/* Mobile Drawer */}
      {mobile && (
        <Drawer
          open={menuOpen}
          placement="left"
          width={280}
          onClose={() => setMenuOpen(false)}
          className={`${bgColor.form} ${textColor.primary}`}
          closable={true}
        >
          <SideBar setMenuOpen={setMenuOpen} />
        </Drawer>
      )}

      {/* Main layout */}
      <Layout className={`flex flex-col ${bgColor.gradient}`}>
        <Header className={`px-6 z-10  ${shadow.card}`}>
          <Navbar
            mobile={mobile}
            setIsMenuOpen={setMenuOpen}
            userData={userData}
            userCredits={userCredits}
          />
        </Header>

        <Content className="flex-1 p-6 overflow-auto">
          <div
            className={`${bgColor.gradient} ${borderRadius.xl} ${shadow.card} p-6`}
          >
            {children}
          </div>
        </Content>

        <Footer
          className={`text-center ${bgColor.gradient} py-4 text-sm text-white shadow-inner`}
        >
          © {new Date().getFullYear()} 語動. All Rights Reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}
