"use client";
import { useForm } from "antd/es/form/Form";
import { formStyles } from "@/lib/styles/formStyles";
import ReusableInput from "../ReusableInput/ReusableInput";
import { Form } from "antd";

const ReusableForm = ({
  inputs,
  formTitle,
  submitText = "Submit",
  formType = "default", // 'authentication' or 'default'
  showLabel = true,
  onSubmit = () => {}, // Default to an empty function
}) => {
  const [form] = useForm();

  // Check if we should show first two inputs inline
  const shouldShowInline = formType === "authentication" && inputs.length > 2;
  const firstTwoInputs = shouldShowInline ? inputs.slice(0, 2) : [];
  const remainingInputs = shouldShowInline ? inputs.slice(2) : inputs;

  return (
    <div>
      {formTitle && <h2 className={formStyles.title}>{formTitle}</h2>}

      <Form
        form={form}
        className={formStyles.form}
        onFinish={() => {
          onSubmit(form.getFieldsValue());
        }}
      >
        {/* First two inputs inline for auth forms */}
        {shouldShowInline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firstTwoInputs.map((input) => (
              <ReusableInput
                key={input.name}
                input={input}
                form={form}
                styles={{
                  primary: "#9333EA",
                  secondary: "#6B21A8",
                  text: "#9CA3AF",
                  background: "#1F2937",
                  border: "#4B5563",
                  accent: "#10B981",
                  error: "#EF4444",
                  label: "#9CA3AF",
                }}
                showLabel={showLabel} // Pass showLabel prop to ReusableInput
              />
            ))}
          </div>
        )}

        {/* Remaining inputs */}
        {remainingInputs.map((input) => (
          <ReusableInput
            key={input.name}
            input={input}
            form={form}
            styles={{
              primary: "#9333EA",
              secondary: "#6B21A8",
              text: "#9CA3AF",
              background: "#1F2937",
              border: "#4B5563",
              accent: "#10B981",
              error: "#EF4444",
              label: "#9CA3AF",
            }}
            showLabel={showLabel} // Pass showLabel prop to ReusableInput
          />
        ))}

        <button type="submit" className={formStyles.button}>
          {submitText}
        </button>
      </Form>
    </div>
  );
};

export default ReusableForm;
