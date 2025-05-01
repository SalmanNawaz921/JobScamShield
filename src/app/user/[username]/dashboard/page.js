"use client";
import { useParams } from "next/navigation";

const Page = () => {
  const { username } = useParams(); // Assuming you are using react-router-dom for routing
  return <div>User : {username}</div>;
};

export default Page;
