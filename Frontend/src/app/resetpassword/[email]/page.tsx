"use client";

import { useAllContexts } from "@/app/AllContexts/AllContexts";
import ButtonLoader from "@/app/Components/ButtonLoader";
import Loader from "@/app/Components/Loader";

import { baseURL } from "@/app/utils/baseURL";
import { errorEmitter, successEmitter } from "@/app/utils/emitter";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const {
    btnLoading,
    setBtnLoading,
    setIsLogin,
    setUser,
    user,
    isLogin,
    pageLoading,
    setPageLoading,
    setAllTasks,
  } = useAllContexts();

  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<number | string>("");
  const param = useParams();
  const resetPassword = async () => {
    try {
      if (!password) {
        errorEmitter("Enter a new password first!");
        return;
      }
      if (password.trim().length < 8) {
        errorEmitter("Password must be atleast 8 characters long");
        return;
      }
      setBtnLoading(true);
      let response = await fetch(
        `${baseURL}/auth/resetpasswordbyotp/${param.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otpUser: otp,
            password,
          }),
        },
      );
      let resetData = await response.json();
     // console.log(resetData);
      if (resetData.success) {
        successEmitter(resetData.message);
        router.push("/login");
      } else errorEmitter(resetData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  //
  const verifyLogin = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(`${baseURL}/auth/verifylogin/${user?.id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let logData = await response.json();
      if (logData.success) {
        //
      } else {
        logOut();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };
  const logOut = async () => {
    try {
      let response = await fetch(`${baseURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let logOutData = await response.json();
      console.log(logOutData);
      if (logOutData.success) {
        setIsLogin(false);
        localStorage.removeItem("isLogin");
        setUser({
          id: "",
          name: "",
          bio: "",
          email: "",
          phoneNumber: "",
          avatar: "",
        });
        localStorage.removeItem("taskUser");
        setAllTasks([]);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isLogin) {
      let fetchStatus = async () => {
        await verifyLogin();
      };
      fetchStatus();
    }
  }, [isLogin]);
  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 py-10 transition-colors duration-300">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-8">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-4xl">
                🔒
              </div>
            </div>

            <div className="mt-6 text-center">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Reset Password
              </h1>

              <p className="mt-3 text-zinc-500 dark:text-zinc-400 leading-7">
                Enter your new password and the OTP sent to your registered
                email address.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await resetPassword();
              }}
              className="mt-8 space-y-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  New Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Enter OTP
                </label>

                <input
                  type="number"
                  maxLength={5}
                  value={otp}
                  onChange={(e) => setOtp(Number(e.target.value))}
                  placeholder="5-digit OTP"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-center tracking-[0.35em] text-lg font-semibold text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => router.push("/forgotpassword")}
                  disabled={btnLoading}
                  className="flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-800 py-3 text-center font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.99]"
                >
                  Cancel
                </button>

                <button
                  disabled={btnLoading}
                  type="submit"
                  className="flex-1 rounded-xl bg-black py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
                >
                  {btnLoading ? (
                    <>
                      <div className="flex gap-2 items-center justify-center">
                        Resettong Password... <ButtonLoader />
                      </div>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                OTP expired?
              </p>

              <button
                type="button"
                className="mt-3 font-semibold text-black dark:text-white hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
