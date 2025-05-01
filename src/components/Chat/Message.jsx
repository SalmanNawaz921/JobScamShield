import React from "react";
import { Avatar, Card, Button, Dropdown, Menu, Typography } from "antd";
import { EditOutlined, MoreOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Message = ({ message, isSender, onEdit, onDelete, currentUserId }) => {
  const menu = (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => onEdit(message)}
        icon={<EditOutlined />}
      >
        Edit
      </Menu.Item>

      <Menu.Item
        key="delete"
        onClick={() => onDelete(message._id)}
        danger
        icon={<DeleteOutlined />}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isSender ? "row-reverse" : "row",
        padding: "12px 8px",
        alignItems: "flex-start",
        gap: "8px",
        width: "100%",
      }}
    >
      {/* Avatar for Receiver */}
      <Avatar
        size={40}
        src={message.userId?.avatar?.url}
        style={{
          display: isSender ? "none" : "inline-block",
          border: "2px solid #ddd",
        }}
      />

      {/* Message Content */}
      <Card
        bordered={false}
        style={{
          background: isSender ? "#e6f7ff" : "#ffffff",
          color: "#333",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
          borderRadius: "12px",
        }}
      >
        <div>
          {/* Sender Name */}
          {!isSender && (
            <Text
              strong
              style={{
                fontSize: "14px",
                marginBottom: "4px",
                display: "block",
              }}
            >
              {message.userId?.name || "Unknown User"}
            </Text>
          )}

          {/* Message Text */}
          <Text
            style={{
              fontSize: "14px",
              display: "block",
              marginBottom: "4px",
              textAlign: `${isSender ? "right" : "left"}`,
              marginRight: `${isSender ? "8px" : "0"}`,
            }}
          >
            {message.text}
          </Text>

          {/* Attachments */}
          {/* {message.attachments?.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              {message.attachments.map((file, idx) => (
                <a
                  href={file.url}
                  download={file.name}
                  key={idx}
                  style={{
                    display: "block",
                    color: "#1890ff",
                    textDecoration: "underline",
                    marginBottom: "4px",
                  }}
                >
                  📎 {file.name}
                </a>
              ))}
            </div>
          )} */}
          {message.attachments?.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              {message.attachments.map((file, idx) => {
                // Generate a Cloudinary download URL with proper filename
                const downloadUrl = `${file.url}?fl_attachment=${
                  file.name || "attachment"
                }`;

                return (
                  <a
                    href={downloadUrl}
                    download={file.name} // Suggests a name for the downloaded file
                    key={idx}
                    style={{
                      display: "block",
                      color: "#1890ff",
                      textDecoration: "underline",
                      marginBottom: "4px",
                    }}
                  >
                    📎 {file.name || "Attachment"}
                  </a>
                );
              })}
            </div>
          )}

          {/* Timestamp */}
          <Text
            type="secondary"
            style={{
              fontSize: "12px",
              display: "block",
              textAlign: "right",
              marginTop: "8px",
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </div>

        {/* Vertical Three Dots Menu */}
        {isSender && (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              type="text"
              icon={<MoreOutlined />}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                cursor: "pointer",
              }}
            />
          </Dropdown>
        )}
      </Card>
    </div>
  );
};

export default Message;
