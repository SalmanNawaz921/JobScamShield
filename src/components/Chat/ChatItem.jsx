// components/Chat/ChatItem.jsx
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export const ChatItem = ({ chat, isActive, username, onRename, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(
    chat.title || `Chat ${chat.id}`
  );
  const inputRef = useRef(null);
  const router = useRouter();

  const handleMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleRenameClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(chat.id);
    setShowMenu(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Renaming chat to:", editedTitle);
    if (editedTitle.trim() && editedTitle !== chat.title) {
      console.log("Renaming chat to:", editedTitle);
      onRename(chat.id, editedTitle);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedTitle(chat.title || `Chat ${chat.id}`);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="group relative">
      {isEditing ? (
        <form
          onSubmit={handleEditSubmit}
          className="flex items-center px-3 py-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 text-sm border rounded px-2 py-1 mr-2"
            onBlur={handleEditCancel}
          />
          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
            className="p-1 text-green-600 hover:bg-gray-100 rounded"
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleEditCancel}
            className="p-1 text-red-600 hover:bg-gray-100 rounded"
          >
            <X size={16} />
          </button>
        </form>
      ) : (
        <>
          <Link
            href={`/user/${username}/c/${chat.id}`}
            className={`flex items-center justify-between px-3 py-2 text-sm rounded-md !text-gray-200 hover:bg-gray-100 ${
              isActive ? "!bg-gray-700 font-medium" : "!text-gray-300"
            }`}
          >
            <span className="truncate flex-1">{editedTitle}</span>

            <button
              onClick={handleMenuToggle}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200"
            >
              <MoreHorizontal size={16} />
            </button>
          </Link>

          {showMenu && (
            <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <button
                  onClick={handleRenameClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Rename
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
