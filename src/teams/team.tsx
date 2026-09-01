import { useEffect, useMemo, useState } from "react";
import Heading from "../components/common/Heading";
import api from "../api/axios";
import { useTask } from "../tasks/store";

type ApiUser = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: "admin" | "member";
};

const AVATAR_COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function colorFor(userId: string) {
  const index = userId.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function TeamMemberCard({ user, stats }: { user: ApiUser; stats: { total: number; done: number; active: number } }) {
  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const initials = `${user.fname[0] ?? ""}${user.lname[0] ?? ""}`.toUpperCase();

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: colorFor(user._id) }}
            >
              {initials}
            </div>

            <div className="text-left">
              <h3 className="text-sm font-semibold text-slate-800">{user.fname} {user.lname}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 mb-6">
          <div className="flex-1 rounded-xl bg-slate-50 py-3 text-center">
            <div className="text-lg font-bold text-slate-800">{stats.total}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Total</div>
          </div>
          <div className={`flex-1 rounded-xl bg-slate-50 py-3 text-center ${stats.done === 0 ? 'opacity-40' : ''}`}>
            <div className="text-lg font-bold text-slate-800">{stats.done}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Done</div>
          </div>
          <div className="flex-1 rounded-xl bg-slate-50 py-3 text-center">
            <div className="text-lg font-bold text-slate-800">{stats.active}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Active</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
            <span>Completion rate</span>
            <span className="font-bold text-slate-800">{completionRate}%</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Teams() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true); // FIX: renamed from `loading` to distinguish from task loading
  const [error, setError] = useState<string | null>(null);

  const tasks = useTask((state) => state.tasks);
  const tasksLoading = useTask((state) => state.loading); // FIX: was ignored — page could render "0 tasks" before tasks even arrived
  const fetchTasks = useTask((state) => state.fetchTasks);

  useEffect(() => {
    fetchTasks();
    api.get("/users")
      .then((res) => setUsers(res.data.data))
      .catch(() => setError("Failed to load team members"))
      .finally(() => setUsersLoading(false));
  }, [fetchTasks]);

  const statsByUser = useMemo(() => {
    const map: Record<string, { total: number; done: number; active: number }> = {};
    for (const user of users) {
      // FIX: was `t.assignee === user._id` — task.assignee is now a populated
      // { id, fname, lname } object (or null), not a plain id string. Comparing
      // an object to a string with `===` is always false, so every card silently
      // showed 0 total/done/active regardless of real data. Now compares the
      // nested `.id` field, with a null-guard for tasks whose assignee was deleted.
      const userTasks = tasks.filter((t) => t.assignee?.id === user._id);
      map[user._id] = {
        total: userTasks.length,
        done: userTasks.filter((t) => t.status.toLowerCase() === "completed").length,
        active: userTasks.filter((t) => t.status.toLowerCase() !== "completed" && t.status.toLowerCase() !== "cancelled").length,
      };
    }
    return map;
  }, [users, tasks]);

  // FIX: wait for both users AND tasks before rendering, so stats aren't
  // computed against a still-empty tasks array and briefly show all zeros.
  if (usersLoading || tasksLoading) {
    return <div className="p-10 text-center text-gray-400">Loading team...</div>;
  }
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Heading
        title="Teams"
        content={`${users.length} team member${users.length === 1 ? "" : "s"}`}
      />

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {users.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 text-sm">No team members yet.</p>
        ) : (
          users.map((user) => (
            <TeamMemberCard key={user._id} user={user} stats={statsByUser[user._id] ?? { total: 0, done: 0, active: 0 }} />
          ))
        )}
      </div>
    </div>
  );
}