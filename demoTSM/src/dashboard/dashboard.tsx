import Heading from "../components/common/Heading";
import Card from "../components/common/card";
import { LuNotebook, LuFlag, LuEye , LuCircleCheck , LuCircleAlert, LuSquareCheckBig } from "react-icons/lu";
import { FcRight } from "react-icons/fc";
import Deadline from "./components/Deadline";
import { TaskDonutChart } from "./components/donutchart";
import { BarChartComponent } from "./components/Bar";
import { LineChartComponent } from "./components/linechart";
import { upcoming } from "./data/dashboard";
import { recentActivity } from "./data/dashboard";

const AvatarColors: Record<string, string> = {
  "Sarah Kim": "bg-purple-500",
  "Marcus Johnson": "bg-blue-600",
  "Alex Chen": "bg-amber-500",
  "Emily Rodriguez": "bg-emerald-500",
  "David Park": "bg-red-500",
};
function Dashboard() {
  return (
    <div className="flex flex-col gap-5 w-full bg-slate-50 p-8">

      <Heading
        title="Good morning Alex"
        content="Here's what's happening across your workspace today."
      />
    {/* cards */}
     <div className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-5 gap-4">

  <Card
    title="Total tasks"
    num={109}
    percent="+12%"
    icon={<LuSquareCheckBig   size={18} />}
    forBG="bg-blue-100 text-blue-500"
  />

  <Card
    title="In Progress"
    num={27}
    percent="+5%"
    icon={<LuFlag size={18} />}
    forBG="bg-orange-100 text-orange-500"
  />

  <Card
    title="Completed"
    num={38}
    percent="+18%"
    icon={<LuCircleCheck  size={18} />}
    forBG="bg-green-100 text-green-500"
  />

  <Card
    title="In Review"
    num={4}
    percent="+51%"
    icon={<LuEye  size={18} />}
    forBG="bg-purple-100 text-purple-500"
  />

  <Card
    title="Due Today"
    num={4}
    percent="+91%"
    icon={<LuCircleAlert size={18} />}
    forBG="bg-red-50 text-red-500"
  />

</div>


      {/* Charts */}
      <div className="grid grid-cols-1  lg:grid-cols-5 gap-x-5 gap-y-5">

        {/* 3/5 width */}
        <div className="md:col-span-3 w-full rounded-xl shadow-lg bg-white">
          <LineChartComponent />
        </div>


        {/* 2/5 width */}
        <div className="md:col-span-2 w-full rounded-xl shadow-lg bg-white">
          <TaskDonutChart />
        </div>

      </div>
     
      
    {/* info again */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

  {/* Upcoming Deadlines */}
  
  <div className="col-span-2 w-full   rounded-xl shadow-lg bg-white pt-4">
    <h1 className="text-lg font-bold mb-3 px-4">
      Upcoming Deadlines
    </h1>
    <ul className="flex flex-col">
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
 
  <div className="col-span-1 rounded-xl shadow-lg bg-white p-6  w-full">
    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
    <ul className="space-y-5">
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
        <BarChartComponent />
      </div>

    </div>
  );
}
export default Dashboard;