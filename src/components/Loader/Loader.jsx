import { Spin } from "antd";

const Loader = () => {
  return (
    <div style={{ textAlign: "center", padding: "24px" }}>
      <Spin size="large" />
    </div>
  );
};

export default Loader;
