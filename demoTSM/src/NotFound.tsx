import { useNavigate } from "react-router";
import { LuArrowLeft, LuHouse } from "react-icons/lu";
import { useAuth } from "./Auth/authStore";

export default function NotFound() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);

  // Send logged-in users back to their workspace, everyone else to login
  const homePath = user ? "/tasks" : "/";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-7xl font-bold tracking-tight text-slate-200">404</span>
        <h1 className="text-2xl font-semibold text-slate-800">Page not found</h1>
        <p className="max-w-sm text-sm text-slate-500">
          The page you're looking for doesn't exist, was moved, or you don't have
          access to it.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-2xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <LuArrowLeft size={16} />
          Go back
        </button>

        <button
          onClick={() => navigate(homePath)}
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <LuHouse size={16} />
          {user ? "Back to Tasks" : "Back to Login"}
        </button>
      </div>
    </div>
  );
}