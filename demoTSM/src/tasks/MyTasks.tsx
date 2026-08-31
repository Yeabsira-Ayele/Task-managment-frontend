import {
  useEffect,
  useMemo,
  type ChangeEvent,
  type MouseEvent,
} from "react";

import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router";

import Heading from "../components/common/Heading";
import { PriorityIndicator } from "./components/PriorityIndicator";
import { AssigneeAvatar } from "./components/AssigneeAvatar";

import { useTask } from "./store";
import { useAuth } from "../Auth/authStore";

const formatDueDate = (dueDate: string) => {
  if (!dueDate) return "No date";

  const parsed = new Date(dueDate);

  if (isNaN(parsed.getTime())) {
    return "No date";
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function getStatusClasses(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized === "in progress") {
    return "bg-blue-50 text-blue-600 border-blue-200";
  }

  if (normalized === "to do") {
    return "bg-gray-100 text-gray-500 border-gray-200";
  }

  if (normalized === "in review") {
    return "bg-amber-50 text-amber-600 border-amber-200";
  }

  if (normalized === "completed") {
    return "bg-green-50 text-green-600 border-green-200";
  }

  if (normalized === "cancelled") {
    return "bg-red-50 text-red-600 border-red-200";
  }

  return "bg-gray-100 text-gray-600 border-gray-200";
}

function MyTasks() {
  const navigate = useNavigate();

  // -----------------------------
  // AUTH
  // -----------------------------

  const currentUser = useAuth((state) => state.user);

  // -----------------------------
  // TASK STORE
  // -----------------------------

  const tasks = useTask((state) => state.tasks);
  const fetchTasks = useTask((state) => state.fetchTasks);

  const loading = useTask((state) => state.loading);
  const error = useTask((state) => state.error);

  const searchTerm = useTask((state) => state.searchTerm);
  const statusFilter = useTask((state) => state.statusFilter);
  const priorityFilter = useTask((state) => state.priorityFilter);

  const setSearchTerm = useTask(
    (state) => state.setsearchTerm
  );

  const setStatusFilter = useTask(
    (state) => state.setstatusFilter
  );

  const setPriorityFilter = useTask(
    (state) => state.setpriorityFilter
  );

  const updateTaskStatus = useTask(
    (state) => state.updateTaskStatus
  );

  // -----------------------------
  // FETCH TASKS
  // -----------------------------

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser, fetchTasks]);

  // -----------------------------
  // DEBUG
  // -----------------------------

  useEffect(() => {
    console.log("========== MY TASKS DEBUG ==========");
    console.log("Current user:", currentUser);
    console.log("Current user ID:", currentUser?.id);
    console.log("Current user email:", currentUser?.email);
    console.log("All tasks:", tasks);

    tasks.forEach((task) => {
      console.log("TASK:", task.taskTitle);
      console.log("Task assignee:", task.assignee);
      console.log("Task assignee ID:", task.assignee?.id);
      console.log(
        "MATCH:",
        task.assignee?.id === currentUser?.id
      );
    });

    console.log("====================================");
  }, [currentUser, tasks]);

  // -----------------------------
  // MY TASKS
  // -----------------------------

  const myTasks = useMemo(() => {
    if (!currentUser?.id) {
      return [];
    }

    return tasks.filter(
      (task) => task.assignee?.id === currentUser.id
    );
  }, [tasks, currentUser?.id]);

  // -----------------------------
  // COUNTS
  // -----------------------------

  const totalTasks = myTasks.length;

  const completedTasks = myTasks.filter(
    (task) =>
      task.status.trim().toLowerCase() === "completed"
  ).length;

  const headingContent =
    `${totalTasks} tasks · ${completedTasks} completed`;

  const headerCss =
    "w-full text-gray-400 uppercase font-bold text-xs tracking-wider";

  // -----------------------------
  // SEARCH
  // -----------------------------

  const handleSearchChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(e.target.value);
  };

  // -----------------------------
  // FILTERS
  // -----------------------------

  const handleStatusChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  const handlePriorityChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setPriorityFilter(e.target.value);
  };

  const toSlug = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, "-");

  // -----------------------------
  // FILTERED TASKS
  // -----------------------------

  const filteredTasks = useMemo(() => {
    return myTasks.filter((task) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        task.taskTitle
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "" ||
        toSlug(task.status) === statusFilter;

      const matchesPriority =
        priorityFilter === "" ||
        toSlug(task.priority) === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    myTasks,
    searchTerm,
    statusFilter,
    priorityFilter,
  ]);

  // -----------------------------
  // STATUS UPDATE
  // -----------------------------

  const handleTaskStatusChange = (
    e: ChangeEvent<HTMLSelectElement>,
    taskId: string
  ) => {
    updateTaskStatus(taskId, e.target.value);
  };

  const stopRowNavigation = (
    e: MouseEvent
  ) => {
    e.stopPropagation();
  };

  // -----------------------------
  // AUTH LOADING
  // -----------------------------

  if (!currentUser) {
    return (
      <div className="flex flex-col gap-4 w-full p-6">
        <div className="p-10 text-center text-gray-400 text-sm font-medium">
          Loading your tasks...
        </div>
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="flex flex-col gap-4 w-full p-6">

      <Heading
        title="My Tasks"
        content={headingContent}
      />

      {/* SEARCH + FILTERS */}

      <div className="flex justify-between shadow-sm gap-3 bg-white px-6 py-3 rounded-2xl">

        <div className="flex flex-1 items-center gap-2 border border-gray-300 rounded-2xl px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">

          <LuSearch className="text-gray-500" />

          <input
            type="text"
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by task..."
            className="outline-none text-sm bg-transparent"
          />

        </div>

        <div className="flex gap-5">

          <select
            name="status"
            value={statusFilter}
            onChange={handleStatusChange}
            className="border border-gray-300 bg-slate-50 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="to-do">To Do</option>
            <option value="in-progress">
              In Progress
            </option>
            <option value="in-review">
              In Review
            </option>
            <option value="completed">
              Completed
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>

          <select
            name="priority"
            value={priorityFilter}
            onChange={handlePriorityChange}
            className="border border-gray-300 bg-slate-50 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

        </div>
      </div>

      {/* TABLE */}

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">

        <div className="min-w-[900px] flex flex-col pt-4">

          <div className="grid grid-cols-6 pl-6 pr-4 w-full pb-4 border-b border-gray-100 items-center">

            <h4 className={`${headerCss} col-span-2`}>
              TASK
            </h4>

            <h3 className={`${headerCss} col-span-1`}>
              STATUS
            </h3>

            <h3 className={`${headerCss} col-span-1`}>
              PRIORITY
            </h3>

            <h4 className={`${headerCss} col-span-1`}>
              ASSIGNEE
            </h4>

            <h3 className={`${headerCss} col-span-1`}>
              DUE DATE
            </h3>

          </div>

          {loading && (
            <div className="p-10 text-center text-gray-400 text-sm font-medium">
              Loading tasks...
            </div>
          )}

          {!loading && error && (
            <div className="p-10 text-center text-red-500 text-sm font-medium">
              {error}
            </div>
          )}

          {!loading && !error && (
            <ul className="divide-y divide-gray-50/70">

              {filteredTasks.map((task) => {

                const tagArray = task.tags
                  ? task.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  : [];

                const firstName =
                  task.assignee?.fname ?? "";

                const lastName =
                  task.assignee?.lname ?? "";

                return (
                  <li
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="grid grid-cols-6 pl-6 pr-4 w-full py-5 items-center hover:bg-gray-50 cursor-pointer select-none transition-colors"
                  >

                    {/* TASK */}

                    <div className="col-span-2 flex flex-col gap-2 pr-4">

                      <span className="text-slate-800 font-bold text-base tracking-tight">
                        {task.taskTitle}
                      </span>

                      <div className="flex items-center gap-2 text-gray-400 text-xs">

                        {tagArray.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-50/60 text-blue-500/80 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}

                      </div>

                    </div>

                    {/* STATUS */}

                    <div
                      className="col-span-1"
                      onClick={stopRowNavigation}
                    >

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleTaskStatusChange(
                            e,
                            task.id
                          )
                        }
                        className={`text-xs font-semibold rounded-full border px-3 py-1.5 cursor-pointer text-center min-w-[90px] focus:outline-none focus:ring-2 focus:ring-blue-400 ${getStatusClasses(
                          task.status
                        )}`}
                      >
                        <option value="To Do">
                          To Do
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="In Review">
                          In Review
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>

                    </div>

                    {/* PRIORITY */}

                    <div className="col-span-1">
                      <PriorityIndicator
                        priority={task.priority}
                      />
                    </div>

                    {/* ASSIGNEE */}

                    <div className="col-span-1 flex items-center gap-2">

                      <AssigneeAvatar
                        fname={firstName}
                        lname={lastName}
                      />

                      <span className="text-xs text-slate-500 truncate">
                        {firstName} {lastName}
                      </span>

                    </div>

                    {/* DUE DATE */}

                    <div className="col-span-1 flex items-center gap-1.5 text-gray-400 text-[11px] font-semibold tracking-wider">

                      <svg
                        className="w-3.5 h-3.5 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>

                      <span>
                        {formatDueDate(task.dueDate)}
                      </span>

                    </div>

                  </li>
                );
              })}

              {filteredTasks.length === 0 && (
                <li className="p-10 text-center text-gray-400 text-sm font-medium">

                  {myTasks.length === 0
                    ? "You have no tasks assigned."
                    : "No tasks match your search or filters."}

                </li>
              )}

            </ul>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyTasks;