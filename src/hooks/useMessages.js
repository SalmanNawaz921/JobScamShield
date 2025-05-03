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

//     setLoading(true);
//     setError(null);

//     try {
//       const newMessage = await createMessageService(data);
//       setMessages((prev) => [...prev, newMessage]);
//       return newMessage;
//     } catch (err) {
//       setError(err.message);
//       console.error("Error creating message:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const editMessage = async (data) => {
//     if (!user?.id) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const updatedMessage = await editMessageService(data.id, data);
//       setMessages((prev) =>
//         prev.map((message) =>
//           message.id === data.id ? updatedMessage : message
//         )
//       );
//       return updatedMessage;
//     } catch (err) {
//       setError(err.message);
//       console.error("Error editing message:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteMessage = async (messageId) => {
//     if (!user?.id) return;

//     setLoading(true);
//     setError(null);

//     try {
//       await deleteMsg(messageId);
//       setMessages((prev) => prev.filter((message) => message.id !== messageId));
//     } catch (err) {
//       setError(err.message);
//       console.error("Error deleting message:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize
//   useEffect(() => {
//     fetchMessages();
//   }, [user?.id]);

//   return {
//     messages,
//     loading,
//     error,
//     createMessage,
//     editMessage,
//     deleteMessage,
//     setMessages,
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

export const useMessage = ({ chatId }) => {
  const { userData: user } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all messages using the service function
  const fetchMessages = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const messagesData = await getMessages(chatId);
      setMessages(messagesData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create message using the service function
  const createMessage = async (data) => {
    if (!user?.id) return;

    // Optimistic update
    const tempId = Date.now(); // Temporary ID for optimistic update
    const optimisticMessage = { ...data, id: tempId };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const newMessage = await createMessageService(data);
      // Replace the optimistic message with the actual one from server
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? newMessage : msg))
      );
      return newMessage;
    } catch (err) {
      // Rollback on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setError(err.message);
      console.error("Error creating message:", err);
      throw err;
    }
  };

  const editMessage = async (data) => {
    if (!user?.id) return;

    // Optimistic update
    setMessages((prev) =>
      prev.map((msg) => (msg.id === data.id ? { ...msg, ...data } : msg))
    );

    try {
      const updatedMessage = await editMessageService(data.id, data);
      // Ensure we have the latest server state
      setMessages((prev) =>
        prev.map((msg) => (msg.id === data.id ? updatedMessage : msg))
      );
      return updatedMessage;
    } catch (err) {
      // On error, refetch to ensure state consistency
      fetchMessages();
      setError(err.message);
      console.error("Error editing message:", err);
      throw err;
    }
  };

  const deleteMessage = async (messageId) => {
    if (!user?.id) return;

    // Optimistic update
    const deletedMessage = messages.find((msg) => msg.id === messageId);
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

    try {
      await deleteMsg(messageId);
    } catch (err) {
      // Rollback on error
      setMessages((prev) => [...prev, deletedMessage]);
      setError(err.message);
      console.error("Error deleting message:", err);
      throw err;
    }
  };

  // Initialize
  useEffect(() => {
    fetchMessages();
  }, [user?.id, chatId]); // Added chatId to dependency array

  return {
    messages,
    loading,
    error,
    createMessage,
    editMessage,
    deleteMessage,
    setMessages,
    fetchMessages, // Expose fetchMessages in case needed
  };
};
