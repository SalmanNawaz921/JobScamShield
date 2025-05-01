// import React, { useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { menuItems } from "@/lib/constants/constants";
// import Link from "next/link";
// import ChatMenu from "../Chat/ChatMenu";
// import { useUserContext } from "@/context/UserContext";
// import { MessageCirclePlusIcon } from "lucide-react";
// import ReusableModal from "../ReusableModal/ReusableModal";
// import { addChat } from "@/services/chatServices";

// const SideBar = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { locale } = router;
//   const chats = [
//     {
//       id: "1",
//       userId: "123",
//       startedAt: "2022-03-02",
//       endedAt: "2022-03-02",
//       durationMinutes: 60, // system-calculated
//       isActive: true,
//       messages: [
//         {
//           messageId: "231",
//           text: "Is this job valid",
//         },
//       ],
//     },
//     {
//       id: "2",
//       userId: "123",
//       startedAt: "2022-03-02",
//       endedAt: "2022-03-02",
//       durationMinutes: 60, // system-calculated
//       isActive: true,
//       messages: [
//         {
//           messageId: "231",
//           text: "Is this job valid",
//         },
//       ],
//     },
//     {
//       id: "3",
//       userId: "123",
//       startedAt: "2022-03-02",
//       endedAt: "2022-03-02",
//       durationMinutes: 60, // system-calculated
//       isActive: true,
//       messages: [
//         {
//           messageId: "231",
//           text: "Is this job valid",
//         },
//       ],
//     },
//     {
//       id: "4",
//       userId: "123",
//       startedAt: "2022-03-02",
//       endedAt: "2022-03-02",
//       durationMinutes: 60, // system-calculated
//       isActive: true,
//       messages: [
//         {
//           messageId: "231",
//           text: "Is this job valid",
//         },
//       ],
//     },
//     {
//       id: "5",
//       userId: "123",
//       startedAt: "2022-03-02",
//       endedAt: "2022-03-02",
//       durationMinutes: 60, // system-calculated
//       isActive: true,
//       messages: [
//         {
//           messageId: "231",
//           text: "Is this job valid",
//         },
//       ],
//     },
//   ];
//   const { userData: user } = useUserContext();
//   const [groupedChats, setGroupedChats] = useState(chats);
//   // Menu item component for recursive rendering
//   const Menu = ({ options }) => (
//     <ul className="flex flex-col gap-2">
//       {options.map((option, index) => {
//         const fullPath = `${pathname.replace(/\/$/, "")}${option.url}`;
//         const isActive = pathname === fullPath || pathname.startsWith(fullPath);

//         return (
//           <li
//             key={index}
//             className={`text-lg px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
//               isActive
//                 ? "bg-purple-600 text-white font-bold"
//                 : "hover:bg-gray-200 text-gray-700"
//             }`}
//           >
//             <Link href={fullPath}>
//               <span className="flex items-center gap-4">
//                 <span className="text-xl">{option.icon}</span>
//                 <span>{locale === "zh" ? option.label : option.label}</span>
//               </span>
//             </Link>
//             {option.children && <Menu options={option.children} />}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="flex flex-col gap-3 ">
//         {/* Logo */}
//         <div className="mt-4 flex justify-end mr-4">
//           {/* <Link href="/salespage">
//             <img
//               src="/images/logo3.png" // Update this with your logo's path
//               alt="Logo"
//               className="w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 h-auto"
//             />
//           </Link> */}

//           <MessageCirclePlusIcon
//             size={32}
//             onClick={async() => {
//               const chatCreated =await addChat(user.id);
//               if (chatCreated.id)
//                 router.push(`/user/${user.username}/c/${chatCreated.id}`);
//             }}
//           />
//         </div>

//         {/* Dashboard Title */}
//         <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-purple-600 cursor-default mb-2">
//           Dashboard
//         </h1>

//         {/* Render Menu */}
//         <ChatMenu
//           chats={chats}
//           handleSelectedChat={chats[0]}
//           user={user}
//           setChats={setGroupedChats}
//         />

//         <ReusableModal i />
//         {/* <Menu options={menuItems} /> */}
//       </div>
//     </div>
//   );
// };

// export default SideBar;

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCirclePlus, ChevronDown, ChevronRight } from "lucide-react";
import { useUserContext } from "@/context/UserContext";
import { addChat } from "@/services/chatServices";
import { useChat } from "@/hooks/useChats";

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userData: user } = useUserContext();
  const [expandedGroups, setExpandedGroups] = useState({});
  const { chats, groupedChats, createChat } = useChat();

  // Toggle group expansion
  const toggleGroup = (date) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Create new chat
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

  return (
    <div className="flex flex-col h-full  w-64">
      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="flex items-center gap-3 rounded-lg m-4 p-3 hover:bg-gray-100 transition-colors"
      >
        <MessageCirclePlus size={20} />
        <span>New Chat</span>
      </button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {Object.entries(groupedChats).map(([date, dateChats]) => (
          <div key={date} className="mb-4">
            <div
              className="flex items-center justify-between px-2 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => toggleGroup(date)}
            >
              <span>{date}</span>
              {expandedGroups[date] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>

            {expandedGroups[date] && (
              <div className="mt-1 space-y-1">
                {dateChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/user/${user.username}/c/${chat.id}`}
                    className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                      pathname.includes(chat.id)
                        ? "bg-gray-200 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="truncate">
                      {chat.title || `Chat ${chat.id}`}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Profile */}
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
