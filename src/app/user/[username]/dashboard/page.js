"use client";
import UserDashboard from "@/components/User/UserDashboard";
import { useParams } from "next/navigation";

const Page = () => {
  const { username } = useParams(); // Assuming you are using react-router-dom for routing
  return (
    <div>
      <UserDashboard username={username}/>
    </div>
  );
};

export default Page;
