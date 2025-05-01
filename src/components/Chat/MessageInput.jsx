// MessageInput.js
import { Upload, Button, Input } from "antd";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const MessageInput = ({
  messageText,
  setMessageText,
  handleSendMessage,
  handleAttachment,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
      <Upload beforeUpload={handleAttachment} showUploadList={false}>
        <Button icon={<PaperClipOutlined />} />
      </Upload>
      <TextArea
        placeholder="Type a message..."
        autoSize={{ minRows: 1, maxRows: 3 }}
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        style={{ flex: 1, margin: "0 8px" }}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSendMessage}
      />
    </div>
  );
};

export default MessageInput;
