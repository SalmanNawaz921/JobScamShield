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

const { Text } = Typography;
const { TextArea } = Input;

// Separate component for action buttons
const MessageActions = ({ onEdit, onCopy, onDelete, isSender }) => {
  const colors = {
    senderBg: "#1890ff",
    senderText: "#ffffff",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: -8,
        right: isSender ? "unset" : 8,
        left: isSender ? 8 : "unset",
        display: "flex",
        gap: 4,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "4px 6px",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        zIndex: 1,
      }}
    >
      <Tooltip 
        title="Edit" 
        overlayStyle={{ 
          backdropFilter: "blur(5px)",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white"
        }}
      >
        <Button
          type="text"
          icon={<EditOutlined style={{ fontSize: 14 }} />}
          onClick={onEdit}
          size="small"
        />
      </Tooltip>
      <Tooltip 
        title="Copy"
        overlayStyle={{ 
          backdropFilter: "blur(5px)",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white"
        }}
      >
        <Button
          type="text"
          icon={<CopyOutlined style={{ fontSize: 14 }} />}
          onClick={onCopy}
          size="small"
        />
      </Tooltip>
      <Tooltip 
        title="Delete"
        overlayStyle={{ 
          backdropFilter: "blur(5px)",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white"
        }}
      >
        <Button
          type="text"
          icon={<DeleteOutlined style={{ fontSize: 14 }} />}
          onClick={onDelete}
          size="small"
        />
      </Tooltip>
    </div>
  );
};

const Message = ({ message, isSender, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
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
    setEditedContent(message.content);
    setEditing(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Message",
      content: "Are you sure you want to delete this message?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => onDelete(message._id),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
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
      {/* Avatar for Receiver */}
      {!isSender && (
        <Avatar
          size={36}
          src={message.userId?.avatar?.url}
          style={{
            border: "1px solid #f0f0f0",
            backgroundColor: "#f5f5f5",
            flexShrink: 0,
          }}
        />
      )}

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
          />
        )}

        {/* Message Bubble */}
        <div
          style={{
            background: isSender ? colors.senderBg : colors.receiverBg,
            color: isSender ? colors.senderText : colors.receiverText,
            borderRadius: isSender
              ? "18px 4px 18px 18px"
              : "4px 18px 18px 18px",
            boxShadow: colors.cardShadow,
            padding: "12px 16px",
            wordBreak: "break-word",
            display: "inline-block",
            border: editing ? `2px solid ${colors.editBorder}` : "none",
          }}
        >
          {/* Sender Name */}
          {!isSender && (
            <Text
              strong
              style={{
                fontSize: "13px",
                marginBottom: "4px",
                display: "block",
                color: colors.receiverText,
              }}
            >
              {message.userId?.name || "Unknown User"}
            </Text>
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
                  marginBottom: message.attachments?.length ? "8px" : "0",
                  color: isSender ? colors.senderText : colors.receiverText,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {message.content}
              </Text>

              {/* Attachments */}
              {message.attachments?.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  {message.attachments.map((file, idx) => (
                    <a
                      href={`${file.url}?fl_attachment=${
                        file.name || "attachment"
                      }`}
                      download={file.name}
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: isSender ? "#e6f7ff" : "#1890ff",
                        textDecoration: "none",
                        marginBottom: "4px",
                        padding: "4px 8px",
                        backgroundColor: isSender
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(24, 144, 255, 0.1)",
                        borderRadius: "4px",
                      }}
                    >
                      <span>📎</span>
                      <span>{file.name || "Attachment"}</span>
                    </a>
                  ))}
                </div>
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
            {new Date(message.createdAt).toLocaleTimeString([], {
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