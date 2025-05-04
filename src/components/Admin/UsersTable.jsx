import { Table, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const UserTable = ({ users, loading, onDelete }) => {
  // Define the columns for the table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          className="bg-transparent text-white border border-red-500 hover:bg-red-500 hover:text-white"
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Handle delete action
  const handleDelete = (userId) => {
    // You can call an API or update state to delete the user
    // Here we simulate a delete operation with a success message
    onDelete(userId);  // Assume onDelete handles user deletion
    message.success("User deleted successfully!");
  };

  return (
    <div className="rounded-2xl border border-white/10 backdrop-blur bg-white/5 shadow-lg">
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="custom-ant-table"
      />
    </div>
  );
};

export default UserTable;
