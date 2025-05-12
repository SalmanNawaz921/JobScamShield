// components/Sidebar/Sidebar.jsx
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MessageCirclePlus } from "lucide-react";
import { useUserContext } from "@/context/UserContext";
import { useChat } from "@/context/ChatContext";
import { ChatMenu } from "../Chat/ChatMenu";
import Logo from "@/assets/Logo";
import Loader from "../Loader/Loader";
import Link from "next/link";

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userData: user } = useUserContext();
  const [expandedGroups, setExpandedGroups] = useState({});
  const { groupedChats, createChat, editChat, deleteChat, loading } = useChat();
  const toggleGroup = (date) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleNewChat = async () => {
    try {
      const chatCreated = await createChat(user.id);
      if (chatCreated.id) {
        router.push(`/user/${user.username}/c/${chatCreated.id}`);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleRenameChat = async (chatId, newName) => {
    if (newName) {
      await editChat(chatId, newName);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      await deleteChat(chatId);
    }
  };

  return (
    <div className="flex flex-col h-screen w-64">
      {/* Header */}
      <div className="py-8 mt-4">
        <Link href="/">
        <Logo size="lg" />
        </Link>
      </div>

      <button
        onClick={handleNewChat}
        className="flex items-center gap-3 rounded-lg mx-4 my-2 p-3 hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <MessageCirclePlus size={20} />
        <span>New Chat</span>
      </button>

      {/* Scrollable Chat List */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {loading ? (
          <Loader />
        ) : (
          <ChatMenu
            groupedChats={groupedChats}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
            pathname={pathname}
            username={user?.username}
            onRenameChat={handleRenameChat}
            onDeleteChat={handleDeleteChat}
          />
        )}
      </div>

      {/* Footer - User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium">{user?.username}</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
