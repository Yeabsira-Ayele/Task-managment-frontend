
const avatarColors = [
  "bg-purple-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-red-400",
  "bg-yellow-400",
  "bg-pink-400",
  "bg-indigo-400",
  "bg-orange-400",
];

interface AssigneeAvatarProps {
  fname: string;
  lname: string;
  variant?: string;
}

export function AssigneeAvatar({
  fname,
  lname,
  variant = "text-gray-400 text-xs font-medium",
}: AssigneeAvatarProps) {
  const initials = `${fname.charAt(0).toUpperCase()}${lname
    .charAt(0)
    .toUpperCase()}`;

  const name = fname.toLowerCase();

  const bgClassColor =
    avatarColors[Math.floor(Math.random() * avatarColors.length)];
  const variant1 = "hidden"
  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${bgClassColor}`}
      >
        {initials}
      </div>

      {/* Name */}
      <span className={variant}>
        {name}
      </span>
    </div>
  );
}
