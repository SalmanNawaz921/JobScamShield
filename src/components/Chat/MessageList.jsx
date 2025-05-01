import React, { useState, useEffect, useRef } from "react";
import { List, Typography } from "antd";
import Message from "./Message";
import ReusableModal from "../ReusableModal/ReusableModal";

const { Text } = Typography;

const MessageList = ({
  messages,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const containerRef = useRef(null); // Ref for the message list container

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString();
  };

  const groupedMessages = messages?.reduce((acc, msg) => {
    const date = formatDate(msg.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(msg);
    return acc;
  }, {});

  const handleEdit = (message) => {
    setCurrentMessage(message);
    setIsModalOpen(true);
  };

  const handleDelete = async (messageId) => {
    await onDeleteMessage(messageId);
  };

  const handleSubmitEdit = async (values) => {
    await onEditMessage(currentMessage?._id, values);
    setIsModalOpen(false);
    setCurrentMessage(null);
  };

  useEffect(() => {
    // Scroll to the bottom whenever the messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]); // Run effect when messages change

  return (
    <div
      ref={containerRef} // Attach the ref to the container
      style={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "16px",
        background: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      {Object.keys(groupedMessages).length > 0 ? (
        Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            {/* Date Header */}
            <div
              style={{
                textAlign: "center",
                margin: "16px 0",
                fontWeight: "bold",
                color: "#888",
                fontSize: "14px",
              }}
            >
              {date}
            </div>

            {/* Messages for the Date */}
            <List
              dataSource={messages}
              renderItem={(msg) => (
                <Message
                  message={msg}
                  isSender={msg.userId?._id === currentUserId}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  currentUserId={currentUserId}
                />
              )}
              style={{
                marginBottom: "8px",
                padding: "0 8px",
                wordWrap: "break-word", // Ensures long text breaks into new lines
              }}
            />
          </div>
        ))
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: "14px",
            padding: "8px",
          }}
        >
          No messages in this channel yet.
        </p>
      )}

      {/* Reusable Modal for Editing Messages */}
      {currentMessage && (
        <ReusableModal
          inputs={[
            {
              name: "text",
              label: "Message Text",
              type: "text",
              required: true,
              initialValue: currentMessage.text,
              placeholder: "Enter your message here",
            },
            currentMessage.attachments?.length >= 1 && {
              name: "attachments",
              label: "Attachments",
              type: "upload",
              initialValue: currentMessage.attachments,
              placeholder: "Upload Files",
              multiFiles: true,
            },
          ]}
          formTitle="Edit Message"
          buttonText="Save"
          onSubmit={handleSubmitEdit}
          setOpen={setIsModalOpen}
          open={isModalOpen}
        />
      )}
    </div>
  );
};

export default MessageList;
