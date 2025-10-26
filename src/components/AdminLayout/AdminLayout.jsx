import { Drawer, Layout } from "antd";
import SideBar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
const { Header, Sider, Content, Footer } = Layout;
import FooterComponent from "../Footer/Footer"; // ✅ Correct default import
import AdminSidebar from "../Admin/AdminSidebar";
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
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "#0B1120", color: "white" }}
    >
      {console.log("Deployment")}
      {/* Sidebar */}
      {!mobile && (
        <Sider
          width={280}
          style={{
            backgroundColor: "#111827",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            height: "100vh",
            overflow: "auto", // scroll inside sidebar
            position: "sticky",
            top: 0,
          }}
        >
          <AdminSidebar />
        </Sider>
      )}

      {/* Mobile Drawer */}
      {mobile && (
        <Drawer
          open={menuOpen}
          placement="left"
          width={260}
          onClose={() => setMenuOpen(false)}
          closable
          closeIcon={
            <CloseOutlined style={{ color: "white", fontSize: "18px" }} />
          }
          styles={{
            header: { backgroundColor: "#111827", color: "white" },
            body: { padding: 0, backgroundColor: "#111827", color: "white" },
          }}
          className="!bg-[#111827]"
        >
          <AdminSidebar setMenuOpen={setMenuOpen} />
        </Drawer>
      )}

      {/* Main layout */}
      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0B1120",
        }}
      >
        <Header
          style={{
            padding: "0 24px",
            zIndex: 10,
            backgroundColor: "#0B1120",
          }}
        >
          <Navbar
            mobile={mobile}
            setIsMenuOpen={setMenuOpen}
            userData={userData}
            userCredits={userCredits}
          />
        </Header>

        <Content
          style={{
            backgroundColor: "#0B1120",
          }}
          className="md:p-16 py-6"
        >
          <div
            style={{
              padding: "24px",
              borderRadius: "12px",
            }}
          >
            {children}
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#0B1120",
            padding: "16px 0",
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <FooterComponent />
        </Footer>
      </Layout>
    </Layout>
  );
}
