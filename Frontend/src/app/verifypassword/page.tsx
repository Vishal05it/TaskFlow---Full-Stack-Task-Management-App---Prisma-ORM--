"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAllContexts } from "../AllContexts/AllContexts";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { baseURL } from "../utils/baseURL";
import { useState } from "react";
import ButtonLoader from "../Components/ButtonLoader";
type Doc = {
  otpUser: number;
  password: string;
};
export default function ResetPasswordOTPPage() {
  const router = useRouter();
  const { user, btnLoading, setBtnLoading } = useAllContexts();
  const [submitBtn, setSubmitBtn] = useState<boolean>(false);
  const [doc, setDoc] = useState<Doc>({
    otpUser: 0,
    password: "",
  });
  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc({ ...doc, [e.target.name]: e.target.value });
  };
  let requestOTP = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(
        `${baseURL}/auth/sendotpforpassword/${user.email}`,
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
      } else errorEmitter(otpData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  const resetPassword = async () => {
    try {
      setSubmitBtn(true);
      if (!doc.password) {
        errorEmitter("Enter a new password first!");
        return;
      }
      if (doc.password.trim().length < 8) {
        errorEmitter("Password must be atleast 8 characters long");
        return;
      }
      let response = await fetch(
        `${baseURL}/auth/resetpasswordbyotp/${user.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doc),
        },
      );
      let resetData = await response.json();
      // console.log(resetData);
      if (resetData.success) {
        successEmitter(resetData.message);
        router.push("/editprofile");
      } else errorEmitter(resetData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitBtn(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}

        <div className="border-b border-zinc-200 px-8 py-6 dark:border-zinc-800">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Reset Password by OTP
          </h1>

          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Enter the OTP sent to your email along with your new password.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await resetPassword();
          }}
          className="space-y-6 p-8"
        >
          {/* OTP */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Enter OTP
            </label>

            <input
              type="text"
              name="otpUser"
              value={doc.otpUser}
              onChange={onChangeFunc}
              required
              placeholder="Enter the 6-digit OTP"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-zinc-600"
            />

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              The OTP is valid for 2 minutes.
            </p>
          </div>

          {/* New Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Enter New Password
            </label>

            <input
              type="password"
              name="password"
              value={doc.password}
              onChange={onChangeFunc}
              required
              placeholder="Enter your new password"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-zinc-600"
            />

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Password must contain at least 8 characters.
            </p>
          </div>

          {/* Buttons */}

          <div className="flex flex-col gap-4 pt-4 md:flex-row">
            <button
              onClick={() => router.push("/changepassword")}
              disabled={btnLoading || submitBtn}
              className="flex-1 rounded-xl bg-zinc-800 py-3 text-center font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.99]"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={btnLoading || submitBtn}
              className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
            >
              {submitBtn ? (
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
              type="button"
              onClick={async () => {
                await requestOTP();
              }}
              disabled={btnLoading || submitBtn}
              className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99]"
            >
              {btnLoading ? (
                <>
                  <div className="flex gap-2 items-center justify-center">
                    Sending OTP... <ButtonLoader />
                  </div>
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
