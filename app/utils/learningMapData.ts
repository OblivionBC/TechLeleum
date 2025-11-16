export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: { x: number; y: number }; // For map positioning
  prerequisites: string[]; // IDs of topics that must be completed first
  lessons: TopicLesson[];
}

export interface TopicLesson {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
}

export const learningTopics: Topic[] = [
  {
    id: "print",
    name: "Print & Output",
    description: "Learn to display messages and results",
    icon: "📢",
    // moved up slightly to give more separation from the node below
    position: { x: 50, y: 6 },
    prerequisites: [],
    lessons: [
      {
        id: "print-1",
        title: "First Words",
        description: "Display your first message",
        estimatedTime: "10 min",
      },
      {
        id: "print-2",
        title: "Multiple Messages",
        description: "Print several messages in sequence",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "variables",
    name: "Variables",
    description: "Store and track information",
    icon: "📦",
    position: { x: 50, y: 25 },
    prerequisites: ["print"],
    lessons: [
      {
        id: "var-1",
        title: "Creating Variables",
        description: "Learn to store values",
        estimatedTime: "15 min",
      },
      {
        id: "var-2",
        title: "Changing Variables",
        description: "Update stored values",
        estimatedTime: "20 min",
      },
      {
        id: "var-3",
        title: "Using Variables",
        description: "Work with stored data",
        estimatedTime: "20 min",
      },
    ],
  },
  {
    id: "sequences",
    name: "Sequences",
    description: "Order actions step by step",
    icon: "➡️",
    position: { x: 25, y: 42 },
    prerequisites: ["variables"],
    lessons: [
      {
        id: "seq-1",
        title: "Step by Step",
        description: "Execute commands in order",
        estimatedTime: "15 min",
      },
      {
        id: "seq-2",
        title: "Building Patterns",
        description: "Create sequential patterns",
        estimatedTime: "25 min",
      },
    ],
  },
  {
    id: "loops",
    name: "Loops",
    description: "Repeat actions efficiently",
    icon: "🔄",
    position: { x: 75, y: 42 },
    prerequisites: ["variables"],
    lessons: [
      {
        id: "loop-1",
        title: "Repeat Blocks",
        description: "Basic repetition",
        estimatedTime: "20 min",
      },
      {
        id: "loop-2",
        title: "For Loops",
        description: "Count and repeat",
        estimatedTime: "25 min",
      },
      {
        id: "loop-3",
        title: "While Loops",
        description: "Conditional repetition",
        estimatedTime: "30 min",
      },
    ],
  },
  {
    id: "conditionals",
    name: "Conditionals",
    description: "Make decisions in code",
    icon: "🔀",
    position: { x: 50, y: 59 },
    prerequisites: ["sequences", "loops"],
    lessons: [
      {
        id: "cond-1",
        title: "If Statements",
        description: "Make simple decisions",
        estimatedTime: "20 min",
      },
      {
        id: "cond-2",
        title: "If-Else Blocks",
        description: "Choose between options",
        estimatedTime: "25 min",
      },
      {
        id: "cond-3",
        title: "Complex Conditions",
        description: "Multiple decision paths",
        estimatedTime: "30 min",
      },
    ],
  },
  {
    id: "functions",
    name: "Functions",
    description: "Organize and reuse code",
    icon: "⚙️",
    position: { x: 25, y: 76 },
    prerequisites: ["conditionals"],
    lessons: [
      {
        id: "func-1",
        title: "Creating Functions",
        description: "Define your own blocks",
        estimatedTime: "25 min",
      },
      {
        id: "func-2",
        title: "Function Parameters",
        description: "Pass information to functions",
        estimatedTime: "30 min",
      },
      {
        id: "func-3",
        title: "Return Values",
        description: "Get results from functions",
        estimatedTime: "30 min",
      },
    ],
  },
  {
    id: "events",
    name: "Events",
    description: "Respond to actions and triggers",
    icon: "⚡",
    position: { x: 75, y: 76 },
    prerequisites: ["conditionals"],
    lessons: [
      {
        id: "event-1",
        title: "Click Events",
        description: "Respond to button clicks",
        estimatedTime: "20 min",
      },
      {
        id: "event-2",
        title: "Multiple Events",
        description: "Handle different triggers",
        estimatedTime: "25 min",
      },
    ],
  },
  {
    id: "arrays",
    name: "Arrays & Lists",
    description: "Work with collections of data",
    icon: "📚",
    position: { x: 50, y: 90 },
    prerequisites: ["functions", "events"],
    lessons: [
      {
        id: "array-1",
        title: "Creating Lists",
        description: "Store multiple items",
        estimatedTime: "25 min",
      },
      {
        id: "array-2",
        title: "Accessing Items",
        description: "Get items from lists",
        estimatedTime: "30 min",
      },
      {
        id: "array-3",
        title: "Looping Through Lists",
        description: "Process all items",
        estimatedTime: "35 min",
      },
    ],
  },
];

// Helper function to check if a topic is unlocked
export function isTopicUnlocked(topicId: string): boolean {
  const topic = learningTopics.find((t) => t.id === topicId);
  if (!topic) return false;

  // If no prerequisites, it's unlocked
  if (topic.prerequisites.length === 0) return true;

  // Check if all prerequisite topics are completed
  const completedTopics = getCompletedTopics();
  return topic.prerequisites.every((prereqId) =>
    completedTopics.includes(prereqId),
  );
}

// Helper function to check if a topic is completed
export function isTopicCompleted(topicId: string): boolean {
  const completedTopics = getCompletedTopics();
  return completedTopics.includes(topicId);
}

// Get completed topics from localStorage
export function getCompletedTopics(): string[] {
  const stored = localStorage.getItem("completedTopics");
  return stored ? JSON.parse(stored) : [];
}

// Mark a topic as completed
export function completeTopicLesson(
  topicId: string,
  lessonId: string,
): void {
  const key = `topic_${topicId}_lessons`;
  const stored = localStorage.getItem(key);
  const completedLessons = stored ? JSON.parse(stored) : [];

  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
    localStorage.setItem(key, JSON.stringify(completedLessons));
  }

  // Check if all lessons in topic are completed
  const topic = learningTopics.find((t) => t.id === topicId);
  if (topic) {
    const allCompleted = topic.lessons.every((lesson) =>
      completedLessons.includes(lesson.id),
    );

    if (allCompleted) {
      const completedTopics = getCompletedTopics();
      if (!completedTopics.includes(topicId)) {
        completedTopics.push(topicId);
        localStorage.setItem(
          "completedTopics",
          JSON.stringify(completedTopics),
        );
      }
    }
  }

  // notify UI (so LearningHome can refresh immediately)
  // LearningHome listens for this custom event and will re-read progress & recompute lines
  try {
    window.dispatchEvent(
      new CustomEvent("learningProgressChanged"),
    );
  } catch (e) {
    // ignore if window or CustomEvent not available in some environments
  }
}

// Get completion percentage for a topic
export function getTopicProgress(topicId: string): number {
  const topic = learningTopics.find((t) => t.id === topicId);
  if (!topic) return 0;

  const key = `topic_${topicId}_lessons`;
  const stored = localStorage.getItem(key);
  const completedLessons = stored ? JSON.parse(stored) : [];

  return Math.round(
    (completedLessons.length / topic.lessons.length) * 100,
  );
}

// Get overall progress percentage
export function getOverallProgress(): number {
  const completedTopics = getCompletedTopics();
  return Math.round(
    (completedTopics.length / learningTopics.length) * 100,
  );
}