import { Divider, Modal } from "antd";
import SettingsSidebar from "./SettingsSidebar";
import { useState } from "react";
import "./settings.css";
import { Cross } from "lucide-react";
import SecuritySettings from "./sections/SecuritySettings";
import GeneralSettings from "./sections/GeneralSettings";
const Settings = ({ openSettings, setOpenSettings }) => {
  const [selectedTab, setSelectedTab] = useState("General");

  const renderContent = () => {
    switch (selectedTab) {
      case "General":
        return <GeneralSettings />;
      case "Security":
        return <SecuritySettings />;
      default:
        return <div>Select a setting</div>;
    }
  };

  return (
    <Modal
      open={openSettings}
      onCancel={() => setOpenSettings(false)}
      footer={null}
      width={800}
      className="custom-settings-modal"
      closeIcon={
        <span className="text-white">
          <Cross size={16} />
        </span>
      }
    >
      <div className="p-2">
        <h1 className="text-xl font-bold"> Settings</h1>
      </div>
      <Divider className="bg-gray-300 opacity-[10%]" />
      <div className="modal-content-wrapper">
        <SettingsSidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <div className="modal-main-content">{renderContent()}</div>
      </div>
    </Modal>
  );
};

export default Settings;
