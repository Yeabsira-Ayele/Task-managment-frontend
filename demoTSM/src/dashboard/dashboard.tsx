import { useEffect, useMemo } from "react"; // FIX: added for fetching + computing stats
import Heading from "../components/common/Heading";
import Card from "../components/common/card";
import { LuNotebook, LuFlag, LuEye, LuCircleCheck, LuCircleAlert, LuSquareCheckBig } from "react-icons/lu";
import { FcRight } from "react-icons/fc";
import Deadline from "./components/Deadline";
import { TaskDonutChart } from "./components/donutchart";
import { BarChartComponent } from "./components/Bar";
import { LineChartComponent } from "./components/linechart";
import { upcoming } from "./data/dashboard";
import { recentActivity } from "./data/dashboard";
import { useTask } from "../tasks/store"; // FIX: needed to read real task data

const AvatarColors: Record<string, string> = {
  "Sarah Kim": "bg-purple-500",
  "Marcus Johnson": "bg-blue-600",
  "Alex Chen": "bg-amber-500",
  "Emily Rodriguez": "bg-emerald-500",
  "David Park": "bg-red-500",
};

function Dashboard() {
  // FIX: pull real tasks + fetch action from the store
  const tasks = useTask((state) => state.tasks);
  const fetchTasks = useTask((state) => state.fetchTasks);

  // FIX: dashboard is often the landing page, so tasks may not be loaded yet
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // FIX: replaces the 5 hardcoded numbers (109, 27, 38, 4, 4) with real counts
  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status.toLowerCase() === "in progress").length;
    const completed = tasks.filter((t) => t.status.toLowerCase() === "completed").length;
    const inReview = tasks.filter((t) => t.status.toLowerCase() === "in review").length;

    const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const dueToday = tasks.filter((t) => t.dueDate === todayStr).length;

    return { total, inProgress, completed, inReview, dueToday };
  }, [tasks]);

  return (
    <div className="flex flex-col gap-5 w-full bg-slate-50 p-8">

      <Heading
        title="Good morning Alex"
        content="Here's what's happening across your workspace today."
      />

      {/* cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

        <Card
          title="Total tasks"
          num={stats.total}
          // FIX: removed percent="+12%" — this was a fabricated trend number.
          // Real % change needs a historical snapshot (e.g. yesterday's/last week's count),
          // which nothing in the backend or store currently tracks. See note below the code.
          icon={<LuSquareCheckBig size={18} />}
          forBG="bg-blue-100 text-blue-500"
        />

        <Card
          title="In Progress"
          num={stats.inProgress}
          icon={<LuFlag size={18} />}
          forBG="bg-orange-100 text-orange-500"
        />

        <Card
          title="Completed"
          num={stats.completed}
          icon={<LuCircleCheck size={18} />}
          forBG="bg-green-100 text-green-500"
        />

        <Card
          title="In Review"
          num={stats.inReview}
          icon={<LuEye size={18} />}
          forBG="bg-purple-100 text-purple-500"
        />

        <Card
          title="Due Today"
          num={stats.dueToday}
          icon={<LuCircleAlert size={18} />}
          forBG="bg-red-50 text-red-500"
        />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-5 gap-y-5">

        {/* 3/5 width */}
        <div className="md:col-span-3 w-full rounded-xl shadow-lg bg-white">
          {/* TODO: LineChartComponent — check whether this reads live task data
              or is still using mock/static data internally. Not touched here
              since I can't see its implementation. */}
          <LineChartComponent />
        </div>

        {/* 2/5 width */}
        <div className="md:col-span-2 w-full rounded-xl shadow-lg bg-white">
          {/* TODO: same as above — TaskDonutChart's data source is unverified */}
          <TaskDonutChart />
        </div>

      </div>

      {/* info again */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Upcoming Deadlines */}
        <div className="col-span-2 w-full rounded-xl shadow-lg bg-white pt-4">
          <h1 className="text-lg font-bold mb-3 px-4">
            Upcoming Deadlines
          </h1>
          <ul className="flex flex-col">
            {/* TODO: `upcoming` is imported from "./data/dashboard" — static mock array,
                not derived from real tasks. A real version would filter `tasks` by
                dueDate within the next N days and map that instead. Not swapped in
                automatically since I don't know the exact shape <Deadline /> expects
                vs what TaskType provides (e.g. no "heading"/"paragraph" fields on TaskType). */}
            {upcoming.map((item, index) => (
              <li key={index}>
                <Deadline
                  heading={item.heading}
                  paragraph={item.paragraph}
                  status={item.status}
                  statusColor={item.status}
                  name={item.name}
                  date={item.date}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="col-span-1 rounded-xl shadow-lg bg-white p-6 w-full">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          <ul className="space-y-5">
            {/* TODO: `recentActivity` is also static mock data. A real activity feed
                would need the backend to log create/update/delete events somewhere
                (e.g. an "activity" collection), which doesn't exist yet. */}
            {recentActivity.map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${AvatarColors[item.name] || 'bg-gray-500'}`}>
                  {(item.name)[0]}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{item.name}</span> {item.activity}
                  </p>
                  <span className="text-xs text-slate-400 mt-0.5">{item.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bar Chart */}
      <div className="w-full rounded-xl shadow-lg bg-white">
        {/* TODO: same data-source caveat as the other two charts */}
        <BarChartComponent />
      </div>

    </div>
  );
}

export default Dashboard;