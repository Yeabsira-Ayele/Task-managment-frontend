import NewTask from "./tasks/newTask"
import Tasks from "./tasks/Tasks"
import Dashboard from "./dashboard/dashboard"
import { Route , Routes , Outlet} from "react-router"
 import TaskDetail from "./tasks/taskDetail"
import EditTask from "./tasks/EditTask"
import Login from "./Auth/pages/Login"
import Register from "./Auth/pages/Register"
import Navbar from "./components/layouts/Navbar"
import Sidebar from "./components/layouts/Sidebar"
import Teams from "./teams/team"
import { useState } from "react"
import MyTasks from "./tasks/MyTasks"

function LayoutWithShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // 1. Force the layout wrapper to be exactly the screen height and hide master scrolling
    <div className="flex h-screen w-screen overflow-hidden">
      
      {/* Sidebar handles its own fixed height and internally tracks independent scrolling */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Sticky/Static Top Navbar boundary */}
        <div className="z-40 flex-shrink-0">
          <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        </div>
        
        {/* 2. Enable independent vertical scroll directly inside the main workspace container */}
        <main className="flex-1 overflow-y-auto bg-slate-50 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
function App() {
 
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<Register/>} />

      <Route element={<LayoutWithShell/>} >
      
       <Route path="newTask"  element={<NewTask/>}/>
        <Route path="dashboard" element={<Dashboard/>}/>
      <Route path="tasks" element={<Tasks/>}/>
      <Route path="teams" element={<Teams/>}/>
      <Route path="mytasks" element={<MyTasks/>}/>
        <Route path="/tasks/:id" element={<TaskDetail/>} /> 
      <Route path="/tasks/:id/edit" element={<EditTask />} /> 
      
      </Route>
      
    </Routes>
  )
}

export default App
