"use client";

import Link from "next/link";
import { useAllContexts } from "../AllContexts/AllContexts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "lucide-react";
import { baseURL } from "../utils/baseURL";
import ButtonLoader from "./ButtonLoader";

export default function Navbar() {
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    isLogin,
    user,
    setUser,
    setIsLogin,
    setAllTasks,
  } = useAllContexts();
  const [logBtn, setLogBtn] = useState<boolean>(false);
  const fixTheme = () => {
    let htmlTag = document.querySelector("html");
    htmlTag?.classList.remove("dark");
    htmlTag?.classList.remove("light");
    htmlTag?.classList.add(theme);
  };
  const verifyLogin = async () => {
    try {
      let response = await fetch(`${baseURL}/auth/verifylogin/${user?.id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let logData = await response.json();
      if (!logData.success) {
        await logOut();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const logOut = async () => {
    try {
      setLogBtn(true);
      let response = await fetch(`${baseURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let logOutData = await response.json();
      // console.log(logOutData);
      if (logOutData.success) {
        setIsLogin(false);
        setAllTasks([]);
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
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLogBtn(false);
    }
  };
  useEffect(() => {
    fixTheme();
  }, [theme]);

  useEffect(() => {
    if (isLogin) {
      let fetchStatus = async () => {
        await verifyLogin();
      };
      fetchStatus();
    }
  }, [isLogin]);
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}

        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
            ✓
          </div>

          <span className="text-zinc-900 dark:text-white">TaskFlow</span>
        </Link>
        {/* Center Links */}

        {/* Center Logo */}

        <div className="hidden md:flex items-center justify-center flex-1">
          <img
            src="/logo.png"
            alt="TaskFlow Logo"
            className="h-12 w-12 rounded-full object-cover border border-zinc-300 dark:border-zinc-700 shadow-sm"
          />
        </div>
        {/* Right */}

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleTheme()}
            className="rounded-xl border border-black dark:border-indigo-400 p-2 transition bg-zinc-100 dark:hover:bg-zinc-900 hover:bg-gray-50 dark:bg-black"
          >
            {theme == "light" ? (
              <MoonIcon className="text-yellow-500" />
            ) : (
              <SunIcon className="text-yellow-300" />
            )}
          </button>

          {!isLogin ? (
            <Link
              href="/login"
              className="hidden sm:block rounded-xl bg-indigo-600 px-5 py-2 font-medium text-zinc-100 transition hover:bg-indigo-700 dark:text-zinc-100 dark:hover:bg-indigo-700"
            >
              Login
            </Link>
          ) : (
            <button
              disabled={logBtn}
              onClick={async () => {
                await logOut();
              }}
              className="hidden sm:block rounded-xl bg-red-500 px-5 py-2 font-medium text-zinc-100 transition hover:bg-red-700 dark:text-zinc-100 dark:hover:bg-red-700"
            >
              {logBtn ? (
                <>
                  <div className="flex gap-2 items-center justify-center">
                    Logging Out... <ButtonLoader />
                  </div>
                </>
              ) : (
                "Log Out"
              )}
            </button>
          )}

          {!isLogin ? (
            <Link
              href="/signup"
              className="rounded-xl bg-black px-5 py-2 font-semibold text-white transition hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-black"
            >
              Create Account
            </Link>
          ) : (
            <Link
              href="/profile"
              className="rounded-xl bg-black px-5 py-2 font-semibold text-white transition hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-black"
            >
              View Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
