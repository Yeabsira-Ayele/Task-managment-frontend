import Heading from "../components/common/Heading";
import { LuFileUp, LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTask } from "./store";
import toast from "react-hot-toast";
import { taskSchema , type TaskFormValues } from "./taskValidation";

export default function NewTask() {
  const createTask = useTask((state) => state.setCreatetask);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
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
      attachments: null,
    },
  });

  const attachments = watch("attachments");

  const backToDashboard = () => {
    navigate("/tasks");
  };

const onSubmit = async (data: TaskFormValues) => {
  try {
    // Send only fields required by TaskFormInput type
    await createTask({
      taskTitle: data.taskTitle,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
      dueDate: data.dueDate,
      tags: data.tags,
    
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
                  className="border border-gray-300 rounded-2xl py-2 px-5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select assignee</option>
                  <option>Alice Johnson</option>
                  <option>Bob Smith</option>
                  <option>Charlie Brown</option>
                  <option>Diana Prince</option>
                </select>
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
              </div>
             
            </div>
          </div>

          {/* ATTACHMENTS */}
          <div className="bg-white rounded-xl pt-6 pb-10 px-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-500">Attachments</h3>
            <Controller
              name="attachments"
              control={control}
              render={({ field: { onChange } }) => (
                <label className="flex flex-col items-center gap-2 mt-4 border-2 border-dashed border-gray-300 p-10 rounded-2xl text-center transition-colors duration-300 hover:border-blue-500 cursor-pointer hover:bg-slate-50">
                  <input
                    type="file"
                    onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  <LuFileUp size={40} className="text-blue-400" />
                  <h2>{attachments ? attachments.name : "Drop files here or click to upload"}</h2>
                  <p className="text-sm text-gray-400">
                    {attachments
                      ? `${(attachments.size / 1024 / 1024).toFixed(2)} MB`
                      : "PNG, JPG, PDF, DOC up to 25MB"}
                  </p>
                </label>
              )}
            />
            {errors.attachments && (
              <span className="text-xs text-red-500">{errors.attachments.message as string}</span>
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