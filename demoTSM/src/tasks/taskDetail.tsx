import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Clock3,
  Paperclip,
  X,
} from "lucide-react";

import { AssigneeAvatar } from "./components/AssigneeAvatar";
import { PriorityIndicator } from "./components/PriorityIndicator";
import { StatusBadge } from "./components/statusBadge";
import { useTask } from "./store";

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tasks = useTask((state) => state.tasks);
  const deleteTask = useTask((state) => state.setDeletetask);

  const task = tasks.find((item) => item.id === Number(id));

  const handleTaskEdit = () => {
    if (!task) return;
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleTaskDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!task) return;
    deleteTask(task.id);
    navigate("/tasks");
  };

  const assigneeName = task?.assignee?.trim() || "";
  const nameParts = assigneeName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  if (!task) {
    return (
      <div>
        <button
          onClick={() => navigate("/task")}
          className="flex items-center gap-2 text-sm text-[#8da2c2] hover:text-[#111827]"
        >
          <ArrowLeft size={18} />
          Back to Tasks
        </button>

        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#111827]">
            Task not found
          </h2>
          <p className="mt-1 text-sm text-[#8da2c2]">
            The task you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:px-20 lg:py-20 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/tasks")}
          className="text-[#8da2c2] transition hover:text-[#111827]"
        >
          <ArrowLeft size={22} strokeWidth={1.8} />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#8da2c2]">Tasks</span>
          <span className="text-[#c5cfdd]">/</span>
          <span className="max-w-[280px] truncate font-medium text-[#111827]">
            Look at the details
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-rows-1 gap-6 lg:grid-rows-[minmax(0,1fr)_400px]">
        {/* LEFT - TASK CONTENT */}
        <div className="rounded-[20px] border border-[#e9edf3] bg-white px-7 py-7 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityIndicator priority={task.priority} />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleTaskEdit}
                className="text-[#91a5c3] transition hover:text-[#1557d6]"
                title="Edit task"
              >
                <Edit2 size={18} strokeWidth={1.8} />
              </button>

              <button
                onClick={handleTaskDelete}
                className="text-red-400 transition hover:text-red-600"
                title="Delete task"
              >
                <Trash2 size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          <h1 className="text-[21px] font-semibold tracking-[-0.3px] text-[#08152f]">
            {task.taskTitle}
          </h1>

          <p className="mt-2 max-w-[850px] text-[14px] leading-6 text-[#91a5c3]">
            {task.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {task.tags &&
              task.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-medium text-[#1557d6]"
                >
                  #{tag.trim()}
                </span>
              ))}
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div className="h-fit rounded-[20px] border border-[#e9edf3] bg-white px-7 py-7 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <h2 className="mb-6 text-lg font-semibold text-[#08152f]">
            Details
          </h2>

          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="text-sm text-[#91a5c3]">Assignee</span>
            <div className="flex items-center gap-2">
              <AssigneeAvatar fname={firstName} lname={lastName} />
              <span className="text-sm font-medium text-[#111827]">
                {task.assignee}
              </span>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="text-sm text-[#91a5c3]">Due Date</span>
            <div className="flex items-center gap-2">
              <Clock3 size={18} strokeWidth={1.8} className="text-[#91a5c3]" />
              <span className="text-sm font-medium text-[#111827]">
                {task.dueDate || "Not set"}
              </span>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="text-sm text-[#91a5c3]">Created</span>
            <span className="text-sm font-medium text-[#111827]">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#91a5c3]">Attachments</span>
            <div className="flex items-center gap-2">
              <Paperclip size={18} strokeWidth={1.8} className="text-[#91a5c3]" />
              <span className="text-sm font-medium text-[#111827]">
                {task.file ? task.file.name : "No files"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#08152f]">
                Delete task?
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-[#91a5c3] hover:text-[#111827]"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-6 text-sm text-[#91a5c3]">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[#111827]">
                "{task.taskTitle}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#8da2c2] transition hover:bg-[#f3f6fa]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetail;


