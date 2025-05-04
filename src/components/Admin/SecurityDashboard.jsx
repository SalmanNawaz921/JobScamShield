// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { message, Pagination } from "antd";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { formatFirestoreTimestamp } from "@/lib/utils/utils";

// const DashboardCard = ({ title, value }) => (
//   <div className="backdrop-blur border border-white/10 bg-white/5 shadow-lg rounded-2xl p-6 flex flex-col items-center text-white">
//     <h2 className="text-base font-medium">{title}</h2>
//     <p className="text-3xl font-bold mt-2">{value}</p>
//   </div>
// );

// const LogsTable = ({ logs }) => (
//   <div className="overflow-x-auto rounded-2xl border border-white/10 backdrop-blur bg-white/5 shadow-lg mt-8">
//     <table className="min-w-full text-sm text-white">
//       <thead>
//         <tr className="text-left border-b border-white/10">
//           <th className="p-4">Event Type</th>
//           <th className="p-4">Timestamp</th>
//           <th className="p-4">IP Address</th>
//           <th className="p-4">User Agent</th>
//         </tr>
//       </thead>
//       <tbody>
//         {logs.map((log) => (
//           <tr key={log.id} className="border-b border-white/5 hover:bg-white/10 transition">
//             <td className="p-4">{log.eventType}</td>
//             <td className="p-4">{formatFirestoreTimestamp(log.timestamp)}</td>
//             <td className="p-4">{log.ipAddress}</td>
//             <td className="p-4 truncate max-w-xs">{log.userAgent}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const EventChart = ({ chartData }) => (
//   <div className="h-64 mt-8 rounded-2xl border border-white/10 backdrop-blur bg-white/5 shadow-lg p-4">
//     <h2 className="text-white text-lg mb-4 font-medium">Events Over Time</h2>
//     <ResponsiveContainer width="100%" height="100%">
//       <LineChart data={chartData}>
//         <CartesianGrid stroke="#ffffff1a" />
//         <XAxis dataKey="date" stroke="#ccc" />
//         <YAxis stroke="#ccc" />
//         <Tooltip
//           contentStyle={{
//             background: "rgba(255, 255, 255, 0.05)",
//             border: "1px solid rgba(255, 255, 255, 0.15)",
//             color: "#fff",
//             backdropFilter: "blur(8px)",
//           }}
//         />
//         <Line type="monotone" dataKey="events" stroke="#4f46e5" strokeWidth={2} />
//       </LineChart>
//     </ResponsiveContainer>
//   </div>
// );

// const SecurityDashboard = () => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [chartData, setChartData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const res = await axios.get("/api/admin/security-logs", {
//           withCredentials: true,
//         });
//         const logsData = res.data;
//         setLogs(logsData);
//         generateChartData(logsData);
//       } catch (error) {
//         console.error("Failed to fetch logs:", error);
//         message.error("Failed to fetch logs. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLogs();
//   }, []);

//   const generateChartData = (logsData) => {
//     const dataByDate = logsData.reduce((acc, log) => {
//       const date = formatFirestoreTimestamp(log.timestamp).split(",")[0];
//       acc[date] = (acc[date] || 0) + 1;
//       return acc;
//     }, {});

//     const chartArray = Object.entries(dataByDate).map(([date, events]) => ({
//       date,
//       events,
//     }));

//     setChartData(chartArray);
//   };

//   const stats = [
//     {
//       title: "Failed Logins",
//       value: logs.filter((l) => l.eventType === "AUTH_FAILURE").length,
//     },
//     {
//       title: "Rate Limited",
//       value: logs.filter((l) => l.eventType === "RATE_LIMIT_EXCEEDED").length,
//     },
//     {
//       title: "Total Events",
//       value: logs.length,
//     },
//   ];

//   if (loading) return <div className="text-white p-6">Loading...</div>;

//   const paginatedLogs = logs.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   return (
//     <div className="p-6 space-y-8">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {stats.map((item, idx) => (
//           <DashboardCard key={idx} title={item.title} value={item.value} />
//         ))}
//       </div>

//       <EventChart chartData={chartData} />

//       <LogsTable logs={paginatedLogs} />

//       <div className="flex justify-center mt-4">
//         <Pagination
//           current={currentPage}
//           pageSize={pageSize}
//           total={logs.length}
//           onChange={(page) => setCurrentPage(page)}
//           showSizeChanger={false}
//           className="text-white"
//         />
//       </div>
//     </div>
//   );
// };

// export default SecurityDashboard;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LogsTable from "@/components/Admin/LogsTable";
import { formatFirestoreTimestamp } from "@/lib/utils/utils";

const DashboardCard = ({ title, value }) => (
  <div className="backdrop-blur border border-white/10 bg-white/5 shadow-lg rounded-2xl p-6 flex flex-col items-center text-white">
    <h2 className="text-base font-medium">{title}</h2>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const EventChart = ({ chartData = [] }) => (
  <div className="rounded-2xl border border-white/10 backdrop-blur bg-white/5 shadow-lg px-8 pb-8 pt-4">
    <div className="h-64 mt-8  p-4">
      <h2 className="text-white text-lg mb-4 font-medium">Events Over Time</h2>
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
            dataKey="events"
            stroke="#4f46e5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const SecurityDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/admin/security-logs", {
          withCredentials: true,
        });
        const logsData = res.data;
        setLogs(logsData);
        generateChartData(logsData);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        message.error("Failed to fetch logs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const generateChartData = (logsData) => {
    const dataByDate = logsData.reduce((acc, log) => {
      const date = formatFirestoreTimestamp(log.createdAt, "date");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const chartArray = Object.entries(dataByDate).map(([date, events]) => ({
      date,
      events,
    }));

    setChartData(chartArray);
  };

  const stats = [
    {
      title: "Failed Logins",
      value: logs.filter((l) => l.eventType === "AUTH_FAILURE").length,
    },
    {
      title: "Rate Limited",
      value: logs.filter((l) => l.eventType === "RATE_LIMIT_EXCEEDED").length,
    },
    {
      title: "Total Events",
      value: logs.length,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <DashboardCard key={idx} title={item.title} value={item.value} />
        ))}
      </div>
      <EventChart chartData={chartData} />

      <LogsTable logs={logs} loading={loading} />
    </div>
  );
};

export default SecurityDashboard;
