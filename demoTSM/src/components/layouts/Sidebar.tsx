import {
  LuX,
  LuLayoutGrid,
  LuSquareCheck,
  LuCalendar,
  LuUsers,
} from "react-icons/lu";
import Logo from "../common/Logo.tsx";
import { AssigneeAvatar } from "../../tasks/components/AssigneeAvatar.tsx";
import { NavLink } from "react-router";

function Sidebar({ isOpen, onClose }) {
  // Helper to cleanly swap colors when active vs inactive
  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition";
    
    return isActive
      ? `${baseClasses} bg-blue-50 text-blue-600` // 🔵 Active blue theme
      : `${baseClasses} text-gray-400 hover:bg-[#f0f4f9] hover:text-[#1f1f1f]`; // Inactive hover state
  };

  return (
    <>
      {/* Background Dimming Overlay for Mobile */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar Layout Core Component */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-44 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:static md:translate-x-0 md:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
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

        {/* Links Array Matrix */}
        <nav className="flex flex-1 flex-col px-3 pt-6">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={getNavLinkClass}
          >
            <LuLayoutGrid size={18} strokeWidth={2} />
            <span>Dashboard</span>
          </NavLink>

          
          <NavLink
            to="/mytasks"
            onClick={onClose}
            className={getNavLinkClass}
          >
            <LuCalendar size={18} strokeWidth={2} />
            <span>My Tasks</span>
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={onClose}
            className={getNavLinkClass}
          >
            <LuSquareCheck size={18} strokeWidth={2} />
            <span>Tasks</span>
          </NavLink>

          

          <NavLink 
            to="/teams"
            onClick={onClose}
            className={getNavLinkClass}
          >
            <LuUsers size={18} strokeWidth={2} />
            <span>Team</span>
          </NavLink>
        </nav>

        {/* Profile Details Bottom Block */}
        <hr className=" border-slate-200" />
        <div className="flex items-center gap-3 px-6 py-4 border-b ">
          <span className="text-sm font-medium text-gray-400">
            Yeabsira A.
          </span>
          <AssigneeAvatar fname="Yeabsira" lname="Ayele" variant="hidden" />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
