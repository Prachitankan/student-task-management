export const initialTasks = [
  {
    id: "task-101",
    title: "Complete DBMS Normalization Assignment",
    description: "Solve problems 1 through 8 on 3NF, BCNF and lossless-join decomposition for university portal database.",
    subject: "DBMS",
    priority: "High",
    dueDate: "2026-10-06",
    status: "Pending",
    createdAt: "2026-10-01",
    estimatedHours: 3.5
  },
  {
    id: "task-102",
    title: "Implement CPU Scheduling Algorithms in C++",
    description: "Code Round Robin (quantum=4ms) and Shortest Job First (preemptive) with Gantt chart calculation.",
    subject: "Operating Systems",
    priority: "High",
    dueDate: "2026-10-04",
    status: "Pending",
    createdAt: "2026-09-28",
    estimatedHours: 4.0
  },
  {
    id: "task-103",
    title: "Socket Programming Lab Report (TCP vs UDP)",
    description: "Write performance comparison report on packet latency and packet drop rates observed in Wireshark traces.",
    subject: "Computer Networks",
    priority: "Medium",
    dueDate: "2026-10-07",
    status: "Pending",
    createdAt: "2026-10-02",
    estimatedHours: 2.0
  },
  {
    id: "task-104",
    title: "Train Random Forest on Titanic Dataset",
    description: "Perform exploratory data analysis, impute missing values, tune hyperparameters with GridSearch, and evaluate F1-score.",
    subject: "Machine Learning",
    priority: "High",
    dueDate: "2026-10-10",
    status: "Pending",
    createdAt: "2026-10-03",
    estimatedHours: 5.0
  },
  {
    id: "task-105",
    title: "Discrete Math Problem Set 4 (Graph Theory)",
    description: "Prove Euler path existence theorem and solve Hamiltonian cycle graph colorability problems.",
    subject: "Mathematics",
    priority: "Medium",
    dueDate: "2026-10-08",
    status: "Pending",
    createdAt: "2026-10-02",
    estimatedHours: 3.0
  },
  {
    id: "task-106",
    title: "Build REST API for Student Task Portal in Node.js",
    description: "Create endpoints for GET /tasks, POST /tasks, PUT /tasks/:id and DELETE /tasks/:id with validation.",
    subject: "Web Engineering",
    priority: "Medium",
    dueDate: "2026-10-06",
    status: "In Progress",
    createdAt: "2026-10-04",
    estimatedHours: 3.0
  },
  {
    id: "task-107",
    title: "Software Requirement Specification (SRS) Document",
    description: "Draft IEEE-format SRS document for final year capstone project including functional and non-functional specs.",
    subject: "Software Engineering",
    priority: "Low",
    dueDate: "2026-10-14",
    status: "Pending",
    createdAt: "2026-10-05",
    estimatedHours: 6.0
  },
  {
    id: "task-108",
    title: "Mid-term Exam Review: Bresenham Line & Circle Algorithms",
    description: "Revised rasterization proofs, scan conversion derivations, and 2D transformation matrices.",
    subject: "Computer Graphics",
    priority: "High",
    dueDate: "2026-10-05",
    status: "Completed",
    createdAt: "2026-09-25",
    estimatedHours: 4.0
  },
  {
    id: "task-109",
    title: "Design E-R Diagram for Hospital Management System",
    description: "Created Crow's Foot E-R schema with strong/weak entity sets and cardinality constraints.",
    subject: "DBMS",
    priority: "Medium",
    dueDate: "2026-10-02",
    status: "Completed",
    createdAt: "2026-09-26",
    estimatedHours: 2.5
  },
  {
    id: "task-110",
    title: "Dockerize Web Application with Multi-Stage Build",
    description: "Write Dockerfile with Alpine base image, optimize layer caching, and verify container size < 80MB.",
    subject: "Cloud Computing",
    priority: "Low",
    dueDate: "2026-10-15",
    status: "Pending",
    createdAt: "2026-10-05",
    estimatedHours: 2.0
  },
  {
    id: "task-111",
    title: "Lexical Analyzer Implementation using Lex/Flex",
    description: "Construct token recognizers for keywords, identifiers, constants, and operators in custom mini-language.",
    subject: "Compiler Design",
    priority: "High",
    dueDate: "2026-10-11",
    status: "Pending",
    createdAt: "2026-10-04",
    estimatedHours: 4.5
  },
  {
    id: "task-112",
    title: "Dynamic Programming Practice: 0/1 Knapsack & LCS",
    description: "Solved tabular bottom-up and memoized recursion implementations with space optimization.",
    subject: "Algorithms",
    priority: "Medium",
    dueDate: "2026-10-03",
    status: "Completed",
    createdAt: "2026-09-27",
    estimatedHours: 3.5
  }
];

export const initialProfile = {
  name: "Alex Dev",
  studentId: "STU-2026-8842",
  major: "Computer Science & Engineering",
  semester: "Semester 5 (Fall 2026)",
  targetGpa: "3.85 / 4.00",
  currentGpa: "3.78",
  institution: "Faculty of Engineering & Technology",
  dailyStudyGoalHours: 4
};
