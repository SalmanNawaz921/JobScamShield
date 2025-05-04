"use client";
import Logo from "@/assets/Logo";
import ChatComponent from "@/components/Chat/ChatComponent";
import { useParams } from "next/navigation";

const Page = () => {
  const { chatId } = useParams(); // Assuming you are using react-router-dom for routing
  return (
    <div>
      {/* You can add more components or elements here as needed */}
      {/* Pass the chatId to the ChatComponent or any other component you want to use */}
      {/* Example: */}
      <ChatComponent chatId={chatId} />
    </div>
  );
};

export default Page;
