"use client";
import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  getChats,
  addChat as createChatService,
  ediChat as editChatService,
  deleteChat as deleteChatService,
} from "@/services/chatServices";
import { formatFirestoreTimestamp } from "@/lib/utils/utils";
import { message } from "antd";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
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
    // First, sort chats by date (newest first)
    const sortedChats = [...(chats || [])].sort((a, b) => {
      // Handle cases where startedAt might be missing
      if (!a.startedAt?.seconds) return 1;
      if (!b.startedAt?.seconds) return -1;
      // Sort in descending order (newest first)
      return b.startedAt.seconds - a.startedAt.seconds;
    });

    return sortedChats.reduce((acc, chat) => {
      const groupKey = formatFirestoreTimestamp(chat?.startedAt, "group");
      const displayTime = formatFirestoreTimestamp(chat?.startedAt, "relative");

      if (!acc[groupKey]) {
        acc[groupKey] = {
          chats: [],
          count: 0,
          isToday: groupKey === "Today",
          isThisWeek: groupKey === "This Week" || groupKey === "Today",
          displayTime,
        };
      }

      acc[groupKey].chats.push({
        ...chat,
        // You might want to add the displayTime to each chat if needed
        displayTime,
      });
      acc[groupKey].count++;

      return acc;
    }, {});
  };
  const groupedChats = useMemo(() => {
    return groupChatsByDate();
  }, [chats]);
  const todaysChats = groupedChats?.["Today"]?.count || 0;
  const thisWeeksChats = Object.values(groupedChats || {})
    .filter((group) => group.isThisWeek)
    .reduce((sum, group) => sum + group.count, 0);
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
      const resp = await deleteChatService(chatId);
      if (resp) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        return resp.deleted;
      }
    } catch (err) {
      message.error("Failed to delete chat");
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

  return (
    <ChatContext.Provider
      value={{
        chats,
        groupedChats,
        todaysChats,
        thisWeeksChats,
        loading,
        error,
        fetchChats,
        createChat,
        editChat,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
