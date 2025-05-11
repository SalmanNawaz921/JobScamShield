// import Logo from "@/assets/Logo";
// import { useChat } from "@/context/ChatContext";

// const UserDashboard = ({ username }) => {
//   const { chats } = useChat();

//   return (
//     <div className="text-white">
//       <div className="flex flex-col items-center justify-center p-4">
//         <Logo description=" "/>
//         <p className="mt-2 text-gray-400">
//           Welcome {username}! Your Ultimate Scam Detector.
//         </p>
//       </div>
//       <div className="shadow-2xl text-white">
//         <h2>Your Chats</h2>
//         <h3>{chats.length}</h3>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import Logo from "@/assets/Logo";
import { useChat } from "@/context/ChatContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loader from "../Loader/Loader";

const DashboardCard = ({ title, value }) => (
  <div className="backdrop-blur border border-white/10 bg-white/5 shadow-lg rounded-2xl p-6 flex flex-col items-center text-white">
    <h2 className="text-base font-medium">{title}</h2>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const EventChart = ({ chartData = [] }) => (
  <div className="rounded-2xl border border-white/10 backdrop-blur bg-white/5 shadow-lg px-8 pb-8 pt-4">
    <div className="h-64 mt-8 p-4">
      <h2 className="text-white text-lg mb-4 font-medium">Chat Activity</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ffffff1a" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              backdropFilter: "blur(8px)",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#4f46e5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const UserDashboard = ({ username }) => {
  const { chats, groupedChats, loading, todaysChats, thisWeeksChats } =
    useChat();

  // Prepare data for the chart
  const chartData = Object.entries(groupedChats || {}).map(([date, chats]) => ({
    date,
    count: chats?.chats.length,
  }));

  // Sort chart data by date (most recent first)
  chartData.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="text-white p-2 max-w-7xl mx-auto">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center mb-8">
            <Logo description=" " />
            <p className="mt-2 text-gray-400 text-lg">
              Welcome {username}! Your Ultimate Scam Detector.
            </p>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DashboardCard title="Total Chats" value={chats.length} />
            <DashboardCard title="Today's Chats" value={todaysChats} />
            <DashboardCard title="This Week" value={thisWeeksChats} />
          </div>
          {/* Chart Section */}
          <div className="mb-8">
            <EventChart chartData={chartData.slice(0, 14)} />{" "}
            {/* Show last 14 days */}
          </div>
          {/* Recent Chats Section */}
          <div className="backdrop-blur border border-white/10 bg-white/5 shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Chats</h2>
            {loading ? (
              <Loader />
            ) : chats.length === 0 ? (
              <p className="text-gray-400">
                No chats yet. Start a new conversation!
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedChats || {})
                  .slice(0, 5) // Show only recent 5 groups
                  .map(([date, chats]) => (
                    <div key={date}>
                      <h3 className="text-gray-300 font-medium mb-2">{date}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {chats?.chats?.map((chat) => (
                          <div
                            key={chat.id}
                            className="border border-white/10 p-4 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <h4 className="font-medium truncate">
                              {chat.title || `Chat ${chat.id}`}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {new Date(
                                chat.startedAt?.seconds * 1000
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
