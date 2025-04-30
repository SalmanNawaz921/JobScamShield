import Register from "@/components/Authentication/Register";
import TwoFactorModal from "@/components/TwoFactorModal/TwoFactorModal";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Register />
      {/* <TwoFactorModal/> */}
    </div>
  );
}
