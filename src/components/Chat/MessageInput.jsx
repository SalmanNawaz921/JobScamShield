import { useState, useRef, useEffect } from "react";
import { Paperclip, SendHorizonal } from "lucide-react";

const MessageInput = ({
  messageText,
  setMessageText,
  handleSendMessage,
  handleAttachment,
}) => {
  const textareaRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  return (
    <div className="sticky p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 rounded-xl border border-gray-300 bg-transparent p-1 pl-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <button
            type="button"
            onClick={handleAttachment}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Message..."
            className="max-h-32 flex-1 resize-none border-none bg-transparent py-2 text-gray-100 outline-none placeholder:text-gray-400"
            rows={1}
          />

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`rounded-lg p-2 ${
              messageText.trim()
                ? "text-blue-600 hover:bg-blue-50"
                : "text-gray-400"
            }`}
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
