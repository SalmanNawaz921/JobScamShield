// import { useState, useEffect } from "react";
// import { useUserContext } from "@/context/UserContext";
// import {
//   getMessages,
//   addMessage as createMessageService,
//   deleteMessage as deleteMsg,
//   ediMessage as editMessageService,
// } from "@/services/messageServices";

// export const useMessage = ({ chatId }) => {
//   const { userData: user } = useUserContext();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch all messages using the service function
//   const fetchMessages = async () => {
//     if (!user?.id) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const messagesData = await getMessages(chatId);
//       setMessages(messagesData);
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching messages:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create message using the service function
//   const createMessage = async (data) => {
//     if (!user?.id) return;

//     // Optimistic update
//     const tempId = Date.now(); // Temporary ID for optimistic update
//     const optimisticMessage = { ...data, id: tempId };
//     setMessages((prev) => [...prev, optimisticMessage]);

//     try {
//       const newMessage = await createMessageService(data);
//       // Replace the optimistic message with the actual one from server
//       setMessages((prev) =>
//         prev.map((msg) => (msg.id === tempId ? newMessage : msg))
//       );
//       return newMessage;
//     } catch (err) {
//       // Rollback on error
//       setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//       setError(err.message);
//       console.error("Error creating message:", err);
//       throw err;
//     }
//   };

//   const editMessage = async (data) => {
//     if (!user?.id) return;

//     // Optimistic update
//     setMessages((prev) =>
//       prev.map((msg) => (msg.id === data.id ? { ...msg, ...data } : msg))
//     );

//     try {
//       const updatedMessage = await editMessageService(data.id, data);
//       // Ensure we have the latest server state
//       setMessages((prev) =>
//         prev.map((msg) => (msg.id === data.id ? updatedMessage : msg))
//       );
//       return updatedMessage;
//     } catch (err) {
//       // On error, refetch to ensure state consistency
//       fetchMessages();
//       setError(err.message);
//       console.error("Error editing message:", err);
//       throw err;
//     }
//   };

//   const deleteMessage = async (messageId) => {
//     if (!user?.id) return;

//     // Optimistic update
//     const deletedMessage = messages.find((msg) => msg.id === messageId);
//     setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

//     try {
//       await deleteMsg(messageId);
//     } catch (err) {
//       // Rollback on error
//       setMessages((prev) => [...prev, deletedMessage]);
//       setError(err.message);
//       console.error("Error deleting message:", err);
//       throw err;
//     }
//   };

//   // Initialize
//   useEffect(() => {
//     fetchMessages();
//   }, [user?.id, chatId]); // Added chatId to dependency array

//   return {
//     messages,
//     loading,
//     error,
//     createMessage,
//     editMessage,
//     deleteMessage,
//     setMessages,
//     fetchMessages, // Expose fetchMessages in case needed
//   };
// };

import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  getMessages,
  addMessage as createMessageService,
  deleteMessage as deleteMsg,
  ediMessage as editMessageService,
} from "@/services/messageServices";
import {
  getBotResponses,
  addBotResponse,
} from "@/services/botResponseServices"; // NEW

export const useMessage = ({ chatId }) => {
  const { userData: user } = useUserContext();
  const [messages, setMessages] = useState([]); // user + bot threaded
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Combine user messages with their bot responses
  const fetchMessages = async () => {
    if (!user?.id || !chatId) return;

    setLoading(true);
    setError(null);

    try {
      const userMsgs = await getMessages(chatId); // USER MESSAGES
      const botMsgs = await getBotResponses(chatId); // BOT RESPONSES
      // Group bot responses by user message ID
      const responseMap = {};
      for (let bot of botMsgs) {
        const parentId = bot.responseTo;
        if (!responseMap[parentId]) responseMap[parentId] = [];
        responseMap[parentId].push(bot);
      }

      // Thread messages (user + bot under it)
      const threaded = userMsgs.map((msg) => ({
        ...msg,
        botResponses: responseMap[msg.id] || [],
      }));

      setMessages(threaded);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new user message
  const createMessage = async (data) => {
    if (!user?.id) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = { ...data, id: tempId, botResponses: [] };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const newMsg = await createMessageService(data);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...newMsg, botResponses: [] } : msg
        )
      );

      return newMsg;
    } catch (err) {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setError(err.message);
      console.error("Error creating message:", err);
      throw err;
    }
  };

  // (Optional) Add bot response manually
  const createBotResponse = async (responseData) => {
    try {
      const newResponse = await addBotResponse(responseData);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newResponse.responseTo
            ? {
                ...msg,
                botResponses: [...(msg.botResponses || []), newResponse],
              }
            : msg
        )
      );
    } catch (err) {
      console.error("Error adding bot response:", err);
      throw err;
    }
  };

  // Edit user message
  const editMessage = async (data) => {
    if (!user?.id) return;

    setMessages((prev) =>
      prev.map((msg) => (msg.id === data.id ? { ...msg, ...data } : msg))
    );

    try {
      const updated = await editMessageService(data.id, data);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.id
            ? { ...updated, botResponses: msg.botResponses }
            : msg
        )
      );
    } catch (err) {
      await fetchMessages(); // fallback to latest state
      setError(err.message);
      console.error("Error editing message:", err);
      throw err;
    }
  };

  // Delete user message
  const deleteMessage = async (id) => {
    if (!user?.id) return;

    const deleted = messages.find((msg) => msg.id === id);
    setMessages((prev) => prev.filter((msg) => msg.id !== id));

    try {
      await deleteMsg(id);
    } catch (err) {
      setMessages((prev) => [...prev, deleted]);
      setError(err.message);
      console.error("Error deleting message:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.id, chatId]);

  return {
    messages,
    loading,
    error,
    createMessage,
    createBotResponse, // (optional for testing)
    editMessage,
    deleteMessage,
    setMessages,
    fetchMessages,
  };
};
