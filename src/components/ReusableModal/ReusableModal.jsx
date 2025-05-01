import { Modal } from "antd";
import ReusableForm from "../ReusableForm/ReusableForm";

const ReusableModal = ({
  inputs,
  formTitle,
  buttonText,
  onSubmit,
  setOpen,
  open,
}) => {
  return (
    <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
      <ReusableForm
        inputs={inputs}
        formTitle={formTitle}
        buttonTxt={buttonText}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

export default ReusableModal;
