"use client";

import Link from "next/link";

export default function NotLoggedInPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-10 text-center">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-5xl">
            🔒
          </div>
        </div>

        <h1 className="mt-8 text-4xl font-bold text-zinc-900 dark:text-white">
          You're Not Logged In
        </h1>

        <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-7">
          Please log in to access your personal dashboard, manage tasks, and
          stay organized.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-xl bg-black dark:bg-white dark:text-black text-white px-6 py-3 font-semibold transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-6 py-3 font-semibold text-zinc-900 dark:text-white transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-10 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Your tasks and account data are securely stored and available once
            you're signed in.
          </p>
        </div>
      </div>
    </div>
  );
}
