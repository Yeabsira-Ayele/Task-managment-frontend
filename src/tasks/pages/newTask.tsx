import Heading from "../../components/common/Heading";
import { LuArrowLeft, LuLink, LuX } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useTask } from "../store";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { taskSchema, type TaskFormValues } from "../taskValidation";

type ApiUser = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
};

export default function NewTask() {
  const createTask = useTask((state) => state.setCreatetask);
  const navigate = useNavigate();

  const [users, setUsers] = useState<ApiUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data.data))
      .catch(() => setUsersError("Failed to load team members"))
      .finally(() => setUsersLoading(false));
  }, []);

const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors },
} = useForm<TaskFormValues>({
  resolver: zodResolver(taskSchema),
  defaultValues: {
    taskTitle: "",
    description: "",
    status: "",
    priority: "",
    assignee: "",
    dueDate: "",
    tags: "",
    attachments: [],
  },
});

  const [linkInput, setLinkInput] = useState("");
  const attachments = watch("attachments");

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) return;
    setValue("attachments", [...attachments, trimmed], { shouldValidate: true });
    setLinkInput("");
  };

  const removeLink = (index: number) => {
    setValue(
      "attachments",
      attachments.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const backToDashboard = () => {
    navigate("/tasks");
  };

 const onSubmit = async (data: TaskFormValues) => {
  try {
    await createTask({
      taskTitle: data.taskTitle,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
      dueDate: data.dueDate,
      tags: data.tags,
      attachments: data.attachments,
    });

    toast.success("New Task Created!");
    navigate("/dashboard");
  } catch (error) {
    toast.error("Failed to save task. Try again!");
  }
};
  return (
    <div className="flex justify-center items-center p-3 bg-slate-50">
      <div className="bg-transparent flex flex-col justify-center gap-4 p-4 rounded-2xl w-full max-w-[700px]">
        {/* Header Section */}
        <div className="flex items-center gap-2">
          <LuArrowLeft
            size={20}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            onClick={backToDashboard}
          />
          <Heading title="Create a new task" content="Fill in the details below to create a task" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* BASIC INFO */}
          <div className="bg-white rounded-xl pt-6 pb-10 px-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-500">BASIC INFO</h3>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="taskName" className="block text-sm font-medium">
                  Task Name
                </label>
                <input
                  id="taskName"
                  placeholder="Task Name"
                  {...register("taskTitle")}
                  className="border border-gray-300 rounded-2xl py-2 px-5 bg-slate-100 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.taskTitle && (
                  <span className="text-xs text-red-500">{errors.taskTitle.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Add task description here..."
                  {...register("description")}
                  className="border border-gray-300 rounded-2xl py-2 px-5 bg-slate-100 text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                {errors.description && (
                  <span className="text-xs text-red-500">{errors.description.message}</span>
                )}
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
                  {...register("status")}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>In Review</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                {errors.status && (
                  <span className="text-xs text-red-500">{errors.status.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label>Priority</label>
                <select
                  {...register("priority")}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select priority</option>
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                {errors.priority && (
                  <span className="text-xs text-red-500">{errors.priority.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label>Assignee</label>
                <select
                  {...register("assignee")}
                  disabled={usersLoading}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {usersLoading ? "Loading members..." : "Select assignee"}
                  </option>

                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fname} {user.lname}
                    </option>
                  ))}
                </select>
                {usersError && (
                  <span className="text-xs text-red-500">{usersError}</span>
                )}
                {errors.assignee && (
                  <span className="text-xs text-red-500">{errors.assignee.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label>Due Date</label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dueDate && (
                  <span className="text-xs text-red-500">{errors.dueDate.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label>Tags</label>
                <input
                  type="text"
                  placeholder="Ux , Design  , ..."
                  {...register("tags")}
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.tags && (
                  <span className="text-xs text-red-500">{errors.tags.message}</span>
                )}
              {/* </div> */}
            </div>
          </div>
          </div>

          {/* ATTACHMENTS */}
          <div className="bg-white rounded-xl pt-6 pb-10 px-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-500">Attachments</h3>
            <p className="text-sm text-gray-400 mt-1">
              Paste a shareable link (Google Drive, Dropbox, etc.) — make sure it's set to "Anyone with the link can view."
            </p>

            <div className="flex gap-2 mt-4">
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLink();
                  }
                }}
                className="flex-1 border border-gray-300 rounded-2xl py-2 px-5 bg-slate-100 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addLink}
                className="bg-blue-600 px-5 py-2 rounded-2xl text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>

            {attachments.length > 0 && (
              <ul className="flex flex-col gap-2 mt-4">
                {attachments.map((link, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <LuLink size={16} className="text-blue-400 flex-shrink-0" />
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-blue-600 hover:underline"
                      >
                        {link}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <LuX size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {errors.attachments && (
              <span className="text-xs text-red-500">
                {Array.isArray(errors.attachments)
                  ? errors.attachments[0]?.message
                  : errors.attachments.message}
              </span>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={backToDashboard}
              className="border border-gray-300 px-6 py-2 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-6 py-2 rounded-2xl text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}