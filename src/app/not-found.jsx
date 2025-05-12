'use client';
import Link from 'next/link';
import Logo from '@/assets/Logo';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1120] to-[#111827] p-4 text-center">
      <div className="glass-card max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <Logo size="xl" />
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-blue-100/80 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-500 hover:to-indigo-600 transition-all duration-200 shadow-lg"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;