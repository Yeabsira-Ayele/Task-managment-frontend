import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Heading from "../../components/common/Heading";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-xl rounded-lg border border-slate-100 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 py-0.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.stroke }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-bold text-slate-800">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

type TasksNumDatum = { day: string; added: number; completed: number };

// FIX: was `import { tasksNum } from "../data/dashboard"` — now takes real data as a prop
export const LineChartComponent = ({ data }: { data: TasksNumDatum[] }) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 h-[400px] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <Heading title="Task Activity" content="Tasks added vs. completed this week" />
        <div className="flex gap-4 text-xs font-medium text-slate-600 pt-1">
          <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-[#eb5025]" /> Added</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-[#2563eb]" /> Completed</div>
        </div>
      </div>

      <div className="flex-1 w-[100%]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#f3f4f6" />
            <XAxis dataKey="day" axisLine={{ stroke: '#94a3b8', strokeWidth: 1 }} tickLine={{ stroke: '#94a3b8' }} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={5} />
            <YAxis axisLine={{ stroke: '#94a3b8', strokeWidth: 1 }} tickLine={{ stroke: '#94a3b8' }} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-5} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1.5 }} />
            <Line type="monotone" dataKey="added" stroke="#eb5025" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Line type="monotone" dataKey="completed" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};