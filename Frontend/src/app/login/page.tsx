"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAllContexts } from "../AllContexts/AllContexts";
import ButtonLoader from "../Components/ButtonLoader";
type Form = {
  email: string;
  password: string;
};
export default function LoginPage() {
  const { isLogin, setIsLogin, setUser, btnLoading, setBtnLoading } =
    useAllContexts();
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
  });
  let onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const login = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      let loginData = await response.json();
      //console.log(loginData);
      if (loginData.success) {
        successEmitter(loginData.message);
        router.push("/");
        setUser(loginData.user);
        localStorage.setItem("taskUser", JSON.stringify(loginData.user));
        setIsLogin(true);
        localStorage.setItem("isLogin", JSON.stringify(true));
      } else {
        errorEmitter(loginData.message);
        if (loginData.unverified) {
          router.push(`/verifyaccount/${form.email}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-black dark:to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black text-2xl font-bold">
            ✓
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Login to continue managing your tasks.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await login();
          }}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>

            <input
              type="email"
              required
              name="email"
              value={form.email}
              onChange={onChangeFunc}
              placeholder="Enter your email"
              className="w-full rounded-xl border text-black dark:text-white border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 outline-none transition focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>

              <button
                type="button"
                onClick={() => router.push("/forgotpassword")}
                className="text-xs text-zinc-500 hover:text-black dark:hover:text-white transition"
              >
                Forgot Password?
              </button>
            </div>

            <input
              type="password"
              required
              name="password"
              value={form.password}
              onChange={onChangeFunc}
              placeholder="Enter your password"
              className="w-full rounded-xl text-black dark:text-white border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 outline-none transition focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:scale-[1.01] active:scale-[0.98] dark:bg-indigo-600 dark:text-white"
          >
            {btnLoading ? (
              <>
                <div className="flex gap-2 items-center justify-center">
                  Logging In... <ButtonLoader />
                </div>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>

          <span className="mx-4 text-sm text-zinc-500">OR</span>

          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don't have an account?
          <button
            onClick={() => router.push("/signup")}
            className="ml-2 font-semibold text-black dark:text-white hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}
