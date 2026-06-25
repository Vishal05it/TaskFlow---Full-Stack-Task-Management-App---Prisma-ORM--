"use client";

import Link from "next/link";
import { useState } from "react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";
import { useAllContexts } from "../AllContexts/AllContexts";
import ButtonLoader from "../Components/ButtonLoader";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const { btnLoading, setBtnLoading } = useAllContexts();
  let requestOTP = async () => {
    try {
      setBtnLoading(true);
      if (!email.trim()) {
        errorEmitter("Enter an email first");
        return;
      }
      let response = await fetch(
        `${baseURL}/auth/sendotpforpassword/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      let otpData = await response.json();
      if (otpData.success) {
        successEmitter(otpData.message);
        router.push(`/resetpassword/${email}`);
      } else errorEmitter(otpData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-8">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-4xl">
            🔑
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Forgot Password?
          </h1>

          <p className="mt-3 text-zinc-500 dark:text-zinc-400 leading-7">
            Enter your registered email address and we'll send you an OTP to
            reset your password.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await requestOTP();
          }}
          className="mt-8 space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-black dark:bg-indigo-600 py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
          >
            {btnLoading ? (
              <>
                <div className="flex gap-2 justify-center items-center">
                  Sending OTP... <ButtonLoader />
                </div>
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Remember your password?
          </p>

          <Link
            href="/login"
            className="mt-3 inline-block font-semibold text-black dark:text-white hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
