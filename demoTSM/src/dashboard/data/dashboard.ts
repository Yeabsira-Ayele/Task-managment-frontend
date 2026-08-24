export interface UpcomingTask {
  heading: string;
  paragraph: string;
  status: string;
  name: string;
  date: string;
   // Optional string format
}

export const upcoming: UpcomingTask[] = [
  {
    paragraph: "Redesign user onboarding flow",
    heading: "design",
    status: "Progress",
    name: "as",
    date: "2025-07-22",
  },
  {
    paragraph: "Implement OAuth2 authentication",
    heading: "development",
    status: "Review",
    name: "y",
    date: "2025-07-25", // Added missing date
  },
  {
    paragraph: "Q3 Marketing Campaign Planning",
    heading: "Research",
    status: "To do",
    name: "g",
    date: "2025-07-28", // Added missing date
  },
  ,
  {
    paragraph: "User research interviews — Round 2",
    heading: "marketing",
    status: "Review",
    name: "s",
    date: "2025-07-28", // Added missing date
  },
  ,
  {
    paragraph: "Release notes for v2.4",
    heading: "Docs",
    status: "To do",
    name: "k",
    date: "2025-07-28", // Added missing date
  },
];

export interface memeberTaskProps{
  name:string ;
    work:number ;
    Done: number ;
}
export const memberTask = [{
  name: "Alice" ,
  work: 3 ,
  Done: 17 ,
} , {
  name: "Dani" ,
  work: 12 ,
  Done: 3 ,
} , {
  name: "Marta" ,
  work: 5 ,
  Done: 4 ,

} , {
  name:"Dinka" ,
  work: 18,
  Done: 13 ,
}] ;

export interface tasksNumProps{
  day: string ;
  added: number ;
  completed: number ;
}

export const tasksNum = [{
   day: "Mon" ,
  added: 5 ,
  completed: 6 ,
} , {
   day: "Tue" ,
  added: 15 ,
  completed: 2 ,
} , {
   day: "Wed" ,
  added: 0 ,
  completed: 3 ,
} , {
   day: "Thu" ,
  added: 8 ,
  completed: 9 ,
}, {
   day: "Fri" ,
  added: 2 ,
  completed: 4 ,
}, {
   day: "Sat" ,
  added: 2 ,
  completed: 16 ,
}, {
   day: "Sun" ,
  added: 10 ,
  completed: 0 ,
}, ]

export interface TaskStatusProps {
  name: string;
  value: number;
}

export const taskStatus: TaskStatusProps[] = [
  {
    name: "Completed",
    value: 45,
  },
  {
    name: "To Do",
    value: 25,
  },
  {
    name: "Cancelled",
    value: 10,
  },
  {
    name: "In Progress",
    value: 20,
  },
];


export interface ActivityDataProps {
  name: string;
  activity: string;
  value: string;
}

export const recentActivity: ActivityDataProps[] = [
  {
    name: "Sarah Kim",
    activity: 'completed "Implement dark mode"',
    value: "5 min ago",
  },
  {
    name: "Marcus Johnson",
    activity: 'created "Set up CI/CD pipeline"',
    value: "23 min ago",
  },
  {
    name: "Alex Chen",
    activity: "assigned you a new task",
    value: "1 hr ago",
  },
  {
    name: "Emily Rodriguez",
    activity: "updated task priority to urgent",
    value: "2 hr ago",
  },
  {
    name: "David Park",
    activity: "flagged an accessibility issue",
    value: "3 hr ago",
  },
];

