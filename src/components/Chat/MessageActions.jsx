import { Button, Tooltip, message as antdMessage } from "antd";
import { EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
// Separate component for action buttons
const MessageActions = ({ onEdit, onCopy, onDelete, isSender, sender }) => {
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
      {sender === "user" && (
        <Tooltip
          title="Edit"
          styles={{
            root: {
              backdropFilter: "blur(5px)",
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
            },
          }}
        >
          <Button
            type="text"
            icon={<EditOutlined style={{ fontSize: 14 }} />}
            onClick={onEdit}
            size="small"
          />
        </Tooltip>
      )}
      <Tooltip
        title="Copy"
        styles={{
          root: {
            backdropFilter: "blur(5px)",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
          },
        }}
      >
        <Button
          type="text"
          icon={<CopyOutlined style={{ fontSize: 14 }} />}
          onClick={onCopy}
          size="small"
        />
      </Tooltip>
      {sender === "user" && (
        <Tooltip
          title="Delete"
          styles={{
            root: {
              backdropFilter: "blur(5px)",
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
            },
          }}
        >
          <Button
            type="text"
            icon={<DeleteOutlined style={{ fontSize: 14 }} />}
            onClick={onDelete}
            size="small"
          />
        </Tooltip>
      )}
    </div>
  );
};

export default MessageActions;
