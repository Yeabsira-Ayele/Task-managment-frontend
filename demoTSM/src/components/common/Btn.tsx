import type { ReactNode } from 'react';

type Btnprops = {
  content?: ReactNode;
  onClick?: () => void;
  variant: "primary" | "secondary";
  children?: ReactNode;
  type?: "button" | "submit" | "reset"; // Added missing type prop
  disabled?: boolean;                    // Added missing disabled prop
};

// Destructured type and disabled here
function Btn({ content, onClick, variant, children, type = "button", disabled }: Btnprops) {

  const variants = {
    primary: "bg-blue-600 font-semibold text-sm text-white transition hover:bg-blue-700",
    secondary: "bg-transparent font-medium border border-gray-200 hover:bg-sky-50"
  };

  return (
    <button
      type={type}          // Attached type to native button
      disabled={disabled}  // Attached disabled to native button
      className={`flex items-center py-2 justify-center gap-2 px-4 py-1  font-bold rounded-md w-full min-w-[75px]
        ${variants[variant]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} // Added a basic style helper for the loading/disabled state
      onClick={onClick}
    >
      {content} {children}
    </button>
  );
}

export default Btn;
