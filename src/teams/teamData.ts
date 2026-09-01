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
  color: string;
  status: 'online' | 'offline';
  tasks: TaskStats;
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Product Manager",
    email: "alex@acme.io",
    initials: "AC",
    color: "#f59e0b",
    status: "online",
    tasks: { total: 3, done: 2, active: 1 }
  },
  {
    id: "2",
    name: "Sarah Kim",
    role: "UX Designer",
    email: "sarah@acme.io",
    initials: "SK",
    color: "#8b5cf6",
    status: "online",
    tasks: { total: 2, done: 1, active: 1 }
  },
  {
    id: "3",
    name: "Marcus Johnson",
    role: "Frontend Dev",
    email: "marcus@acme.io",
    initials: "MJ",
    color: "#1d4ed8",
    status: "offline",
    tasks: { total: 2, done: 0, active: 1 }
  }
];

