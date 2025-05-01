import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { NotificationOutlined, PlusOutlined } from "@ant-design/icons";
import ReusableModal from "@/components/ReusableModal/ReusableModal";
import { addChat } from "@/services/chatServices";


const ChatMenu = ({ chats, handleSelectedChat, user, societyId, setChats }) => {
  const [openModal, setOpenModal] = useState(false);
  const [groupedChats, setGroupedChats] = useState({});

  // Group chats by type
  useEffect(() => {
    console.log(chats);
    const newGroupedChats = chats?.reduce((groups, chat) => {
      const { startedAt } = chat;
      if (!groups[startedAt]) {
        groups[startedAt] = [];
      }
      groups[startedAt].push(chat);
      return groups;
    }, {});
    setGroupedChats(newGroupedChats);
  }, [chats]);

  return (
    <div>
      <h1
        className="text-3xl font-semibold text-center lg:block hidden"
        style={{
          padding: "16px 0",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        Chats
      </h1>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline" // Vertical mode
        style={{ padding: "16px" }}
        items={
          groupedChats &&
          Object.keys(groupedChats).map((groupType) => {
            return {
              key: groupType,
              label: (
                <>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <NotificationOutlined style={{ marginRight: 8 }} />
                    <span>
                      {groupType?.[0].toUpperCase() + groupType.slice(1)}
                    </span>
                    <PlusOutlined
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the menu click event
                        setOpenModal(true);
                      }}
                      style={{ marginLeft: 8 }}
                    />
                  </span>
                </>
              ),
              children: groupedChats[groupType].map((chat) => ({
                key: chat.id,
                label: (
                  <>
                    <NotificationOutlined style={{ marginRight: 8 }} />
                    <span>{chat.messages[0].text}</span>
                  </>
                ),
              })),
            };
          })
        }
        onClick={(item) => handleSelectedChat(item)}
      />
      {console.log(chats)}
      {openModal && (
        <ReusableModal
          inputs={chatInputs}
          open={openModal}
          setOpen={setOpenModal}
          formTitle="Create Chat"
          buttonText="Create"
          onSubmit={addChat}
        />
      )}
    </div>
  );
};

export default ChatMenu;
