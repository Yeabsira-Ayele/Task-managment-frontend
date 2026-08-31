import NewTask from "./tasks/newTask"
import Tasks from "./tasks/Tasks"
import Dashboard from "./dashboard/dashboard"
import { Route, Routes, Outlet, Navigate } from "react-router"
import TaskDetail from "./tasks/taskDetail"
import EditTask from "./tasks/EditTask"
import Login from "./Auth/pages/Login"
import Navbar from "./components/layouts/Navbar"
import Sidebar from "./components/layouts/Sidebar"
import Teams from "./teams/team"
import { useState } from "react"
import MyTasks from "./tasks/MyTasks"
import { useAuth } from "./Auth/authStore"
import api from "./api/axios"
import UserManagement from "./teams/userManagment"
import NotFound from "./NotFound"
import Profile from "./teams/profile"
import ResetPassword from "./Auth/pages/resetPassword"
import ForgotPassword from "./Auth/pages/forgotPassword"
import CreateUser from "./teams/CreateUser"

const persistedToken = useAuth.getState().token;
if (persistedToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${persistedToken}`;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth((state) => state.user);
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/mytasks" replace />;
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth((state) => state.user);
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function LayoutWithShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="z-40 flex-shrink-0">
          <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        </div>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<ProtectedRoute><LayoutWithShell /></ProtectedRoute>}>
        <Route path="newTask" element={<NewTask />} />
        <Route path="dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="teams" element={<Teams />} />
        <Route path="mytasks" element={<MyTasks />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="tasks/:id/edit" element={<EditTask />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="admin/create-user" element={<AdminRoute><CreateUser /></AdminRoute>} />
      </Route>
    </Routes>
  )
}

export default App