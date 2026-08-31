import { useMemo } from "react";

const AVATAR_COLORS = [
  "bg-purple-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-red-400",
  "bg-yellow-400",
  "bg-pink-400",
  "bg-indigo-400",
  "bg-orange-400",
] as const;

interface AssigneeAvatarProps {
  fname: string;
  lname: string;
  /** Tailwind classes applied to the name label. Pass "hidden" to show avatar only. */
  variant?: string;
}

/**
 * Deterministically picks a color from the palette based on the person's
 * full name, so the same person always gets the same avatar color.
 */
function getAvatarColor(seed: string): string {
  const hash = Array.from(seed).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(fname: string, lname: string): string {
  const first = fname.trim().charAt(0).toUpperCase();
  const last = lname.trim().charAt(0).toUpperCase();
  return `${first}${last}` || "?";
}

export function AssigneeAvatar({
  fname,
  lname,
  variant = "text-gray-400 text-xs font-medium",
}: AssigneeAvatarProps) {
  const initials = useMemo(() => getInitials(fname, lname), [fname, lname]);

  const displayName = useMemo(() => {
    const name = fname.trim();
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
  }, [fname]);

  const bgClassColor = useMemo(
    () => getAvatarColor(`${fname}${lname}`),
    [fname, lname]
  );

  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <div
        role="img"
        aria-label={`${fname} ${lname}`.trim()}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${bgClassColor}`}
      >
        {initials}
      </div>

      {/* Name */}
      {variant !== "hidden" && (
        <span className={variant}>{displayName}</span>
      )}
    </div>
  );
}