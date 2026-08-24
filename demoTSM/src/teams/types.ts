// types.ts
export interface TaskStats {
  total: number;
  done: number;
  active: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
  color: string; // Hex color code or Tailwind arbitrary class
  status: 'online' | 'offline';
  tasks: TaskStats;
}
