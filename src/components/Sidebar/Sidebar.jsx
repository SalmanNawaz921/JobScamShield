// import React, { useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";
// import { MessageCirclePlus, ChevronDown, ChevronRight } from "lucide-react";
// import { useUserContext } from "@/context/UserContext";
// import { addChat } from "@/services/chatServices";
// import { useChat } from "@/hooks/useChats";

// const SideBar = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { userData: user } = useUserContext();
//   const [expandedGroups, setExpandedGroups] = useState({});
//   const { groupedChats, createChat } = useChat();

//   // Toggle group expansion
//   const toggleGroup = (date) => {
//     setExpandedGroups((prev) => ({
//       ...prev,
//       [date]: !prev[date],
//     }));
//   };

//   // Create new chat
//   const handleNewChat = async () => {
//     try {
//       const chatCreated = await createChat(user.id);
//       if (chatCreated.id) {
//         router.push(`/user/${user.username}/c/${chatCreated.id}`);
//       }
//     } catch (error) {
//       console.error("Failed to create chat:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full  w-64">
//       {/* New Chat Button */}
//       <button
//         onClick={handleNewChat}
//         className="flex items-center gap-3 rounded-lg m-4 p-3 hover:bg-gray-100 transition-colors"
//       >
//         <MessageCirclePlus size={20} />
//         <span>New Chat</span>
//       </button>

//       {/* Chat History */}
//       <div className="flex-1 overflow-y-auto px-2 py-4">
//         {Object.entries(groupedChats).map(([date, dateChats]) => (
//           <div key={date} className="mb-4">
//             <div
//               className="flex items-center justify-between px-2 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 rounded"
//               onClick={() => toggleGroup(date)}
//             >
//               <span>{date}</span>
//               {expandedGroups[date] ? (
//                 <ChevronDown size={16} />
//               ) : (
//                 <ChevronRight size={16} />
//               )}
//             </div>

//             {expandedGroups[date] && (
//               <div className="mt-1 space-y-1">
//                 {dateChats.map((chat) => (
//                   <div key={chat.id}>
//                     <Link
//                       href={`/user/${user.username}/c/${chat.id}`}
//                       className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
//                         pathname.includes(chat.id)
//                           ? "bg-gray-200 font-medium"
//                           : "text-gray-700"
//                       }`}
//                     >
//                       <span className="truncate">
//                         {chat.title || `Chat ${chat.id}`}
//                       </span>
//                     </Link>
//                 </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* User Profile */}
//       <div className="p-4 border-t min-w-full border-gray-200">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
//             {user?.username?.charAt(0).toUpperCase()}
//           </div>
//           <span className="text-sm font-medium">{user?.username}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideBar;

// components/Sidebar/Sidebar.jsx
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MessageCirclePlus } from "lucide-react";
import { useUserContext } from "@/context/UserContext";
import { useChat } from "@/hooks/useChats";
import { ChatMenu } from "../Chat/ChatMenu";
import Logo from "@/assets/Logo";

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
    console.log("Renaming chat:", chatId, newName);
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
    <div className="flex flex-col h-full w-64">
      <div className="px-4 py-2 mt-8">
        <Logo description=" " />
      </div>
      <button
        onClick={handleNewChat}
        className="flex items-center gap-3 rounded-lg m-4 p-3 hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <MessageCirclePlus size={20} />
        <span>New Chat</span>
      </button>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          Loading...
        </div>
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

      <div className="p-4 border-t min-w-full border-gray-200">
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
