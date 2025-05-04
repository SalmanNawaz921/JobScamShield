import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  DatePicker,
  Radio,
  Upload,
  Form,
  message,
  Checkbox,
  Button,
  Col,
  Row,
  Card,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useWatch } from "antd/es/form/Form";

const { Option } = Select;
const { TextArea } = Input;
const ReusableInput = ({
  input,
  errors,
  onChange,
  form,
  styles,
  showLabel,
}) => {
  const {
    type,
    name,
    placeholder,
    options,
    required,
    multiFiles,
    label,
    itemFields,
    dependentOn,
    Icon,
  } = input;
  const [fileList, setFileList] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Watch the dependent field for changes
  const dependentValue = useWatch(
    dependentOn === "patientID" ? "patient" : dependentOn,
    form
  );

  useEffect(() => {
    if (dependentOn) {
      // Filter options based on the dependent field's value
      const filtered = options?.filter(
        (opt) => opt[dependentOn] === dependentValue
      );
      setFilteredOptions(filtered);
    } else {
      // If no dependency, use all options
      setFilteredOptions(options);
    }
  }, [dependentValue, options, dependentOn]);

  // Theme Colors
  const theme = {
    primary: styles?.primary || "#3B82F6",
    secondary: styles?.secondary || "#043077",
    text: styles?.text || "#FFFFFF",
    background: styles?.background || "rgba(255, 255, 255, 0.1)",
    border: styles?.border || "#D1D5DB",
    accent: styles?.accent || "#10B981",
    error: styles?.error || "#F87171",
    label: styles?.label || "#9CA3AF",
  };

  // Styles
  const formItemStyle = {
    marginBottom: "20px",
  };

  const baseInputStyle = {
    backgroundColor: theme.background,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    color: theme.text,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const inputStyle = {
    ...baseInputStyle,
    height: "40px",
    padding: "0 12px",
  };

  const textareaStyle = {
    ...baseInputStyle,
    minHeight: "100px",
    padding: "12px",
  };

  const selectStyle = {
    ...baseInputStyle,
    width: "100%",
    height: "40px",
  };

  const datePickerStyle = {
    ...baseInputStyle,
    width: "100%",
    height: "40px",
  };

  const radioStyle = {
    color: "rgba(255, 255, 255, 0.85)",
    marginRight: "16px",
    marginBottom: "8px",
  };

  const checkboxStyle = {
    color: "rgba(255, 255, 255, 0.85)",
    marginRight: "16px",
    marginBottom: "8px",
  };

  const uploadStyle = {
    ...baseInputStyle,
    padding: "16px",
    textAlign: "center",
    cursor: "pointer",
  };

  // Custom styles for Ant Design components
  const customStyles = `
  .ant-form-item-label > label {
    color: ${theme.label} !important;
    font-weight: 500;
    font-size: 14px;
  }

  .ant-form-item-label > label {
    display: block !important;
    color: ${theme.label}  !important; /* Ensure label is visible */
  }

  .ant-input-password-icon {
  color: ${theme.text} !important;
}

  .ant-form-item {
    transition: all 0.3s ease-in-out;
  }

  .ant-input::placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
    opacity: 1 !important;
  }

  .ant-input::placeholder,
  .ant-input-password::placeholder,
  .ant-picker-input input::placeholder,
  .ant-select-selection-placeholder {
    color: ${theme.text} !important;
  }

  .ant-input, .ant-input-password {
    background-color: ${theme.background} !important;
    border: 1px solid ${theme.border} !important;
    color: ${theme.text} !important;
    border-radius: 8px !important;
  }

  .ant-input:hover, .ant-input-password:hover {
    border-color: ${theme.primary} !important;
  }

  .ant-input:focus, .ant-input-password:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
  }

  .ant-input-password .ant-input {
    background-color: transparent !important;
    border: none !important;
  }


  .ant-select-selector {
    background-color: ${theme.backgorund} important;
    border: 1px solid  ${theme.backgorund} !important;
    color: ${theme.text} !important;
    border-radius: 8px !important;
    min-height: 40px !important;
  }

  .ant-select-dropdown {
    background-color: ${theme.secondary} !important;
    border: 1px solid ${theme.primary} !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  }

  .ant-select-item {
    color: ${theme.text} !important;
    transition: all 0.2s ease;
  }

  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }

  .ant-picker {
    background-color: ${theme.background} !important;
    border: 1px solid ${theme.border} !important;
    border-radius: 8px !important;
  }

  .ant-picker-input > input {
    color: ${theme.text} !important;
  }

  .ant-radio-inner {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
  }

  .ant-checkbox-inner {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
  }

  .ant-upload-list-item {
    color: ${theme.text} !important;
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-radius: 6px !important;
  }

  .ant-form-item-explain-error {
    color: ${theme.error} !important;
    font-size: 12px !important;
    margin-top: 4px !important;
  }
`;

  // File Validation
  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("File must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // Handle File Upload Changes
  const handleChange = (info) => {
    if (multiFiles) {
      setFileList([...info.fileList]);
    } else {
      if (info.file.status === "done" || info.file.status === "uploading") {
        const reader = new FileReader();
        reader.onload = () => {
          setFileList([{ url: reader.result }]);
        };
        reader.readAsDataURL(info.file.originFileObj);
      }
    }
  };

  // Handle value changes for preview
  const handleValueChange = (value) => {
    if (onChange) {
      onChange(name, value);
    }
  };

  const renderMultiInput = () => {
    return (
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name: fieldName, ...restField }) => (
              <Card
                key={key}
                style={{
                  marginBottom: 16,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                }}
                className="bg-transparent"
              >
                <Row gutter={[16, 16]}>
                  {input.itemFields?.map((subField, index) => (
                    <Col span={24} key={`${subField.name}-${index}`}>
                      <ReusableInput
                        input={{
                          ...subField,
                          name: subField.name, // Use simple name here
                          fieldKey: [fieldName, subField.name],
                        }}
                        errors={errors}
                        onChange={(fieldName, value) => {
                          // Handle nested field changes
                          const currentValues = form.getFieldValue(name) || [];
                          const updatedSubstance = {
                            ...currentValues[fieldName],
                            [subField.name]: value,
                          };
                          const updatedValues = [...currentValues];
                          updatedValues[fieldName] = updatedSubstance;
                          form.setFieldsValue({
                            [name]: updatedValues,
                          });
                          if (onChange) {
                            onChange(name, updatedValues);
                          }
                        }}
                        form={form}
                        styles={styles}
                      />
                    </Col>
                  ))}
                  <Col span={24}>
                    <Button
                      type="dashed"
                      danger
                      onClick={() => remove(fieldName)}
                      icon={<MinusCircleOutlined />}
                      block
                      style={{ marginTop: 16 }}
                    >
                      Remove {input.label}
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              icon={<PlusOutlined />}
              block
              style={{ marginTop: 16 }}
            >
              Add Another {input.label}
            </Button>
          </>
        )}
      </Form.List>
    );
  };

  const renderSimpleArray = () => {
    return (
      <div>
        {itemFields?.map((option, index) => (
          <ReusableInput
            key={index}
            input={option}
            errors={errors}
            onChange={onChange}
            form={form}
            styles={styles}
            placeholder={option.placeholder}
          />
        ))}
      </div>
    );
  };

  const renderInput = () => {
    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={type}
            placeholder={placeholder}
            style={inputStyle}
            onChange={(e) => handleValueChange(e.target.value)}
            prefix={Icon}
          />
        );

      case "textarea":
        return (
          <TextArea
            placeholder={placeholder}
            style={textareaStyle}
            onChange={(e) => handleValueChange(e.target.value)}
            prefix={Icon}
          />
        );

      case "password":
        return (
          <Input.Password
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
            placeholder={placeholder}
            style={inputStyle}
            onChange={(e) => handleValueChange(e.target.value)}
            prefix={Icon}
          />
        );

      case "select":
        return (
          <Select
            placeholder={placeholder}
            style={selectStyle}
            onChange={handleValueChange}
            dropdownStyle={{
              backgroundColor: "#1e3a8a",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
            prefix={Icon}
          >
            {filteredOptions?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "date":
        return (
          <DatePicker
            placeholder={placeholder}
            style={datePickerStyle}
            format="YYYY-MM-DD"
            onChange={(date, dateString) => {
              // Explicitly convert to Day.js object
              const validDate = date ? dayjs(date) : null;

              handleValueChange(
                validDate ? validDate.format("YYYY-MM-DD") : null
              );
            }}
            prefix={Icon}
          />
        );

      case "radio":
        return (
          <Radio.Group onChange={(e) => handleValueChange(e.target.value)}>
            {filteredOptions?.map((option) => (
              <Radio key={option.value} value={option.value} style={radioStyle}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case "checkbox":
        return (
          <Checkbox.Group onChange={handleValueChange}>
            {filteredOptions?.map((option) => (
              <Checkbox
                key={option.value}
                value={option.value}
                style={checkboxStyle}
              >
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      // case "array":
      //   return renderMultiSubstanceInput();
      case "array":
        return input.multi ? renderMultiInput() : renderSimpleArray();

      case "otp":
        return (
          <Input.OTP
            placeholder={placeholder}
            onChange={handleValueChange}
            inputType="numeric" // or "alphabet" if needed
            length={6} // Set your desired OTP length
            className="custom-otp-input" // For additional custom styling
            style={{
              gap: "16px", // Space between inputs
              width: "100%",
              justifyContent: "center",
            }}
            inputStyle={{
              width: "48px",
              height: "48px",
              fontSize: "20px",
              borderRadius: "8px",
              border: "1px solid #4B5563", // gray-600
              backgroundColor: "#1F2937", // gray-800
              color: "#FFFFFF",
            }}
            formatter={(str) => str.toUpperCase()} // Optional formatter
          />
        );

      case "upload":
        return (
          <Upload
            name={name}
            listType={multiFiles ? "text" : "picture-card"}
            fileList={fileList}
            onChange={(info) => {
              handleChange(info);
              handleValueChange(
                info.fileList.map((file) => file.name).join(", ")
              );
            }}
            beforeUpload={beforeUpload}
            multiple={multiFiles}
            showUploadList
          >
            {multiFiles ? (
              <div style={uploadStyle}>
                <UploadOutlined
                  style={{ fontSize: "20px", marginBottom: "8px" }}
                />
                <div>Upload Files</div>
              </div>
            ) : fileList.length > 0 ? (
              <img
                src={fileList[0]?.url}
                alt="uploaded"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            ) : (
              <div style={uploadStyle}>
                <UploadOutlined
                  style={{ fontSize: "20px", marginBottom: "8px" }}
                />
                <div>Upload Image</div>
              </div>
            )}
          </Upload>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <Form.Item
        label={showLabel ? label : ""}
        name={name}
        rules={[{ required, message: `${placeholder} is required!` }]}
        validateStatus={errors?.[name] ? "error" : ""}
        help={errors?.[name]?.message}
        style={formItemStyle}
        getValueProps={
          (value) =>
            type === "date"
              ? { value: value ? dayjs(value) : "" } // Convert only for date fields
              : { value } // Keep other types as they are
        }
      >
        {renderInput()}
      </Form.Item>
    </>
  );
};

export default ReusableInput;
