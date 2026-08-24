import Heading from "../components/common/Heading";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { LuFileUp, LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { useTask } from "./store";
import toast from "react-hot-toast";

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Top-level hook calls only — this is what makes the store reactive
  const tasks = useTask((state) => state.tasks);
  const editTask = useTask((state) => state.setEdittask);

  const [task, setTask] = useState({
    taskTitle: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    assignee: "Alice Johnson",
    dueDate: "",
    tags: "",
    file: null as File | null,
  });

  const [notFound, setNotFound] = useState(false);

  // Load existing task whenever the id in the URL changes
  useEffect(() => {
    const existing = tasks.find((t) => t.id === Number(id));

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
      file: existing.file, // keep the existing attachment unless the user picks a new one
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const existing = tasks.find((t) => t.id === Number(id));
    if (!existing) return;

    editTask({
      ...existing,
      taskTitle: task.taskTitle,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate,
      tags: task.tags,
      file: task.file,
    });

    toast.success("Task Updated");
    navigate(`/tasks/${id}`);
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
            onClick={() => navigate("/task")}
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
                {task.file ? task.file.name : "Drop files here or click to upload"}
              </h2>
              <p className="text-sm text-gray-400">
                {task.file
                  ? `${(task.file.size / 1024 / 1024).toFixed(2)} MB`
                  : "PNG, JPG, PDF, DOC up to 25MB"}
              </p>
            </label>
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