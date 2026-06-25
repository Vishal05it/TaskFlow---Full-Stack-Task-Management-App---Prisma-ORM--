"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-10 text-center">
        <div className="flex justify-center">
          <div className="h-28 w-28 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-6xl">
            ⚠️
          </div>
        </div>

        <h1 className="mt-8 text-5xl font-bold text-zinc-900 dark:text-white">
          Oops!
        </h1>

        <h2 className="mt-3 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Something went wrong
        </h2>

        <p className="mt-5 text-zinc-500 dark:text-zinc-400 leading-7">
          An unexpected error occurred while processing your request. Please try
          again in a few moments. If the problem persists, refresh the page or
          return to the dashboard.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-black dark:bg-white dark:text-black text-white px-6 py-3 font-semibold transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-6 py-3 font-semibold text-zinc-900 dark:text-white transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV == "production" && (
          <div className="mt-10 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Error: <span className="font-semibold">{error.message}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
