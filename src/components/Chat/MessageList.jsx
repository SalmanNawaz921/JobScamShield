import React, { useState, useEffect, useRef } from "react";
import { List, Typography, Spin } from "antd";
import Message from "./Message";
import ReusableModal from "../ReusableModal/ReusableModal";
import Logo from "@/assets/Logo";
const { Text } = Typography;

const MessageList = ({
  loading,
  messages,
  handleDelete,
  handleSubmitEdit,
  isBotResponding,
}) => {
  const containerRef = useRef(null);

  // Format date for grouping
  const formatDate = (timestamp) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group messages by date
  const groupedMessages = messages?.reduce((acc, msg) => {
    const date = formatDate(msg?.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages || messages.length === 0) {
    console.log("No messages found.");
    return <Logo />;
  }

  return (
    <div
      ref={containerRef}
      style={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "24px" }}>
          <Spin size="large" />
        </div>
      ) : Object.keys(groupedMessages).length > 0 ? (
        Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
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
            <List
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item key={msg.id || msg.createdAt?.getTime()}>
                  <Message
                    message={msg}
                    isSender={msg.sender === "user"}
                    sender={msg.sender}
                    onEdit={handleSubmitEdit}
                    onDelete={handleDelete}
                    isBotResponding={isBotResponding}
                  />
                </List.Item>
              )}
              style={{
                marginBottom: "8px",
                padding: "0 8px",
                wordWrap: "break-word",
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
          No messages in this chat yet.
        </p>
      )}
    </div>
  );
};

export default MessageList;
