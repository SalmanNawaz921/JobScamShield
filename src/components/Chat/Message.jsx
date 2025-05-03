import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Button,
  Typography,
  Input,
  Modal,
  Tooltip,
  message as antdMessage,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import BotResponse from "../BotResponse/BotResponse";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import MessageActions from "./MessageActions";

const { Text } = Typography;
const { TextArea } = Input;

const glassStyles = {
  common: {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    padding: "14px 18px",
    wordBreak: "break-word",
    display: "inline-block",
    transition: "all 0.3s ease",
    backdropClip: "padding-box",
  },
  sender: {
    background: "rgba(24, 144, 255, 0.15)",
    color: "#ffffff",
    borderRadius: "18px 4px 18px 18px",
    border: "1px solid rgba(24, 144, 255, 0.4)",
  },
  receiver: {
    background: "rgba(255, 255, 255, 0.05)",
    color: "#e0e0e0",
    borderRadius: "4px 18px 18px 18px",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  editing: {
    border: "2px solid #52c41a",
  },
};

const Message = ({ message, isSender, onEdit, onDelete, isBotResponding }) => {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message?.content || "");
  const [hovering, setHovering] = useState(false);
  const textAreaRef = useRef(null);

  // Color scheme
  const colors = {
    senderBg: "#1890ff",
    receiverBg: "#ffffff",
    senderText: "#ffffff",
    receiverText: "#1e1e1e",
    timestamp: "#888888",
    editBorder: "#52c41a",
  };

  const handleEdit = () => setEditing(true);

  const handleSave = () => {
    onEdit({ ...message, content: editedContent });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(message?.content);
    setEditing(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Message",
      content: "Are you sure you want to delete this message?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => onDelete(message?.id),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message?.content);
    antdMessage.success("Message copied!");
  };

  useEffect(() => {
    if (editing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.resizableTextArea.textArea.setSelectionRange(
        editedContent.length,
        editedContent.length
      );
    }
  }, [editing]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isSender ? "row-reverse" : "row",
        padding: "8px 16px",
        alignItems: "flex-start",
        gap: "12px",
        marginLeft: isSender ? "auto" : "unset",
      }}
    >
      {/* Message Content */}
      <div
        style={{
          position: "relative",
          maxWidth: "75%",
          minWidth: "120px",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Hover Actions */}
        {hovering && !editing && isSender && (
          <MessageActions
            onEdit={handleEdit}
            onCopy={handleCopy}
            onDelete={handleDelete}
            isSender={isSender}
            sender={message?.sender}
          />
        )}

        {/* Message Bubble */}
        <div
          style={{
            ...glassStyles.common,
            ...(isSender ? glassStyles.sender : glassStyles.receiver),
            ...(editing ? glassStyles.editing : {}),
          }}
        >
          {isBotResponding && (
            <div>
              <TypingIndicator />
            </div>
          )}
          {/* Message Text or Edit Field */}
          {editing ? (
            <>
              <TextArea
                ref={textAreaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 6 }}
                style={{
                  background: "transparent",
                  color: isSender ? colors.senderText : colors.receiverText,
                  border: "none",
                  width: "100%",
                  padding: 0,
                  resize: "none",
                }}
              />
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: "14px",
                  display: "block",
                  color: isSender ? colors.senderText : colors.receiverText,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {message?.content}
              </Text>
              {message?.responseData && (
                <BotResponse
                  responseData={message?.responseData}
                  sender="bot"
                />
              )}
            </>
          )}
          {/* Timestamp */}
          <Text
            style={{
              fontSize: "11px",
              color: isSender ? "rgba(255,255,255,0.7)" : colors.timestamp,
              display: "block",
              textAlign: "right",
              marginTop: "4px",
            }}
          >
            {new Date(message?.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </div>

        {/* Edit Controls (outside bubble) */}
        {editing && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancelEdit}
              size="small"
            />
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSave}
              size="small"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
