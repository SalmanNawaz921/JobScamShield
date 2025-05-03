// import { useState } from "react";
// import MessageInput from "./MessageInput";
// import MessageList from "./MessageList";
// import { useMessage } from "@/hooks/useMessages";

// const ChatComponent = ({ chatId }) => {
//   const [messageText, setMessageText] = useState("");

//   const {
//     messages,
//     loading,
//     createMessage,
//     setMessages,
//     editMessage,
//     deleteMessage,
//   } = useMessage({ chatId });
//   return (
//     <>
//       <MessageList
//         messages={messages}
//         loading={loading}
//         handleDelete={deleteMessage}
//         handleSubmitEdit={editMessage}
//       />
//       <MessageInput
//         messageText={messageText}
//         setMessageText={setMessageText}
//         handleSendMessage={() =>
//           createMessage({
//             chatId,
//             sender: "user",
//             content: messageText,
//             createdAt: new Date(),
//           })
//         }
//       />
//     </>
//   );
// };

// export default ChatComponent;

// components/ChatComponent.jsx

import { useState } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { generateResponseData } from "@/lib/utils/jobScamDetector";
import { useMessage } from "@/hooks/useMessages";
import { getPrediction } from "@/services/modalService";

const ChatComponent = ({ chatId }) => {
  const [messageText, setMessageText] = useState("");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [currentJobText, setCurrentJobText] = useState("");

  const {
    messages,
    loading,
    createMessage,
    setMessages,
    editMessage,
    deleteMessage,
  } = useMessage({ chatId });

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      sender: "user",
      content: messageText,
      createdAt: new Date(),
    };

    await createMessage({
      chatId,
      ...userMessage,
    });
    setCurrentJobText(messageText);
    setMessageText("");
    setIsBotResponding(true);

    // Generate bot response
    try {
      const modalResponse = await getPrediction(messageText);
      const responseData = await generateResponseData(messageText);
      const botMessage = {
        sender: "bot",
        content: modalResponse.prediction,
        responseData,
        createdAt: new Date(),
      };
      await createMessage({
        chatId,
        ...botMessage,
      });
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        content:
          "Sorry, I couldn't analyze that job posting. Please try again.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsBotResponding(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <MessageList
          messages={messages}
          loading={loading}
          isBotResponding={isBotResponding}
          handleDelete={deleteMessage}
          handleSubmitEdit={editMessage}
        />
      </div>
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        handleSendMessage={handleSendMessage}
        disabled={isBotResponding}
      />
    </div>
  );
};

export default ChatComponent;
