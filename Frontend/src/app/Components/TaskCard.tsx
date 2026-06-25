"use client";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useState } from "react";
import { getRealDate } from "../utils/dateFormat";
import { timeCalc } from "../utils/timeCalc";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoader from "./ButtonLoader";
import { deadLineCalc } from "../utils/deadlineCalc";
type Task = {
  id: string;
  title: string;
  description: string;
  addedMs: number;
  createdAt: string;
  updatedAt: string;
  isDone: boolean;
  deadline: string;
  createdBy: User;
  priority: string;
  allTasks: TaskForArray[];
  setAllTasks: React.Dispatch<SetStateAction<TaskForArray[]>>;
};
type TaskForArray = {
  id: string;
  title: string;
  description: string;
  addedMs: number;
  createdAt: string;
  updatedAt: string;
  isDone: boolean;
  deadline: string;
  createdBy: number;
  user: User;
  priority: string;
};
type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  bio: string;
};
function TaskCard({
  id,
  title,
  description,
  deadline,
  addedMs,
  createdAt,
  updatedAt,
  isDone,
  createdBy,
  priority,
  allTasks,
  setAllTasks,
}: Task) {
  const router = useRouter();
  const [vanish, setVanish] = useState<boolean>(false);
  const [markBtn, setMarkBtn] = useState<boolean>(false);
  // console.log("Deadline : ", deadLineCalc(deadline) + " for : ", title);
  const deleteTask = async () => {
    try {
      let response = await fetch(`${baseURL}/task/deletetask/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let deleteData = await response.json();
      //console.log(deleteData);
      if (deleteData.success) {
        //successEmitter(deleteData.message);
        setAllTasks(allTasks.filter((task) => task.id != id));
      } else errorEmitter(deleteData.message);
    } catch (error) {
      console.log(error);
    }
  };
  const updateTask = async (taskId: number) => {
    try {
      if (taskId == Number(id)) {
        setMarkBtn(true);
      }
      let response = await fetch(`${baseURL}/task/updatetask/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          isDone: !isDone,
        }),
      });
      let updateTaskData = await response.json();
      // console.log(updateTaskData);
      if (updateTaskData.success) {
        // successEmitter(updateTaskData.message);
        setAllTasks(
          allTasks.map((task) => {
            if (task.id == id) {
              task.isDone = !task.isDone;
            }
            return task;
          }),
        );
      } else errorEmitter(updateTaskData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setMarkBtn(false);
    }
  };
  return (
    <>
      <div
        style={{
          animation: vanish ? `vanishTask 0.5s linear forwards` : "none",
        }}
        className="w-full my-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        {/* Author */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              onClick={() => router.push("/profile")}
              style={{ cursor: "pointer" }}
              src={
                createdBy.avatar
                  ? createdBy.avatar
                  : `https://www.imanami.com/wp-content/uploads/2016/03/unknown-user.jpg`
              }
              alt="Author"
              className="h-12 w-12 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
            />

            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Created by
              </p>

              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {createdBy.name}
              </h3>
            </div>
          </div>

          {priority == "LOW" ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-300">
              {priority}
            </span>
          ) : priority == "MEDIUM" ? (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
              {priority}
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/20 dark:text-red-300">
              {priority}
            </span>
          )}
        </div>

        {/* Task */}

        <div className="mt-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>

        {/* Details */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Created
            </p>

            <p className="mt-1 font-medium text-zinc-900 dark:text-white">
              {getRealDate(createdAt)}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Deadline
            </p>

            <p className="mt-1 font-medium text-zinc-900 dark:text-white">
              {deadline ? getRealDate(deadline) : "No deadline"}
            </p>
          </div>
        </div>
        {/* Due In */}

        {deadline && !isDone && (
          <div className="mt-4">
            <span
              className={
                deadLineCalc(deadline) > 5
                  ? `inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300`
                  : deadLineCalc(deadline) < 0
                    ? `inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300`
                    : `inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-4 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300`
              }
            >
              ⏳{" "}
              {deadLineCalc(deadline) >= 0
                ? `Task due in ${deadLineCalc(deadline)} days`
                : `Deadline Crossed`}
            </span>
          </div>
        )}
        {/* Status */}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={
              !isDone
                ? `rounded-full bg-orange-500/15 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-300`
                : `rounded-full bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-300`
            }
          >
            {isDone ? "● Completed" : "● Pending"}
          </span>

          <span className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            TASK ID #{id ? id : "Loading ID"}
          </span>
        </div>
        <div className="mt-4 flex justify-end">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Updated {timeCalc(addedMs)}
          </p>
        </div>
        {/* Actions */}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/updatetask/${Number(id)}`)}
            className="rounded-xl bg-zinc-800 dark:bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:hover:bg-indigo-500"
          >
            Edit
          </button>

          <button
            disabled={markBtn}
            onClick={async () => {
              await updateTask(Number(id));
            }}
            className={
              !isDone
                ? `rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600`
                : `rounded-xl bg-yellow-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-600`
            }
          >
            {!isDone ? (
              markBtn ? (
                <>
                  <div className=" flex gap-2 items-center justify-center">
                    Marking as Complete... <ButtonLoader />
                  </div>
                </>
              ) : (
                "Mark as Complete"
              )
            ) : markBtn ? (
              <>
                <div className=" flex gap-2 items-center justify-center">
                  Marking as Incomplete... <ButtonLoader />
                </div>
              </>
            ) : (
              "Mark as Incomplete"
            )}
          </button>

          <button
            onClick={async () => {
              setVanish(true);
              await deleteTask();
            }}
            className="rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default TaskCard;
