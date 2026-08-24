import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Keep theme after refresh
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);


  const toggleTheme = () => {
    const newTheme = !dark;

    setDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };


  return (
    <button
      onClick={toggleTheme}
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        text-gray-600
        transition-all
        duration-300
        hover:bg-gray-100
        hover:text-gray-900

        dark:text-gray-300
        dark:hover:bg-gray-800
        dark:hover:text-white
      "
    >
      {dark ? (
        <FaSun className="text-lg rotate-0 transition-transform duration-300" />
      ) : (
        <FaMoon className="text-lg transition-transform duration-300" />
      )}
    </button>
  );
}

export default ThemeToggle;