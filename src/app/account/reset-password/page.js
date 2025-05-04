import ResetPassword from "@/components/Authentication/ResetPassword";

export default function ResetPasswordPage({ searchParams }) {
  const token = searchParams?.token;
  const email = searchParams?.email; // Assuming you're passing userId as 'id' parameter
  return (
    <div className="flex flex-col min-h-screen">
      <ResetPassword token={token} email={email} />
    </div>
  );
}
