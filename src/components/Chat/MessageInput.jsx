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
    <div className="px-6 pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-xl transition focus-within:ring-2 focus-within:ring-blue-500">
          {/* Attach button */}
          <button
            type="button"
            onClick={handleAttachment}
            className="rounded-lg p-3 text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <Paperclip className="h-6 w-6" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Type your message..."
            className="max-h-40 flex-1 resize-none border-none bg-transparent py-2 text-white placeholder:text-gray-400 outline-none text-base"
            rows={1}
          />

          {/* Send button */}
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`rounded-lg p-3 transition ${
              messageText.trim()
                ? "text-blue-500 hover:bg-blue-500/20"
                : "text-gray-400"
            }`}
          >
            <SendHorizonal className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
