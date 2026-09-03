import { useEffect, useMemo } from "react";
import Heading from "../../components/common/Heading";
import Card from "../../components/common/card";
import { LuFlag, LuEye, LuCircleCheck, LuCircleAlert, LuSquareCheckBig } from "react-icons/lu";
import Deadline from "../components/Deadline";
import { TaskDonutChart } from "../components/donutchart";
import { BarChartComponent } from "../components/Bar";
import { LineChartComponent } from "../components/linechart";
import { useTask } from "../../tasks/store";
import { useDashboardData } from "../data/dashboard";

function Dashboard() {
  const tasks = useTask((state) => state.tasks);
  const fetchTasks = useTask((state) => state.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const { taskStatus, memberTask, upcoming, tasksNum } = useDashboardData();

  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status.toLowerCase() === "in progress").length;
    const completed = tasks.filter((t) => t.status.toLowerCase() === "completed").length;
    const inReview = tasks.filter((t) => t.status.toLowerCase() === "in review").length;
    const todayStr = new Date().toISOString().slice(0, 10);
    const dueToday = tasks.filter((t) => t.dueDate === todayStr).length;
    return { total, inProgress, completed, inReview, dueToday };
  }, [tasks]);

  return (
    <div className="flex flex-col gap-5 w-full bg-slate-50 p-8">
      <Heading title="Good morning" content="Here's what's happening across your workspace today." />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card title="Total tasks" num={stats.total} icon={<LuSquareCheckBig size={18} />} forBG="bg-blue-100 text-blue-500" />
        <Card title="In Progress" num={stats.inProgress} icon={<LuFlag size={18} />} forBG="bg-orange-100 text-orange-500" />
        <Card title="Completed" num={stats.completed} icon={<LuCircleCheck size={18} />} forBG="bg-green-100 text-green-500" />
        <Card title="In Review" num={stats.inReview} icon={<LuEye size={18} />} forBG="bg-purple-100 text-purple-500" />
        <Card title="Due Today" num={stats.dueToday} icon={<LuCircleAlert size={18} />} forBG="bg-red-50 text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-5 gap-y-5">
        <div className="md:col-span-3 w-full rounded-xl shadow-lg bg-white">
          <LineChartComponent data={tasksNum} />
        </div>
        <div className="md:col-span-2 w-full rounded-xl shadow-lg bg-white">
          <TaskDonutChart data={taskStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="col-span-2 w-full rounded-xl shadow-lg bg-white pt-4">
          <h1 className="text-lg font-bold mb-3 px-4">Upcoming Deadlines</h1>
          <ul className="flex flex-col">
            {upcoming.length === 0 && (
              <li className="px-4 pb-4 text-sm text-gray-400">No upcoming deadlines.</li>
            )}
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

        {/* Recent Activity — removed. No activity log exists in the backend
            (nothing tracks who-did-what-when beyond createdAt/updatedAt on tasks/users),
            so this card can't be populated with real data yet. Building it for real
            needs a small `Activity` collection + log calls in the task controller —
            say the word and I'll scaffold that as its own feature. */}
      </div>

      <div className="w-full rounded-xl shadow-lg bg-white">
        <BarChartComponent data={memberTask} />
      </div>
    </div>
  );
}

export default Dashboard;