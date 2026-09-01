import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import Heading from "../../components/common/Heading";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-3 mt-3">
    {payload.map((entry: any) => (
      <div key={entry.value} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-sm text-gray-600">{entry.value}</span>
      </div>
    ))}
  </div>
);

type StatusDatum = { name: string; value: number };

// FIX: was `import { taskStatus } from "../data/dashboard"` — now takes real data as a prop
export const TaskDonutChart = ({ data }: { data: StatusDatum[] }) => {
  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl bg-white shadow-lg p-5 h-[400px] flex flex-col">
      <Heading title="Task Status" content="Overview of current tasks" />

      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
              {data.map((item, index) => (
                <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
            <p className="text-sm text-gray-500">Tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};