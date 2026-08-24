export function PriorityIndicator({ priority }: { priority: string }) {
  const normalized = priority.trim().toLowerCase();
  let dotColor = "bg-gray-400";
  let textColor = "text-gray-500";

  if (normalized === "urgent") { dotColor = "bg-rose-500"; textColor = "text-rose-600"; } 
  else if (normalized === "high") { dotColor = "bg-orange-500"; textColor = "text-orange-600"; } 
  else if (normalized === "medium") { dotColor = "bg-amber-400"; textColor = "text-amber-600"; } 
  else if (normalized === "low") { dotColor = "bg-green-400"; textColor = "text-green-600"; }
  else if (normalized === "urgent") { dotColor = "bg-red-400"; textColor = "text-red-600"; }

  return (
    <div className="flex items-center gap-2 font-bold text-xs">
      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      <span className={textColor}>{priority}</span>
    </div>
  );
}