"use client";

import Link from "next/link";
import { useAllContexts } from "../AllContexts/AllContexts";
import { useState } from "react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";
import ButtonLoader from "../Components/ButtonLoader";

export default function EditProfilePage() {
  const { user, btnLoading, setBtnLoading, setUser } = useAllContexts();
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [bio, setBio] = useState<string>(user.bio);
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber);
  const [file, setfile] = useState<File | null | Blob>(null);
  const router = useRouter();
  const editProfile = async () => {
    try {
      setBtnLoading(true);
      let tempURL = "";
      if (file) {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "task-manager-avatar");
        let response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        let uploadData = await response.json();
        console.log("Image : ", uploadData);
        tempURL = uploadData.secure_url;
      }

      let response = await fetch(`${baseURL}/auth/editprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          avatar: tempURL ? tempURL : "",
          name,
          phoneNumber,
          bio,
        }),
      });
      let editProfileData = await response.json();
      if (editProfileData.success) {
        // console.log(editProfileData);
        // successEmitter(editProfileData.message);
        setUser(editProfileData.user);
        localStorage.setItem("taskUser", JSON.stringify(editProfileData.user));
        router.push("/profile");
      } else errorEmitter(editProfileData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
        {/* Header */}

        <div className="border-b border-zinc-200 dark:border-zinc-800 px-8 py-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Edit Profile
          </h1>

          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Update your personal information.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await editProfile();
          }}
          className="space-y-6 p-8"
        >
          {/* Avatar */}

          <div className="flex flex-col items-center">
            <img
              src={
                user.avatar
                  ? user.avatar
                  : `https://www.imanami.com/wp-content/uploads/2016/03/unknown-user.jpg`
              }
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border-4 border-zinc-200 dark:border-zinc-700 shadow-md"
            />

            <label className="mt-4 cursor-pointer rounded-xl bg-zinc-800 px-5 py-2.5 font-semibold text-white transition hover:bg-zinc-700">
              Change Avatar
              <input
                onChange={(e) => {
                  if (e.target.files) {
                    let fileArr = Array.from(e.target.files);
                    setfile(fileArr[0]);
                  }
                }}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name
            </label>

            <input
              type="text"
              required
              placeholder="Enter Name..."
              value={name ? name : ""}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>

            <input
              type="email"
              required
              placeholder="Enter Email..."
              value={email ? email : ""}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          {/* Bio */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Bio
            </label>

            <textarea
              rows={4}
              placeholder="Enter bio..."
              value={bio ? bio : ""}
              onChange={(e) => {
                setBio(e.target.value);
              }}
              className="w-full resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone Number
            </label>

            <input
              type="text"
              value={phoneNumber ? phoneNumber : ""}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              placeholder="Enter phone number ( without +91 )"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          {/* Buttons */}

          <div className="flex flex-col gap-4 pt-4 md:flex-row">
            <button
              type="button"
              disabled={btnLoading}
              onClick={() => router.push("/changepassword")}
              className="flex-1 rounded-xl bg-orange-600 py-3 text-center font-semibold text-white transition hover:bg-orange-500 active:scale-[0.99]"
            >
              Change Password Instead
            </button>

            <button
              type="reset"
              onClick={() => router.push("/profile")}
              disabled={btnLoading}
              className="flex-1 rounded-xl bg-zinc-800 py-3 text-center font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.99]"
            >
              Back
            </button>

            <button
              disabled={btnLoading}
              type="submit"
              className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
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
          </div>
        </form>
      </div>
    </div>
  );
}
