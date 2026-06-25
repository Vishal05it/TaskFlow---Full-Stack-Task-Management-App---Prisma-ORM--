"use client";
import { useState } from "react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";
import { useAllContexts } from "../AllContexts/AllContexts";
import ButtonLoader from "../Components/ButtonLoader";
type User = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatar: string;
  bio: string;
};

export default function SignupPage() {
  const { btnLoading, setBtnLoading } = useAllContexts();
  const router = useRouter();
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    avatar: "",
    bio: "",
  });
  const onChangeFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [file, setFile] = useState<File | null | Blob>(null);
  const imageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      formData.append("upload_preset", "task-manager-avatar");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const uploadData = await response.json();
      console.log("Upload data : ", uploadData);
      return uploadData.secure_url;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const signUp = async () => {
    try {
      setBtnLoading(true);
      let tempURL = "";
      if (file) {
        let imageURL = await imageUpload();
        if (imageURL) {
          tempURL = imageURL;
        }
      }
      let response = await fetch(`${baseURL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          avatar: tempURL,
          bio: form.bio,
          phoneNumber: form.phoneNumber,
        }),
      });
      let signUpData = await response.json();
      // console.log(signUpData);
      if (signUpData.success) {
        successEmitter(signUpData.message);
        router.push(`/verifyaccount/${form.email}`);
      } else errorEmitter(signUpData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Welcome! Create your personal task manager account.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await signUp();
          }}
          className="space-y-5"
        >
          <div className="flex justify-center">
            <label className="cursor-pointer">
              <div className="h-28 w-28 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-800 hover:opacity-90 transition">
                <span className="text-sm text-zinc-500">Upload</span>
              </div>

              <input
                type="file"
                onChange={(e) => {
                  if (e.target?.files) {
                    let fileArr = Array.from(e.target.files);
                    setFile(fileArr[0]);
                  }
                }}
                accept="image/*"
                className="hidden text-black dark:text-white"
              />
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name
            </label>

            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={onChangeFunc}
              placeholder="Enter your name"
              className="w-full text-black dark:text-white rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={onChangeFunc}
              placeholder="Enter your email"
              className="w-full text-black dark:text-white rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>

            <input
              type="password"
              required
              name="password"
              value={form.password}
              onChange={onChangeFunc}
              placeholder="Enter password"
              className="w-full text-black dark:text-white rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Bio
            </label>

            <textarea
              rows={3}
              name="bio"
              value={form.bio}
              onChange={onChangeFunc}
              placeholder="Tell us about yourself..."
              className="w-full text-black dark:text-white resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={onChangeFunc}
              placeholder="Optional"
              className="w-full text-black dark:text-white rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <button
            disabled={btnLoading}
            type="submit"
            className="mt-3 w-full rounded-xl bg-black text-white dark:bg-indigo-600 dark:text-white py-3 font-semibold transition hover:scale-[1.01] active:scale-[0.99]"
          >
            {btnLoading ? (
              <>
                <div className="flex gap-2 items-center justify-center">
                  Creating Account... <ButtonLoader />
                </div>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?
          <span className="ml-1 cursor-pointer font-semibold text-black dark:text-white">
            Login
          </span>
        </div>
      </div>
    </div>
  );
}
