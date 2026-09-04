import {
  useEffect,
  useMemo,
  type ChangeEvent,
  type MouseEvent,
} from "react";

import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router";

import Heading from "../../components/common/Heading";
import { PriorityIndicator } from "../components/PriorityIndicator";
import { AssigneeAvatar } from "../components/AssigneeAvatar";
import { KanbanBoard } from "../components/KanbanBoard";

import { useTask, type ViewMode } from "../store";
import { useAuth } from "../../Auth/authStore";

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
  const viewMode = useTask((state) => state.viewMode);

  const setSearchTerm = useTask(
    (state) => state.setsearchTerm
  );

  const setStatusFilter = useTask(
    (state) => state.setstatusFilter
  );

  const setPriorityFilter = useTask(
    (state) => state.setpriorityFilter
  );

  const setViewMode = useTask(
    (state) => state.setViewMode
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

  const handleViewChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setViewMode(e.target.value as ViewMode);
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

      // In kanban view the columns represent status, so the status
      // filter is hidden and treated as not applied.
      const matchesStatus =
        viewMode === "kanban" ||
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
    viewMode,
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
    <div className="flex flex-col gap-4 w-full p-4 sm:p-6">

      <Heading
        title="My Tasks"
        content={headingContent}
      />

      {/* SEARCH + FILTERS */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 shadow-sm bg-white px-4 sm:px-6 py-3 rounded-2xl">

        <div className="flex w-full lg:flex-1 items-center gap-2 border border-gray-300 rounded-2xl px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">

          <LuSearch className="text-gray-500 shrink-0" />

          <input
            type="text"
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by task..."
            className="outline-none text-sm bg-transparent w-full"
          />

        </div>

        <div className="flex flex-wrap gap-3">

          {/* Status filter only makes sense in list view — in kanban the
              columns already split tasks by status. */}
          {viewMode === "list" && (
            <select
              name="status"
              value={statusFilter}
              onChange={handleStatusChange}
              className="flex-1 min-w-[130px] sm:flex-none border border-gray-300 bg-slate-50 rounded-2xl py-2 px-4 sm:px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          )}

          <select
            name="priority"
            value={priorityFilter}
            onChange={handlePriorityChange}
            className="flex-1 min-w-[130px] sm:flex-none border border-gray-300 bg-slate-50 rounded-2xl py-2 px-4 sm:px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            name="view"
            value={viewMode}
            onChange={handleViewChange}
            className="flex-1 min-w-[130px] sm:flex-none border border-gray-300 bg-slate-50 rounded-2xl py-2 px-4 sm:px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="list">Normal</option>
            <option value="kanban">Kanban</option>
          </select>

        </div>
      </div>

      {loading && (
        <div className="p-10 text-center text-gray-400 text-sm font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
          Loading tasks...
        </div>
      )}

      {!loading && error && (
        <div className="p-10 text-center text-red-500 text-sm font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && viewMode === "kanban" && (
        <KanbanBoard tasks={filteredTasks} />
      )}

      {!loading && !error && viewMode === "list" && (
        <>
          {/* Mobile card list (below md) */}
          <ul className="md:hidden flex flex-col gap-3">
            {filteredTasks.map((task) => {
              const tagArray = task.tags
                ? task.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : [];
              const firstName = task.assignee?.fname ?? "";
              const lastName = task.assignee?.lname ?? "";

              return (
                <li
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 active:bg-gray-50 cursor-pointer select-none"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-800 font-bold text-base tracking-tight">
                      {task.taskTitle}
                    </span>
                    <PriorityIndicator priority={task.priority} />
                  </div>

                  {tagArray.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tagArray.map((tag, index) => (
                        <span key={index} className="bg-blue-50/60 text-blue-500/80 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50" onClick={stopRowNavigation}>
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskStatusChange(e, task.id)}
                      className={`text-xs font-semibold rounded-full border px-3 py-1.5 cursor-pointer min-w-[90px] focus:outline-none focus:ring-2 focus:ring-blue-400 ${getStatusClasses(task.status)}`}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-semibold tracking-wider">
                      <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatDueDate(task.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AssigneeAvatar fname={firstName} lname={lastName} />
                    <span className="text-xs text-slate-500 truncate">{lastName}</span>
                  </div>
                </li>
              );
            })}

            {filteredTasks.length === 0 && (
              <li className="p-10 text-center text-gray-400 text-sm font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
                {myTasks.length === 0
                  ? "You have no tasks assigned."
                  : "No tasks match your search or filters."}
              </li>
            )}
          </ul>

          {/* Desktop grid-table (md and up) */}
          <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">

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
                        {lastName}
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
          </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MyTasks;
