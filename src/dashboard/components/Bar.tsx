import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip,
} from "recharts";
import Heading from "../../components/common/Heading";

type MemberTaskDatum = { name: string; work: number; Done: number };

// FIX: was `import { memberTask } from "../data/dashboard"` — now receives real
// data as a prop from useDashboardData(), computed from live tasks.
export const BarChartComponent = ({ data }: { data: MemberTaskDatum[] }) => {
  return (
    <div className="rounded-xl bg-white shadow-lg p-5 h-[400px] flex flex-col">
      <Heading title="Team Workload" content="Tasks assigned vs. completed per member" />

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%" barGap={4} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: "20px" }} />
            <Tooltip cursor={{ fill: "#f3f4f6" }} />
            <Bar dataKey="work" name="To Do" fill="#eb5025" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Done" name="Done" fill="#2563eb" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};













