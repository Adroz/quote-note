import { SignupForm } from '@/components/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <h1 className="text-center text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
          <Link href="/">QuoteNote</Link>
        </h1>
        <h2 className="mt-3 text-center text-xl text-gray-600 dark:text-gray-400">
          Create a new account
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <SignupForm />
      </div>
    </div>
  );
} 