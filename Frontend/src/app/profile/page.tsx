"use client";

import Link from "next/link";
import { useAllContexts } from "../AllContexts/AllContexts";

export default function ProfilePage() {
  const { user } = useAllContexts();
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        {/* Profile Card */}

        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
          {/* Header */}

          <div className="h-36 bg-linear-to-r from-zinc-900 to-zinc-700"></div>

          {/* Avatar */}

          <div className="-mt-16 flex flex-col items-center px-8">
            <img
              src={
                user.avatar
                  ? user.avatar
                  : `https://www.imanami.com/wp-content/uploads/2016/03/unknown-user.jpg`
              }
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900 object-cover shadow-lg"
            />

            <h1 className="mt-5 text-3xl font-bold text-zinc-900 dark:text-white">
              {user.name}
            </h1>
          </div>

          {/* Info */}

          <div className="mt-10 grid gap-5 px-8 pb-10 md:grid-cols-2">
            {/* Email */}

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                📧 Email
              </p>

              <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white break-all">
                {user.email}
              </p>
            </div>

            {/* Phone */}

            {user.phoneNumber && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  📱 Telephone
                </p>

                <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  +91 {user.phoneNumber}
                </p>
              </div>
            )}

            {/* Bio */}

            {user.bio && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 md:col-span-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  👨‍💻 Bio
                </p>

                <p className="mt-3 leading-7 text-zinc-700 dark:text-zinc-300">
                  {user.bio}
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}

          <div className="flex flex-col gap-4 border-t border-zinc-200 dark:border-zinc-800 px-8 py-6 sm:flex-row">
            <Link
              href="/"
              className="flex-1 rounded-xl bg-zinc-800 py-3 text-center font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.99]"
            >
              Back to Home
            </Link>

            <Link
              href="/editprofile"
              className="flex-1 rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
