// import { Menu } from "antd";
// import { SettingOutlined, LockOutlined } from "@ant-design/icons";

// const SettingsSidebar = ({ selectedTab, setSelectedTab }) => {
//   return (
//     <div
//       className="w-full md:w-[200px] bg-[#1e1e1e] text-white mx-auto"
//     >
//       <Menu
//         theme="dark"
//         mode="horizontal" // default to horizontal
//         className="block md:hidden" // ✅ now shows only on small screens
//         selectedKeys={[selectedTab]}
//         onClick={({ key }) => setSelectedTab(key)}
//         items={[
//           {
//             key: "General",
//             icon: <SettingOutlined style={{ color: "white" }} />,
//             label: <span style={{ color: "white" }}>General</span>,
//           },
//           {
//             key: "Security",
//             icon: <LockOutlined style={{ color: "white" }} />,
//             label: <span style={{ color: "white" }}>Security</span>,
//           },
//         ]}
//       />

//       <Menu
//         theme="dark"
//         mode="vertical"
//         className="hidden md:block h-full"
//         selectedKeys={[selectedTab]}
//         onClick={({ key }) => setSelectedTab(key)}
//         style={{ background: "#111827" }}
//         items={[
//           {
//             key: "General",
//             icon: <SettingOutlined style={{ color: "white" }} />,
//             label: <span style={{ color: "white" }}>General</span>,
//           },
//           {
//             key: "Security",
//             icon: <LockOutlined style={{ color: "white" }} />,
//             label: <span style={{ color: "white" }}>Security</span>,
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default SettingsSidebar;

import { Menu } from "antd";
import { SettingOutlined, LockOutlined } from "@ant-design/icons";

const SettingsSidebar = ({ selectedTab, setSelectedTab }) => {
  const items = [
    {
      key: "General",
      icon: <SettingOutlined style={{ color: "white" }} />,
      label: <span style={{ color: "white" }}>General</span>,
    },
    {
      key: "Security",
      icon: <LockOutlined style={{ color: "white" }} />,
      label: <span style={{ color: "white" }}>Security</span>,
    },
  ];

  return (
    <div className="w-full md:w-[200px] bg-[#1e1e1e] text-white">
      {/* Mobile: Horizontal Menu */}
      <div className="block md:hidden">
        <Menu
          theme="dark"
          mode="horizontal"
          className="block md:hidden"
          selectedKeys={[selectedTab]}
          onClick={({ key }) => setSelectedTab(key)}
          items={items}
        />
      </div>

      {/* Desktop: Vertical Menu */}
      <Menu
        theme="dark"
        mode="vertical"
        className="hidden md:block h-full"
        selectedKeys={[selectedTab]}
        onClick={({ key }) => setSelectedTab(key)}
        style={{ background: "#111827", borderRight: 0 }}
        items={items}
      />
    </div>
  );
};

export default SettingsSidebar;
