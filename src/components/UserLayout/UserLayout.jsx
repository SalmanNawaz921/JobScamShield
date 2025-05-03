// import { Drawer, Layout } from "antd";
// import SideBar from "@/components/Sidebar/Sidebar";
// import Navbar from "@/components/Navbar/Navbar";
// import { useUserContext } from "@/context/UserContext";
// import { useEffect, useState } from "react";
// import {
//   bgColor,
//   shadow,
//   borderRadius,
//   textColor,
// } from "@/app/theme/tailwind.theme";

// const { Header, Sider, Content, Footer } = Layout;

// export default function DashboardLayout({ children }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [mobile, setMobile] = useState(false);
//   const { userData, userCredits } = useUserContext();

//   useEffect(() => {
//     const handleResize = () => setMobile(window.innerWidth <= 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <Layout className={`min-h-screen`}>
//       {/* Sidebar */}
//       {!mobile && (
//         <Sider
//           width={300}
//           className={`${bgColor.gradient} ${shadow.card} sticky top-0 h-screen overflow-auto`}
//         >
//           <SideBar />
//         </Sider>
//       )}

//       {/* Mobile Drawer */}
//       {mobile && (
//         <Drawer
//           open={menuOpen}
//           placement="left"
//           width={280}
//           onClose={() => setMenuOpen(false)}
//           className={`${bgColor.form} ${textColor.primary}`}
//           closable={true}
//         >
//           <SideBar setMenuOpen={setMenuOpen} />
//         </Drawer>
//       )}

//       {/* Main layout */}
//       <Layout className={`flex flex-col `}>
//         <Header
//           className={`px-6 z-10 ${bgColor.gradient} ${textColor.primary}`}
//         >
//           <Navbar
//             mobile={mobile}
//             setIsMenuOpen={setMenuOpen}
//             userData={userData}
//             userCredits={userCredits}
//           />
//         </Header>

//         <Content className={` p-6 overflow-auto ${bgColor.button}`}>
//           <div className={` p-6`}>{children}</div>
//         </Content>

//         <Footer
//           className={`text-center ${bgColor.gradient} py-4 text-sm !text-white`}
//         >
//           © {new Date().getFullYear()} 語動. All Rights Reserved.
//         </Footer>
//       </Layout>
//     </Layout>
//   );
// }

import { Drawer, Layout } from "antd";
import SideBar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
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
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "#0B1120", color: "white" }}
    >
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
          <SideBar />
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
          bodyStyle={{ padding: 0, backgroundColor: "#111827", color: "white" }}
          styles={{ header: { backgroundColor: "#111827", color: "white" } }}
          className="!bg-[#111827]"
        >
          <SideBar setMenuOpen={setMenuOpen} />
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
            padding: "24px",
            overflow: "auto",
            backgroundColor: "#0B1120",
          }}
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
          © {new Date().getFullYear()} 語動. All Rights Reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}
