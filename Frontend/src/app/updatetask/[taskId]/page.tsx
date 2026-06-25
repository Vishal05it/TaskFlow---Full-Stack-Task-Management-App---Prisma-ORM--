"use client";

import { useAllContexts } from "@/app/AllContexts/AllContexts";
import ButtonLoader from "@/app/Components/ButtonLoader";
import Loader from "@/app/Components/Loader";
import { baseURL } from "@/app/utils/baseURL";
import { getRealDate } from "@/app/utils/dateFormat";
import { errorEmitter, successEmitter } from "@/app/utils/emitter";
import { timeCalc } from "@/app/utils/timeCalc";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type Form = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "Loading Priority";
  deadline: string;
  isDone: boolean;
};
type Task = {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "Loading Priority";
  deadline: string;
  isDone: boolean;
  addedMs: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
};

export default function EditTaskPage() {
  console.log("Edit Page Rendered");
  const [form, setForm] = useState<Form>({
    title: "Loading Title...",
    deadline: "Loading Deadline...",
    description: "Loading Description...",
    priority: "Loading Priority",
    isDone: false,
  });
  const [task, setTask] = useState<Task>({
    id: 0,
    title: "",
    deadline: "",
    description: "",
    priority: "MEDIUM",
    isDone: false,
    createdAt: "",
    updatedAt: "",
    createdBy: 0,
    addedMs: 0,
  });
  const onChangFunc = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const param = useParams();
  const {
    pageLoading,
    setPageLoading,
    btnLoading,
    setBtnLoading,
    allTasks,
    setAllTasks,
  } = useAllContexts();
  const router = useRouter();
  const getTask = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(`${baseURL}/task/gettask/${param.taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let taskData = await response.json();
      //console.log(taskData);
      if (taskData.success) {
        // successEmitter(taskData.message);
        setTask(taskData.task);
        setForm(taskData.task);
      } else errorEmitter(taskData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };
  const updateTask = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(`${baseURL}/task/updatetask/${param.taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      let editData = await response.json();
      // console.log(editData);
      if (editData.success) {
        successEmitter(editData.message);
        setForm(editData.task);
        setTask(editData.task);
        setAllTasks(
          allTasks.map((task) => {
            if (task.id == param.taskId) {
              task = editData.task;
            }
            return task;
          }),
        );
        router.push("/");
      } else errorEmitter(editData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  useEffect(() => {
    const fetchTask = async () => {
      await getTask();
    };
    fetchTask();
    return () => {
      console.log("Leaving Page...");
    };
  }, []);
  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-10 transition-colors duration-300">
          <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
            {/* Header */}

            <div className="border-b border-zinc-200 dark:border-zinc-800 px-8 py-6">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Edit Task
              </h1>

              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                Update your task details below.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateTask();
              }}
              className="space-y-6 p-8"
            >
              {/* Title */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={onChangFunc}
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
                  name="description"
                  value={form.description}
                  onChange={onChangFunc}
                  className="w-full resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                />
              </div>

              {/* Priority & Status */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={onChangFunc}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                  >
                    <option value="LOW">🟢 Low</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HIGH">🔴 High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Status
                  </label>

                  <select
                    name="isDone"
                    value={String(form.isDone)}
                    onChange={onChangFunc}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                  >
                    <option value="false">🟠 Incomplete</option>
                    <option value="true">🟢 Complete</option>
                  </select>
                </div>
              </div>

              {/* Deadline */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Deadline
                </label>

                <input
                  type="datetime-local"
                  name="deadline"
                  value={form.deadline}
                  onChange={onChangFunc}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                />
              </div>

              {/* Footer Info */}

              <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <strong>Last Updated:</strong>{" "}
                  {task.addedMs > 0
                    ? timeCalc(task.addedMs)
                    : "Loading Timestamp..."}
                </p>

                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <strong>Created:</strong>{" "}
                  {task.createdAt
                    ? getRealDate(task.createdAt)
                    : "Loading date..."}
                </p>
              </div>

              {/* Buttons */}

              <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                <button
                  disabled={btnLoading}
                  className="flex-1 rounded-xl bg-zinc-800 py-3 text-center font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.99]"
                >
                  Back to Home
                </button>

                <button
                  disabled={btnLoading}
                  type="submit"
                  className="flex-1 rounded-xl bg-green-500 dark:text-white py-3 font-semibold text-black transition hover:opacity-90 active:scale-[0.99]"
                >
                  {btnLoading ? (
                    <>
                      <div className="flex gap-2 items-center justify-center">
                        Saving Changes... <ButtonLoader />
                      </div>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
