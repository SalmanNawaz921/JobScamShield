import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  getChats,
  addChat as createChatService,
  ediChat as editChatService,
  deleteChat as deleteChatService,
} from "@/services/chatServices";
import { formatFirestoreTimestamp } from "@/lib/utils/utils";

export const useChat = () => {
  const { userData: user } = useUserContext();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false); // ✅ track if initial fetch done

  const fetchChats = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const chatsData = await getChats(user.id);
      setChats(chatsData);
      setInitialized(true); // ✅ mark as fetched
    } catch (err) {
      setError(err.message);
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const groupChatsByDate = () => {
    return chats?.reduce((acc, chat) => {
      const formattedDate = formatFirestoreTimestamp(chat.startedAt, "relative");
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(chat);
      return acc;
    }, {});
  };

  const editChat = async (chatId, newName) => {
    if (!user?.id) return;
    const data = { title: newName };

    setLoading(true);
    setError(null);

    try {
      const updatedChat = await editChatService(chatId, data);
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? updatedChat : chat))
      );
      return updatedChat;
    } catch (err) {
      setError(err.message);
      console.error("Error editing chat:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      await deleteChatService(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting chat:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ fetch only once if user is available and not already fetched
    if (user?.id && !initialized) {
      fetchChats();
    }
  }, [user?.id, initialized]);

  return {
    chats,
    groupedChats: groupChatsByDate(),
    loading,
    error,
    refetch: fetchChats, // still available if needed
    createChat,
    editChat,
    deleteChat,
  };
};
