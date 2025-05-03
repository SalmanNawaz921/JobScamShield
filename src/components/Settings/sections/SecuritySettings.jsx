import TwoFactorModal from "@/components/TwoFactorModal/TwoFactorModal";
import { useUserContext } from "@/context/UserContext";
import { Button, Divider, Switch } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const securitySections = [
  {
    title: "Multi-factor authentication",
    description:
      "Require an extra security challenge when logging in. If you are unable to pass this challenge, you will have the option to recover your account via email.",
    button: {
      label: "Enable",
      type: "primary",
    },
  },
  //   {
  //     title: "Log out of all devices",
  //     description:
  //       "Log out of all active sessions across all devices, including your current session. It may take up to 30 minutes for other devices to be logged out.",
  //     button: {
  //       label: "Log out all",
  //       type: "default",
  //       danger: true,
  //     },
  //   },
];

const SecuritySettings = () => {
  const { userData } = useUserContext();
  const  router  = useRouter();
  const twoFAEnabled = userData?.twoFactorEnabled || false;
  const handletwoFAChange = () => {
    if (!twoFAEnabled) {
     router.push("/account/two-factor-authentication");
    }
  };
  return (
    <div>
      {securitySections.map((section, index) => (
        <div key={index} className="">
          <h3>{section.title}</h3>
          <p className="my-2">{section.description}</p>
          <Button
            type={section.button.type}
            danger={twoFAEnabled ? true : section.button.danger}
            onClick={handletwoFAChange}
          >
            {twoFAEnabled ? "Disable" : section.button.label}
          </Button>
          {/* <Switch onChange={() => setTwoFAEnabled((prevState) => !prevState)} /> */}
          {index !== securitySections.length - 1 && <Divider />}
        </div>
      ))}
      {/* {twoFAEnabled && <TwoFactorModal />} */}
    </div>
  );
};

export default SecuritySettings;
