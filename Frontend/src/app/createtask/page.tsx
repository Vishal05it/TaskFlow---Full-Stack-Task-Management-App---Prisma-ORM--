"use client";

import Link from "next/link";
import { useState } from "react";
import { baseURL } from "../utils/baseURL";
import { useAllContexts } from "../AllContexts/AllContexts";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";
import ButtonLoader from "../Components/ButtonLoader";

export default function CreateTaskPage() {
  const { allTasks, setAllTasks, btnLoading, setBtnLoading } = useAllContexts();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const createTask = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(`${baseURL}/task/createtask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          deadline,
          priority,
        }),
      });
      let newTaskData = await response.json();
      // console.log(newTaskData);
      if (newTaskData.success) {
        // successEmitter(newTaskData.message);
        setTitle("");
        setDeadline("");
        setDescription("");
        setPriority("MEDIUM");
        setAllTasks((prev) => [...prev, newTaskData.task]);
        router.push("/");
      } else errorEmitter(newTaskData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-4xl">
            📝
          </div>

          <h1 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white">
            Create New Task
          </h1>

          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Stay organized by creating a new task for yourself.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createTask();
          }}
          className="mt-8 space-y-6"
        >
          {/* Title */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details about this task..."
              className="w-full resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          {/* Deadline */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Deadline
            </label>

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            />
          </div>

          {/* Priority */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
              }
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
            >
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </select>
          </div>

          {/* Buttons */}

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <button
              disabled={btnLoading}
              onClick={() => router.push("/")}
              className="flex-1 rounded-xl bg-zinc-800 py-3 dark:bg-gray-600 text-center font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.99]"
            >
              Back to Home
            </button>

            <button
              type="submit"
              disabled={btnLoading}
              className="flex-1 rounded-xl py-3 bg-indigo-600 font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
            >
              {btnLoading ? (
                <>
                  <div className="flex gap-2 items-center justify-center">
                    Creating Task... <ButtonLoader />
                  </div>
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="text-red-500">*</span> Title is required. All other
            fields are optional.
          </p>
        </div>
      </div>
    </div>
  );
}
