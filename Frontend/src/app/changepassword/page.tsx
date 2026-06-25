"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAllContexts } from "../AllContexts/AllContexts";
import ButtonLoader from "../Components/ButtonLoader";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
type Doc = {
  currPass: string;
  newPass: string;
};
export default function ChangePasswordPage() {
  const router = useRouter();
  const { btnLoading, setBtnLoading, user } = useAllContexts();
  const [doc, setDoc] = useState<Doc>({
    currPass: "",
    newPass: "",
  });
  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc({ ...doc, [e.target.name]: e.target.value });
  };
  const changePassword = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(`${baseURL}/auth/changepassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(doc),
      });
      const passData = await response.json();
      // console.log(passData);
      if (passData.success) {
        successEmitter(passData.message);
        router.push("/profile");
      } else errorEmitter(passData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
        {/* Header */}

        <div className="border-b border-zinc-200 dark:border-zinc-800 px-8 py-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Change Password
          </h1>

          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Update your account password to keep your account secure.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await changePassword();
          }}
          className="space-y-6 p-8"
        >
          {/* Current Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Current Password
            </label>

            <input
              type="password"
              name="currPass"
              value={doc.currPass}
              onChange={onChangeFunc}
              required
              placeholder="Enter your current password"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          {/* New Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              New Password
            </label>

            <input
              type="password"
              name="newPass"
              value={doc.newPass}
              onChange={onChangeFunc}
              required
              placeholder="Enter your new password"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Password should contain at least 8 characters.
            </p>
          </div>

          {/* Buttons */}

          <div className="flex flex-col gap-4 pt-4 md:flex-row">
            <button
              onClick={() => router.push("/editprofile")}
              type="button"
              disabled={btnLoading}
              className="flex-1 rounded-xl bg-zinc-800 py-3 text-center font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.99]"
            >
              Back
            </button>

            <button
              disabled={btnLoading}
              type="submit"
              className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
            >
              {btnLoading ? (
                <>
                  <div className="flex gap-2 items-center justify-center">
                    Submitting... <ButtonLoader />
                  </div>
                </>
              ) : (
                "Submit"
              )}
            </button>

            <button
              disabled={btnLoading}
              onClick={() => {
                router.push(`/verifypassword`);
              }}
              className="flex-1 rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99]"
            >
              Reset by OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
