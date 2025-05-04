import { formatFirestoreTimestamp } from "@/lib/utils/utils";
import { Table } from "antd";

const LogsTable = ({ logs, loading }) => {
  const columns = [
    {
      title: "Event Type",
      dataIndex: "eventType",
      key: "eventType",
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt", // Ensure this matches the field name in the logs data
      key: "createdAt", // Consistent naming
      render: (createdAt) => (
        <span className="text-white">
          {formatFirestoreTimestamp(createdAt)}
        </span>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: "User Agent",
      dataIndex: "userAgent",
      key: "userAgent",
      render: (text) => (
        <span className="text-white truncate max-w-[250px] block">{text}</span>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 backdrop-blur bg-white/5 shadow-lg">
      <Table
        columns={columns}
        dataSource={logs}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        className="custom-ant-table"
      />
    </div>
  );
};

export default LogsTable;
