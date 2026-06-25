"use client";
import Image from "next/image";
import { useAllContexts } from "./AllContexts/AllContexts";
import Link from "next/link";
import NotLoggedInPage from "./Components/NotLoginPage";
import { baseURL } from "./utils/baseURL";
import { errorEmitter, successEmitter } from "./utils/emitter";
import Loader from "./Components/Loader";
import { useEffect, useMemo, useState } from "react";
import TaskCard from "./Components/TaskCard";

export default function Home() {
  const {
    isLogin,
    pageLoading,
    setPageLoading,
    allTasks,
    setAllTasks,
    lastPage,
    setLastPage,
  } = useAllContexts();
  const [page, setPage] = useState<number>(1);
  const getAllTasks = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(`${baseURL}/task/getalltasks/${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/josn",
        },
        credentials: "include",
      });
      let tasksData = await response.json();
      //console.log(tasksData);
      if (tasksData.success) {
        // successEmitter(tasksData.message);
        setAllTasks(tasksData.tasks);
        setLastPage(tasksData.lastPage);
      } else errorEmitter(tasksData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };
  useEffect(() => {
    const fetchTasks = async () => {
      await getAllTasks();
    };
    if (isLogin) {
      fetchTasks();
    }
  }, [page]);
  // --------- Filtering & Searching ---------------
  //*******/ Priority Filters : *********
  const [filterPriority, setFilterPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | ""
  >("");
  const [filterStatus, setFilterStatus] = useState<boolean | "">("");
  let completedTasks = useMemo(() => {
    let complete = 0;
    if (allTasks && allTasks.length > 0) {
      let filterArr = allTasks.filter((task) => task.isDone);
      complete = filterArr.length;
    }
    return complete;
  }, [allTasks]);
  const [showTasks, setShowTasks] = useState(allTasks);
  useEffect(() => {
    setShowTasks(allTasks);
  }, [allTasks]);
  const highPriorityTasks = useMemo(() => {
    if (allTasks && allTasks.length > 0) {
      return allTasks.filter((task) => task.priority == "HIGH");
    } else {
      return [];
    }
  }, [allTasks]);
  const mediumPriorityTasks = useMemo(() => {
    if (allTasks && allTasks.length > 0) {
      return allTasks.filter((task) => task.priority == "MEDIUM");
    } else return [];
  }, [allTasks]);
  const lowPriorityTasks = useMemo(() => {
    if (allTasks && allTasks.length > 0) {
      return allTasks.filter((task) => task.priority == "LOW");
    } else return [];
  }, [allTasks]);
  useEffect(() => {
    // console.log("Priority changed : ", filterPriority);
    setFilterStatus("");
    setKeyword("");
    if (filterPriority.toString().length == 0) {
      setShowTasks(allTasks);
    } else if (filterPriority == "HIGH") {
      setShowTasks(highPriorityTasks);
    } else if (filterPriority == "MEDIUM") {
      setShowTasks(mediumPriorityTasks);
    } else if (filterPriority == "LOW") {
      setShowTasks(lowPriorityTasks);
    }
  }, [filterPriority]);
  // ****** Status Filtering *******
  const completedTasksArr = useMemo(() => {
    if (filterStatus == "") {
      return allTasks;
    }
    if (allTasks && allTasks.length > 0) {
      return allTasks.filter((task) => task.isDone);
    } else return [];
  }, [filterStatus]);
  const incompleteTasksArr = useMemo(() => {
    if (filterStatus == "") {
      return allTasks;
    }
    if (allTasks && allTasks.length > 0) {
      return allTasks.filter((task) => !task.isDone);
    } else return [];
  }, [filterStatus]);
  useEffect(() => {
    // console.log("Filter status changed : ", filterStatus);
    setFilterPriority("");
    setKeyword("");
    if (filterStatus.toString().length == 0) {
      setShowTasks(allTasks);
    } else if (filterStatus) {
      setShowTasks(completedTasksArr);
    } else {
      setShowTasks(incompleteTasksArr);
    }
  }, [filterStatus]);
  // ****** Keyword Searching *****
  const [keyword, setKeyword] = useState<string>("");
  let filteredTasks = useMemo(() => {
    if (keyword === "") {
      setShowTasks(allTasks);
    }
    if (allTasks && allTasks.length > 0) {
      return allTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(keyword.toString().toLowerCase()) ||
          task.description
            .toLowerCase()
            .includes(keyword.toString().toLowerCase()),
      );
    } else return [];
  }, [keyword]);
  useEffect(() => {
    setFilterPriority("");
    setFilterStatus("");
    if (keyword.length == 0) {
      setShowTasks(allTasks);
    } else {
      setShowTasks(filteredTasks);
    }
  }, [keyword]);
  useEffect(() => {
    if (!lastPage) {
      setLastPage(1);
    }
  }, []);
  return (
    <>
      {isLogin ? (
        <>
          {pageLoading ? (
            <Loader />
          ) : (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
              {/* Header */}
              <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                  <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      Task Manager
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Organize your day efficiently
                    </p>
                  </div>

                  <Link
                    href="/createtask"
                    className="rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98] dark:bg-green-400 dark:text-black"
                  >
                    + Create Task
                  </Link>
                </div>
              </header>

              {/* Body */}
              <main className="mx-auto max-w-7xl px-6 py-10">
                {/* Stats */}
                <div className="mb-10 grid gap-5 md:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Total Tasks
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-blue-600">
                      {allTasks ? allTasks.length : 0}
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Completed
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-green-600">
                      {completedTasks}
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Pending
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-yellow-500">
                      {allTasks ? allTasks.length - completedTasks : 0}
                    </h2>
                  </div>
                </div>

                {/* Tasks */}
                {/* Search & Filters */}

                <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="grid gap-4 lg:grid-cols-3">
                    {/* Search */}

                    <div className="lg:col-span-1">
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Search Tasks
                      </label>

                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => {
                          setKeyword(e.target.value);
                        }}
                        placeholder="Search by title..."
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                      />
                    </div>

                    {/* Priority */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Filter by Priority
                      </label>

                      <select
                        value={filterPriority}
                        onChange={(e) => {
                          setFilterPriority(
                            e.target.value as "LOW" | "MEDIUM" | "HIGH" | "",
                          );
                        }}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                      >
                        <option value="">All Priorities</option>
                        <option value="HIGH">🔴 High</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="LOW">🟢 Low</option>
                      </select>
                    </div>

                    {/* Status */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Filter by Status
                      </label>

                      <select
                        value={JSON.stringify(filterStatus)}
                        onChange={(e) => {
                          setFilterStatus(JSON.parse(e.target.value));
                        }}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-600"
                      >
                        <option value="">All Status</option>
                        <option value="false">🟠 Incomplete</option>
                        <option value="true">🟢 Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
                {showTasks && showTasks.length > 0 ? (
                  showTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      deadline={task.deadline}
                      priority={task.priority}
                      createdAt={task.createdAt}
                      updatedAt={task.updatedAt}
                      createdBy={task.user}
                      isDone={task.isDone}
                      addedMs={task.addedMs}
                      allTasks={allTasks}
                      setAllTasks={setAllTasks}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-300 bg-white px-6 py-20 text-center dark:border-zinc-700 dark:bg-zinc-900">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 text-5xl dark:bg-zinc-800">
                      📝
                    </div>

                    <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white">
                      No Tasks Yet
                    </h2>

                    <p className="mt-3 max-w-md text-zinc-500 dark:text-zinc-400">
                      Looks like you haven't created any tasks yet. Start
                      organizing your work by creating your first task.
                    </p>

                    <Link
                      href="/createtask"
                      className="mt-8 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black"
                    >
                      Create Your First Task
                    </Link>
                  </div>
                )}
                {/* Pagination */}

                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setPage(page - 1);
                    }}
                    className="rounded-xl bg-zinc-800 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={page == 1} // page === 1
                  >
                    ← Previous
                  </button>

                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Page{" "}
                    <span className="font-bold">
                      {page} of {lastPage ? lastPage : 1}
                    </span>
                  </div>

                  <button
                    disabled={page >= lastPage || lastPage <= 1}
                    className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => {
                      console.log(
                        "Last Page is : ",
                        lastPage + " and page is : ",
                        page,
                      );
                      setPage(page + 1);
                    }}
                  >
                    Next →
                  </button>
                </div>
              </main>
            </div>
          )}
        </>
      ) : (
        <NotLoggedInPage />
      )}
    </>
  );
}
