import { useUserContext } from "@/context/UserContext";
import { registerFormFields } from "@/lib/constants/constants";

const GeneralSettings = () => {
  const { userData } = useUserContext();
  return (
    <div className="  backdrop-blur-md rounded-2xl   grid grid-cols-2 gap-4 md:p-4 p-0">
      {registerFormFields
        .filter((field) => field.type !== "password")
        .map((field, index) => (
          <div
            key={index}
            className="mb-4 bg-[#111827] backdrop-blur-md  shadow-2xl rounded-lg p-4 transition hover:bg-white/10 "
          >
            <h3 className="text-sm text-gray-300">{field.label}</h3>
            <p className="text-white font-medium">
              {userData?.[field.name] || "—"}
            </p>
          </div>
        ))}
    </div>
  );
};

export default GeneralSettings;
