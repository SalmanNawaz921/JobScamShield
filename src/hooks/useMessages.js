import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  getMessages,
  addMessage as createMessageService,
  deleteMessage as deleteMsg,
} from "@/services/messageServices";

export const useMessage = ({ chatId }) => {
  const { userData: user } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(chatId, "chatId in useMessage");
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

    setLoading(true);
    setError(null);

    try {
      const newMessage = await createMessageService(data);
      setMessages((prev) => [newMessage, ...prev]);
      return newMessage;
    } catch (err) {
      setError(err.message);
      console.error("Error creating message:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editMessage = async (messageId, data) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const updatedMessage = await editMessage(messageId, data);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId ? updatedMessage : message
        )
      );
      return updatedMessage;
    } catch (err) {
      setError(err.message);
      console.error("Error editing message:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      await deleteMsg(messageId);
      setMessages((prev) => prev.filter((message) => message.id !== messageId));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting message:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    fetchMessages();
  }, [user?.id]);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
    createMessage,
    editMessage,
    deleteMessage,
    setMessages,
  };
};
