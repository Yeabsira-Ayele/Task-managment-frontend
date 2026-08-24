export function StatusBadge({ status }: { status: string }) {
  const normalized = status.trim().toLowerCase();
  let colorClasses = "bg-gray-100 text-gray-600";

  if (normalized === "in progress") colorClasses = "bg-blue-50 text-blue-600";
  if (normalized === "to do") colorClasses = "bg-gray-100 text-gray-500";
  if (normalized === "in review") colorClasses = "bg-purple-50 text-purple-600";
  if (normalized === "completed") colorClasses = "bg-green-50 text-green-600";
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block text-center min-w-[90px] ${colorClasses}`}>
      {status}
    </span>
  );
}