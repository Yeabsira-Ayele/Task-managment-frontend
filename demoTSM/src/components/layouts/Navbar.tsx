import Btn from "../common/Btn";
import { LuSearch, LuMenu } from "react-icons/lu";
import { useNavigate } from "react-router"; 
import { useAuth } from "../../Auth/authStore";
// 1. ACCEPT THE PROP FROM THE LAYOUT PARENT
function Navbar({ onOpenSidebar }) {
  const navigate = useNavigate();
  
  const user = useAuth((state) => state.user);
  const isAdmin = user?.role === "admin";
  const handleNewTask = () => {
    navigate("/newtask"); 
  };

  return (
    <nav className="flex items-center md:justify-end justify-between border-b border-slate-200 bg-white px-4 py-3">
      {/* Mobile Menu - Trigger parent function */}
      <LuMenu
        onClick={onOpenSidebar} 
        size={22}
        strokeWidth={2}
        className="text-gray-400 md:hidden cursor-pointer"
      />

      

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <Btn variant="primary" type="button" onClick={handleNewTask}>
          New Task
        </Btn>
      </div>
    </nav>
  );
}


export default Navbar;
