import { useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router";

import Heading from "../../components/common/Heading";
import { useTask } from "../store";
import { useAuth } from "../../Auth/authStore";
import api from "../../api/axios";
import { Link as LinkIcon, X } from "lucide-react";

type User = {
  _id: string;
  fname: string;
  lname: string;
};

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editTask = useTask((state) => state.setEdittask);
  const currentUser = useAuth((state) => state.user);

  const [task, setTask] = useState({
    taskTitle: "",
    description: "",
    status: "",
    priority: "",
    assignee: "",
    dueDate: "",
    tags: "",
    attachments: [] as string[],
  });

  const [linkInput, setLinkInput] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) return;
    setTask((prev) => ({ ...prev, attachments: [...prev.attachments, trimmed] }));
    setLinkInput("");
  };

  const removeLink = (index: number) => {
    setTask((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleLinkKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLink();
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const res = await api.get("/users");
        setUsers(res.data?.data ?? []);
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        setUsersError(err?.response?.data?.error ?? "Failed to load users");
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/task/${id}`);
        const existing = res.data?.data;

        if (!existing) {
          setError("Task not found");
          return;
        }

        setTask({
          taskTitle: existing.taskTitle ?? "",
          description: existing.description ?? "",
          status: existing.status ?? "",
          priority: existing.priority ?? "",
          assignee: existing.assignee?.id ?? existing.assignee?._id ?? "",
          dueDate: existing.dueDate ? existing.dueDate.slice(0, 10) : "",
          tags: Array.isArray(existing.tags) ? existing.tags.join(", ") : existing.tags ?? "",
          attachments: Array.isArray(existing.attachments) ? existing.attachments : [],
        });
      } catch (err: any) {
        console.error("Failed to fetch task:", err);
        setError(err?.response?.data?.error ?? "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const isAdmin = currentUser?.role === "admin";
  const isOwner = task.assignee !== "" && task.assignee === currentUser?.id;
  const canEditFully = isAdmin;
  const canEditAtAll = isAdmin || isOwner;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);
      setError(null);

      const payload = canEditFully
        ? {
            taskTitle: task.taskTitle,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignee: task.assignee,
            dueDate: task.dueDate,
            tags: task.tags,
            attachments: task.attachments,
          }
        : { status: task.status };

      await editTask(id, payload as any);
      navigate(`/tasks/${id}`);
    } catch (err: any) {
      console.error("Failed to update task:", err);
      setError(err?.response?.data?.error ?? "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="p-10 text-center text-gray-400">Loading task...</div>
      </div>
    );
  }

  if (error && !task.taskTitle) {
    return (
      <div className="w-full p-6">
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!canEditAtAll) {
    return (
      <div className="w-full p-6">
        <div className="p-10 text-center text-gray-500">
          You don't have permission to edit this task.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <Heading title="Edit Task" content="Update task information" />

      {!canEditFully && (
        <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 text-sm">
          You can only update the status of this task. Other fields are shown for reference and are locked.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="taskTitle" className="text-sm font-semibold text-gray-700">Task Title</label>
            <input
              id="taskTitle"
              name="taskTitle"
              type="text"
              value={task.taskTitle}
              onChange={handleChange}
              required
              disabled={!canEditFully}
              className="border border-gray-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="assignee" className="text-sm font-semibold text-gray-700">Assignee</label>
            <select
              id="assignee"
              name="assignee"
              value={task.assignee}
              onChange={handleChange}
              disabled={usersLoading || !canEditFully}
              required
              className="border border-gray-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{usersLoading ? "Loading members..." : "Select assignee"}</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.fname} {user.lname}</option>
              ))}
            </select>
            {usersError && <span className="text-xs text-red-500">{usersError}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-semibold text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={task.status}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="priority" className="text-sm font-semibold text-gray-700">Priority</label>
            <select
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
              disabled={!canEditFully}
              className="border border-gray-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Select priority</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dueDate" className="text-sm font-semibold text-gray-700">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={task.dueDate}
              onChange={handleChange}
              required
              disabled={!canEditFully}
              className="border border-gray-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tags" className="text-sm font-semibold text-gray-700">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={task.tags}
              onChange={handleChange}
              placeholder="frontend, react, dashboard"
              disabled={!canEditFully}
              className="border border-gray-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            rows={5}
            required
            disabled={!canEditFully}
            className="border border-gray-300 rounded-2xl px-4 py-3 text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <label className="text-sm font-semibold text-gray-700">Attachments</label>

          {canEditFully && (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={handleLinkKeyDown}
                className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addLink}
                className="px-5 py-2 rounded-2xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          )}

          {task.attachments.length > 0 ? (
            <ul className="flex flex-col gap-2 mt-2">
              {task.attachments.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-2 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <LinkIcon size={16} className="text-blue-400 flex-shrink-0" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-blue-600 hover:underline"
                    >
                      {link}
                    </a>
                  </div>
                  {canEditFully && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-sm text-gray-400 italic mt-1">No attachments</span>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="px-6 py-3 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTask;