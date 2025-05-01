import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  getChats,
  createChat as createChatService,
} from "@/services/chatServices";
import { formatFirestoreTimestamp } from "@/lib/utils/utils";
import { format } from "date-fns";

export const useChat = () => {
  const { userData: user } = useUserContext();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all chats using the service function
  const fetchChats = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const chatsData = await getChats(user.id);
      setChats(chatsData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create chat using the service function
  const createChat = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const newChat = await createChatService(user.id);
      setChats((prev) => [newChat, ...prev]);
      return newChat;
    } catch (err) {
      setError(err.message);
      console.error("Error creating chat:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Group chats by date for UI display
  const groupChatsByDate = () => {
    return chats?.reduce((acc, chat) => {
      const formattedDate = formatFirestoreTimestamp(
        chat.startedAt,
        "relative"
      );
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(chat);
      return acc;
    }, {});
  };

  // Initialize
  useEffect(() => {
    fetchChats();
  }, [user?.id]);

  return {
    chats,
    groupedChats: groupChatsByDate(),
    loading,
    error,
    refetch: fetchChats,
    createChat,
  };
};
