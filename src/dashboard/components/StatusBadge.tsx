
// Using (string & {}) preserves IDE autocomplete while still allowing any string
type BadgeStatus = "Upcoming" | "Completed" | "Cancelled" | "Progress" | "Done" | "Review" | "To do" | (string & {});

interface StatusBadgeProps {
  status: BadgeStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  // Explicitly typing the record prevents indexing errors
  const colors: Record<string, string> = {
    Progress: "bg-blue-100 text-blue-700",
    Review: "bg-orange-100 text-orange-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Done: "bg-green-100 text-green-700",
    Upcoming: "bg-purple-100 text-purple-700",
    "To do": "bg-indigo-100 text-indigo-700",
    Cancelled: "bg-gray-100 text-gray-700",
  };

  // Determine the display text logically
  const displayText = status === "Progress" || status === "Review" 
    ? `In ${status}` 
    : status;

  return (
    <span 
      className={`flex inline-flex items-center gap-1.5 rounded-full px-4 py-0.5 text-sm font-semibold ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {displayText}
    </span>
  );
}

export default StatusBadge;
