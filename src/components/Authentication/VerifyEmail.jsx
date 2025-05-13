// "use client";
// import { message } from "antd";
// import { useRouter } from 'next/navigation';
// import React, { useEffect } from "react";
// const VerifyEmail = ({ token }) => {
//   const router = useRouter();
//   useEffect(() => {
//     const verifyEmail = async () => {
//       try {
//         const response = await fetch(`/api/auth/verify-email?token=${token}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
          
//         });
//         const data = await response.json();
//         if (response.ok) {
//           message.success("Email verified successfully:", data);
//           router.push("/login"); // Redirect to login page after successful verification
//         } else {
//           console.error("Error verifying email:", data.error);
//         }
//       } catch (error) {
//         console.error("Error verifying email:", error);
//       }
//     };

//     verifyEmail();
//   }, [token]);
//   return <div>Your email has been successfully verified....</div>;
// };

// export default VerifyEmail;


'use client';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useEffect } from 'react';
import Logo from '@/assets/Logo';

const VerifyEmail = ({ token }) => {
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        const data = await response.json();
        
        if (response.ok) {
          message.success(data.message || 'Email verified successfully!');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          message.error(data.error || 'Email verification failed');
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('An error occurred during verification');
        setTimeout(() => router.push('/'), 2000);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1120] to-[#111827] p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Verifying Your Email
        </h2>
        
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <p className="text-blue-100/80">
          Please wait while we verify your email address...
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;