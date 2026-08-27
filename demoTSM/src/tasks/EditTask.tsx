import Heading from "../components/common/Heading";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { LuFileUp, LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { useTask } from "./store";
import toast from "react-hot-toast";

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();

  const tasks = useTask((state) => state.tasks);
  const editTask = useTask((state) => state.setEdittask);
  const fetchTasks = useTask((state) => state.fetchTasks); // FIX: needed in case store is empty on direct load/refresh

  const [task, setTask] = useState({
    taskTitle: "",
    description: "",
    status: "",
    priority: "",
    assignee: "",
    dueDate: "",
    tags: "",
    file: null as File | null,
  });

  const [notFound, setNotFound] = useState(false);

  // FIX: fetch tasks if the store is empty (e.g. user landed directly on /tasks/:id/edit via refresh)
  useEffect(() => {
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, [tasks.length, fetchTasks]);

  useEffect(() => {
    // FIX: was `t.id === Number(id)`. Your task ids are Mongo ObjectId strings
    // (e.g. "64f1a2b3c9d4e5f6a7b8c9d0"), and Number() on that string is NaN,
    // so this comparison could never match — every edit page thought the task didn't exist.
    const existing = tasks.find((t) => t.id === id);

    if (!existing) {
      setNotFound(true);
      return;
    }

    setNotFound(false);
    setTask({
      taskTitle: existing.taskTitle,
      description: existing.description,
      status: existing.status,
      priority: existing.priority,
      assignee: existing.assignee,
      dueDate: existing.dueDate,
      tags: existing.tags,
      file: null,
      // FIX: `existing.file` doesn't exist on TaskType — the field is `fileUrl: string | null`,
      // and it's a URL string from the server, not a browser File object. You can't put a URL
      // string into an <input type="file">'s preview logic the same way. Resetting to null here;
      // see the attachments section below for how existing files are now shown.
    });
  }, [id, tasks]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setTask((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // FIX: was `tasks.find((t) => t.id === Number(id))` — same Number() bug as above
    const existing = tasks.find((t) => t.id === id);
    if (!existing || !id) return;

    try {
      // FIX: `editTask` (setEdittask in the store) has the signature
      //   setEdittask: (id: string, updatedTask: TaskFormInput) => Promise<void>
      // but this was calling `editTask({...existing, taskTitle, ...})` — passing a single
      // object as the first arg instead of (id, updates). That means `id` inside the store
      // action would actually receive the whole task object, and `updatedTask` would be
      // undefined — the PATCH request would hit a broken URL and send no body.
      //
      // Also removed `file` from the payload — TaskFormInput doesn't include a `file` field
      // (it's Omit<TaskType, "id" | "createdAt" | "fileUrl">), and your backend controller
      // doesn't currently handle multipart file uploads at all — sending a File object as JSON
      // would either be dropped or serialize to "[object File]". File upload needs its own
      // multipart endpoint (e.g. multer) before this can work; flagging it here rather than
      // silently pretending it's implemented.
      await editTask(id, {
        taskTitle: task.taskTitle,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        dueDate: task.dueDate,
        tags: task.tags,
      });

      toast.success("Task Updated");
      navigate(`/tasks/${id}`);
    } catch (error) {
      toast.error("Failed to update task. Try again!"); // FIX: was missing — silent failure before
    }
  };

  const backToTask = () => {
    navigate(`/tasks/${id}`);
  };

  if (notFound) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-700">Task not found</h2>
          <p className="text-sm text-slate-400 mt-1">
            The task you're trying to edit doesn't exist.
          </p>
          <button
            onClick={() => navigate("/tasks")} // FIX: was "/task" (singular) — not a real route
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-3 bg-slate-50">
      <div className="bg-transparent flex flex-col justify-center gap-4 p-4 rounded-2xl w-full max-w-[700px]">

        {/* Header Section */}
        <div className="flex items-center gap-2">
          <LuArrowLeft
            size={20}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            onClick={backToTask}
          />
          <Heading title="Edit task" content="Update the details below and save your changes" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* BASIC INFO */}
          <div className="bg-white rounded-xl pt-6 pb-10 px-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-500">BASIC INFO</h3>
            <div className="flex flex-col gap-4 mt-4">

              <div className="flex flex-col gap-2">
                <label htmlFor="taskName" className="block text-sm font-medium">
                  Task Name
                </label>
                <input
                  type="text"
                  name="taskTitle"
                  value={task.taskTitle}
                  onChange={handleChange}
                  id="taskName"
                  placeholder="Task Name"
                  className="border border-gray-300 rounded-2xl py-2 px-5 bg-slate-100 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  cols={30}
                  rows={4}
                  value={task.description}
                  onChange={handleChange}
                  placeholder="Add task description here..."
                  className="border border-gray-300 rounded-2xl py-2 px-5 bg-slate-100 text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="bg-white rounded-xl pt-6 pb-10 px-6 shadow-md flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-500">Details</h3>
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-2">
                <label>Status</label>
                <select
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>In Review</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label>Priority</label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label>Assignee</label>
                <select
                  name="assignee"
                  value={task.assignee}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Alice Johnson</option>
                  <option>Bob Smith</option>
                  <option>Charlie Brown</option>
                  <option>Diana Prince</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label>Due Date</label>
                <input
                  name="dueDate"
                  type="date"
                  value={task.dueDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Tags</label>
                <input
                  name="tags"
                  type="text"
                  value={task.tags}
                  onChange={handleChange}
                  placeholder="Ux , Design  , ..."
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ATTACHMENTS */}
          <div className="bg-white rounded-xl pt-6 pb-10 px-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-500">Attachments</h3>
            <label className="flex flex-col items-center gap-2 mt-4 border-2 border-dashed border-gray-300 p-10 rounded-2xl text-center transition-colors duration-300 hover:border-blue-500 cursor-pointer hover:bg-slate-50">
              <input
                type="file"
                name="attachments"
                onChange={handleFileChange}
                className="hidden"
              />
              <LuFileUp size={40} className="text-blue-400" />
              <h2>
                {task.file
                  ? task.file.name
                  : "Drop files here or click to upload"}
              </h2>
              <p className="text-sm text-gray-400">
                {task.file
                  ? `${(task.file.size / 1024 / 1024).toFixed(2)} MB`
                  : "PNG, JPG, PDF, DOC up to 25MB"}
              </p>
            </label>
            {/* FIX: note — file upload isn't wired to the backend yet (no multipart endpoint),
                so selecting a file here currently has no effect on save. Flagging rather than
                silently dropping it, so it's a known TODO instead of a surprise bug later. */}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={backToTask}
              className="border border-gray-300 px-6 py-2 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-6 py-2 rounded-2xl text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}