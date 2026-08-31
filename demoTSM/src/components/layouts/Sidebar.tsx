import { useState } from "react";
import {
  LuX,
  LuLayoutGrid,
  LuSquareCheck,
  LuCalendar,
  LuUsers,
} from "react-icons/lu";
import Logo from "../common/Logo.tsx";
import { AssigneeAvatar } from "../../tasks/components/AssigneeAvatar.tsx";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../Auth/authStore.ts";
import { LogOut } from "lucide-react";
import Logout from "../forms/logout.tsx";

function Sidebar({ isOpen, onClose }) {
  const user = useAuth((state) => state.user);
  const isAdmin = user?.role === "admin";

  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    onClose?.();
    navigate("/login", { replace: true });
  };

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition";
    return isActive
      ? `${baseClasses} bg-blue-50 text-blue-600`
      : `${baseClasses} text-gray-400 hover:bg-[#f0f4f9] hover:text-[#1f1f1f]`;
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-44 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:static md:translate-x-0 md:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-[61px] pt-2 h-14 items-center justify-between px-4">
          <Logo />
          <LuX
            onClick={onClose}
            size={18}
            strokeWidth={2}
            className="cursor-pointer text-gray-400 md:hidden"
          />
        </div>

        <hr className="border-slate-200" />

        <nav className="flex flex-1 flex-col px-3 pt-6">
          {isAdmin && (
            <NavLink to="/dashboard" onClick={onClose} className={getNavLinkClass}>
              <LuLayoutGrid size={18} strokeWidth={2} />
              <span>Dashboard</span>
            </NavLink>
          )}

          <NavLink to="/newtask" onClick={onClose} className={getNavLinkClass}>
            <LuSquareCheck size={18} strokeWidth={2} />
            <span>Create Task</span>
          </NavLink>

          <NavLink to="/mytasks" onClick={onClose} className={getNavLinkClass}>
            <LuSquareCheck size={18} strokeWidth={2} />
            <span>My Tasks</span>
          </NavLink>

          <NavLink to="/tasks" onClick={onClose} className={getNavLinkClass}>
            <LuSquareCheck size={18} strokeWidth={2} />
            <span>Tasks</span>
          </NavLink>

          <NavLink to="/teams" onClick={onClose} className={getNavLinkClass}>
            <LuUsers size={18} strokeWidth={2} />
            <span>Team</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin/users" onClick={onClose} className={getNavLinkClass}>
              <LuUsers size={18} strokeWidth={2} />
              <span>Manage Users</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin/create-user" onClick={onClose} className={getNavLinkClass}>
              <LuUsers size={18} strokeWidth={2} />
              <span>Create Users</span>
            </NavLink>
          )}

          <NavLink to="/profile" onClick={onClose} className={getNavLinkClass}>
            <LuUsers size={18} strokeWidth={2} />
            <span>Profile</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <button onClick={handleLogoutClick} className="flex justify-between px-5 text-gray-500 pb-2">
          <LogOut size={18} strokeWidth={2} />
          <span>Log OUT</span>
        </button>

        <Logout
          isOpen={showLogoutConfirm}
          title="Log out?"
          message="Are you sure you want to log out? You'll need to sign in again to continue."
          confirmLabel="Log out"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />

        <hr className="border-slate-200" />
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <span className="text-sm font-medium text-gray-400">
            {user ? `${user.fname} ${user.lname[0]}.` : "..."}
          </span>
          <AssigneeAvatar
            fname={user?.fname ?? ""}
            lname={user?.lname ?? ""}
            variant="hidden"
          />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;