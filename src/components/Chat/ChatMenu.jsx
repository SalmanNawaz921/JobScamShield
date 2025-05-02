import { ChevronDown, ChevronRight } from "lucide-react";
import { ChatItem } from "./ChatItem";

export const ChatMenu = ({ 
  groupedChats, 
  expandedGroups, 
  onToggleGroup, 
  pathname, 
  username,
  onRenameChat,
  onDeleteChat 
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-4">
      {Object.entries(groupedChats).map(([date, dateChats]) => (
        <div key={date} className="mb-4">
          <div
            className="flex items-center justify-between px-2 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 rounded"
            onClick={() => onToggleGroup(date)}
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
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={pathname.includes(chat.id)}
                  username={username}
                  onRename={onRenameChat}
                  onDelete={onDeleteChat}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};