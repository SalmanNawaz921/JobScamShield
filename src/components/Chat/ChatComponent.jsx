import { useState } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useMessage } from "@/hooks/useMessages";

const ChatComponent = ({ chatId }) => {
  const [messageText, setMessageText] = useState("");

  const {
    messages,
    loading,
    createMessage,
    setMessages,
    editMessage,
    deleteMessage,
  } = useMessage({ chatId });
  return (
    <>
      <MessageList
        messages={messages}
        loading={loading}
        handleDelete={deleteMessage}
        handleSubmitEdit={editMessage}
      />
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        handleSendMessage={() =>
          createMessage({
            chatId,
            sender: "user",
            content: messageText,
            createdAt: new Date(),
          })
        }
      />
    </>
  );
};

export default ChatComponent;
