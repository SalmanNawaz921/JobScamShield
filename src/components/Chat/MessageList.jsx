import React, { useEffect, useRef } from "react";
import { List } from "antd";
import Message from "./Message";
import Logo from "@/assets/Logo";

const MessageList = ({
  messages,
  handleDelete,
  handleSubmitEdit,
  isBotResponding,
}) => {
  const containerRef = useRef(null);

  const formatDate = (timestamp) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Flatten user + bot responses into one sorted list
  const flatMessages = messages
    ?.flatMap((msg) => {
      const baseMsg = {
        ...msg,
        createdAt: msg.createdAt,
      };
      const responses = msg.botResponses
        ? msg.botResponses.map((res) => ({
            ...res,
            createdAt: res.createdAt,
          }))
        : [];
      return [baseMsg, ...responses];
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Group messages by date
  const groupedMessages = flatMessages?.reduce((acc, msg) => {
    const date = formatDate(msg?.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  // Auto-scroll
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: "8px",
        width: "100%",
      }}
    >
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <div key={date} className="px-4  w-full">
          <div
            style={{
              textAlign: "center",
              margin: "16px 0",
              fontWeight: "bold",
              color: "#aaa",
              fontSize: "14px",
              
            }}
          >
            {date}
          </div>

          <List
            dataSource={messages}
            renderItem={(msg) => (
              <Message
                key={msg.id || msg.createdAt}
                message={msg}
                isSender={msg.sender === "user"}
                onEdit={handleSubmitEdit}
                onDelete={handleDelete}
                isBotResponding={isBotResponding}
              />
            )}
          />
        </div>
      ))}
        <div ref={endOfMessagesRef} />

    </div>
  );
};

export default MessageList;
