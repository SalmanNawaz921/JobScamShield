"use client";
import ChatComponent from "@/components/Chat/ChatComponent";
import { useParams } from "next/navigation";

const Page = () => {
  const { chatId } = useParams(); // Assuming you are using react-router-dom for routing
  return (
    <div>
      {/* chatId : {chatId} */}
      <ChatComponent chatId={chatId}/>
    </div>
  );
};

export default Page;
