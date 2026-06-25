"use client";

import { useAllContexts } from "@/app/AllContexts/AllContexts";
import ButtonLoader from "@/app/Components/ButtonLoader";
import { baseURL } from "@/app/utils/baseURL";
import { errorEmitter, successEmitter } from "@/app/utils/emitter";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyAccountPage() {
  const { btnLoading, setBtnLoading } = useAllContexts();
  const [resend, setResend] = useState<boolean>(false);
  let router = useRouter();
  const [otp, setOtp] = useState("");
  let param = useParams();
  const requestOTP = async () => {
    try {
      let response = await fetch(`${baseURL}/auth/sendotp/${param.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/josn",
        },
      });
      let otpData = await response.json();
      // console.log(otpData);
      if (otpData.success) {
        successEmitter(otpData.message);
      } else errorEmitter(otpData.message);
    } catch (error) {
      console.log(error);
    }
  };
  let verifyAccount = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(
        `${baseURL}/auth/verifyaccount/${param.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otpUser: otp,
          }),
        },
      );
      let verifyData = await response.json();
      //console.log(verifyData);
      if (verifyData.success) {
        successEmitter(verifyData.message);
        router.push("/login");
      } else errorEmitter(verifyData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  // useEffect(() => {
  //   let fetchOTP = async () => {
  //     await requestOTP();
  //   };
  //   fetchOTP();
  // }, []);
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Verify Account
          </h1>

          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            We've sent a 5-digit verification code to your email.
            <br />
            Enter it below to activate your account.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await verifyAccount();
          }}
          className="mt-8 space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Enter OTP
            </label>

            <input
              type="number"
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-center text-2xl tracking-[0.5em] text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none"
            />
          </div>
          <button
            disabled={resend || btnLoading}
            type="submit"
            className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:scale-[1.01] active:scale-[0.99] dark:bg-indigo-600 dark:text-white"
          >
            {btnLoading ? (
              <>
                <div className="flex gap-2 items-center justify-center">
                  Verifying Account... <ButtonLoader />
                </div>
              </>
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            disabled={resend || btnLoading}
            onClick={async (e) => {
              setResend(true);
              await requestOTP();
              setResend(false);
            }}
            type="reset"
            className="text-sm font-medium text-zinc-100 transition py-2 px-4 rounded-2xl hover:bg-emerald-700 dark:text-zinc-100 dark:hover:text-white bg-emerald-500"
          >
            {resend ? (
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
      </div>
    </div>
  );
}
