import { getLessonsByTopic, Lesson } from "./lessons";

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
  band: string;
  indigenousWriting: string;
  tribeImageUrl: string;
}

function lessonToTopicLesson(lesson: Lesson): TopicLesson {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    estimatedTime: lesson.estimatedTime,
    band: lesson.band,
    indigenousWriting: lesson.indigenousWriting,
    tribeImageUrl: lesson.tribeImageUrl,
  };
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
    lessons: getLessonsByTopic("print").map(lessonToTopicLesson),
  },
  {
    id: "variables",
    name: "Variables",
    description: "Store and track information",
    icon: "📦",
    position: { x: 50, y: 25 },
    prerequisites: ["print"],
    lessons: getLessonsByTopic("variables").map(lessonToTopicLesson),
  },
  {
    id: "sequences",
    name: "Sequences",
    description: "Order actions step by step",
    icon: "➡️",
    position: { x: 25, y: 42 },
    prerequisites: ["variables"],
    lessons: getLessonsByTopic("sequences").map(lessonToTopicLesson),
  },
  {
    id: "loops",
    name: "Loops",
    description: "Repeat actions efficiently",
    icon: "🔄",
    position: { x: 75, y: 42 },
    prerequisites: ["variables"],
    lessons: getLessonsByTopic("loops").map(lessonToTopicLesson),
  },
  {
    id: "conditionals",
    name: "Conditionals",
    description: "Make decisions in code",
    icon: "🔀",
    position: { x: 50, y: 59 },
    prerequisites: ["sequences", "loops"],
    lessons: getLessonsByTopic("conditionals").map(lessonToTopicLesson),
  },
  {
    id: "functions",
    name: "Functions",
    description: "Organize and reuse code",
    icon: "⚙️",
    position: { x: 25, y: 76 },
    prerequisites: ["conditionals"],
    lessons: getLessonsByTopic("functions").map(lessonToTopicLesson),
  },
  {
    id: "events",
    name: "Events",
    description: "Respond to actions and triggers",
    icon: "⚡",
    position: { x: 75, y: 76 },
    prerequisites: ["conditionals"],
    lessons: getLessonsByTopic("events").map(lessonToTopicLesson),
  },
  {
    id: "arrays",
    name: "Arrays & Lists",
    description: "Work with collections of data",
    icon: "📚",
    position: { x: 50, y: 90 },
    prerequisites: ["functions", "events"],
    lessons: getLessonsByTopic("arrays").map(lessonToTopicLesson),
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
  try {
    window.dispatchEvent(
      new CustomEvent("learningProgressChanged"),
    );
  } catch (e) {
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