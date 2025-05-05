import { Menu } from "antd";
import { SettingOutlined, LockOutlined } from "@ant-design/icons";

const SettingsSidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <div
      style={{
        width: 200,
        background: "#1e1e1e",
        color: "#fff",
        height: "100%",
      }}
    >
      <Menu
        theme="dark" // Enables built-in dark styling
        mode="vertical"
        selectedKeys={[selectedTab]}
        onClick={({ key }) => setSelectedTab(key)}
        style={{
          height: "100%",
          borderRight: 0,
          background: "#111827",
        }}
        items={[
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
        ]}
      />
    </div>
  );
};

export default SettingsSidebar;
