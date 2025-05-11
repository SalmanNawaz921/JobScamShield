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
