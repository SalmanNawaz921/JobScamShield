// // components/ChatComponent.jsx

// import { useState } from "react";
// import MessageInput from "./MessageInput";
// import MessageList from "./MessageList";
// import { generateResponseData } from "@/lib/utils/jobScamDetector";
// import { useMessage } from "@/hooks/useMessages";
// import { getPrediction } from "@/services/modalService";

// const ChatComponent = ({ chatId }) => {
//   const [messageText, setMessageText] = useState("");
//   const [isBotResponding, setIsBotResponding] = useState(false);
//   const [currentJobText, setCurrentJobText] = useState("");

//   const {
//     messages,
//     loading,
//     createMessage,
//     setMessages,
//     editMessage,
//     deleteMessage,
//   } = useMessage({ chatId });

//   const handleSendMessage = async () => {
//     if (!messageText.trim()) return;

//     // Add user message
//     const userMessage = {
//       sender: "user",
//       content: messageText,
//       createdAt: new Date(),
//     };

//     await createMessage({
//       chatId,
//       ...userMessage,
//     });
//     setCurrentJobText(messageText);
//     setMessageText("");
//     setIsBotResponding(true);

//     // Generate bot response
//     try {
//       const modalResponse = await getPrediction(messageText);
//       const responseData = await generateResponseData(messageText);
//       const botMessage = {
//         sender: "bot",
//         content: modalResponse.prediction,
//         responseData,
//         createdAt: new Date(),
//       };
//       await createMessage({
//         chatId,
//         ...botMessage,
//       });
//     } catch (error) {
//       console.error("Error generating response:", error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         sender: "bot",
//         content:
//           "Sorry, I couldn't analyze that job posting. Please try again.",
//         createdAt: new Date(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsBotResponding(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-auto">
//         <MessageList
//           messages={messages}
//           loading={loading}
//           isBotResponding={isBotResponding}
//           handleDelete={deleteMessage}
//           handleSubmitEdit={editMessage}
//         />
//       </div>
//       <MessageInput
//         messageText={messageText}
//         setMessageText={setMessageText}
//         handleSendMessage={handleSendMessage}
//         disabled={isBotResponding}
//       />
//     </div>
//   );
// };

// export default ChatComponent;

import { useState } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { generateResponseData } from "@/lib/utils/jobScamDetector";
import { useMessage } from "@/hooks/useMessages";
import { getPrediction } from "@/services/modalService";
import Logo from "@/assets/Logo";

const ChatComponent = ({ chatId }) => {
  const [messageText, setMessageText] = useState("");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [currentJobText, setCurrentJobText] = useState("");

  const {
    messages,
    loading,
    createMessage,
    createBotResponse,
    editMessage,
    deleteMessage,
  } = useMessage({ chatId });

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const userMessage = {
      sender: "user",
      content: messageText,
      createdAt: new Date(),
    };
    let userMsgResponse = null;

    try {
      userMsgResponse = await createMessage({ chatId, ...userMessage });
      setCurrentJobText(messageText);
      setMessageText("");
      setIsBotResponding(true);

      // Get AI prediction and response data
      const modalResponse = await getPrediction(messageText);
      const responseData = await generateResponseData(messageText);
      // Use dedicated bot response creator
      const botMessage = {
        chatId,
        sender: "bot",
        content: modalResponse.prediction,
        responseData,
        createdAt: new Date(),
        responseTo: userMsgResponse.id, // Assuming userMessage has an id
      };
      await createBotResponse(botMessage);
    } catch (error) {
      console.error("Error sending message or generating bot response:", error);
      // You may optionally show a toast or notification to user here
    } finally {
      setIsBotResponding(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto w-full">
       <Logo/>
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
