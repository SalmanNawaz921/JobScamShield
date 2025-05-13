import { Divider, Modal } from "antd";
import SettingsSidebar from "./SettingsSidebar";
import { useState } from "react";
import "./settings.css";
import { CgClose } from "react-icons/cg";
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
          <CgClose size={16} />
        </span>
      }
    >
      <div className="p-2">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      <Divider className="bg-gray-300 opacity-[10%]" />

      <div className="modal-content-wrapper flex flex-col md:flex-row">
        <SettingsSidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isHorizontal={true} // pass this as a prop
        />
        <div className="modal-main-content flex-1 md:p-4 md:w-auto !w-full">{renderContent()}</div>
      </div>
    </Modal>
  );
};

export default Settings;
