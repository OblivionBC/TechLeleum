/**
 * Unified Lesson class containing all lesson information
 */

export interface LessonValidation {
  expectedOutput: string | string[];
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  exactMatch?: boolean;
}

export class Lesson {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  topicId: string;
  toolboxConfiguration: any;
  validation: LessonValidation | null;

  constructor(
    id: string,
    title: string,
    description: string,
    estimatedTime: string,
    topicId: string,
    toolboxConfiguration: any,
    validation: LessonValidation | null = null
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.estimatedTime = estimatedTime;
    this.topicId = topicId;
    this.toolboxConfiguration = toolboxConfiguration;
    this.validation = validation;
  }

  getToolbox() {
    return {
      kind: "categoryToolbox",
      contents: this.toolboxConfiguration,
    };
  }

  getValidation() {
    return this.validation;
  }
}

// Lesson Registry - All lessons mapped by ID
export const lessonRegistry: Map<string, Lesson> = new Map();

// Helper function to create and register a lesson
function registerLesson(lesson: Lesson) {
  lessonRegistry.set(lesson.id, lesson);
}

// Default minimal toolbox
const defaultToolbox = [
  {
    kind: "category",
    name: "Text",
    colour: "#5CA68D",
    contents: [
      { kind: "block", type: "text" },
      { kind: "block", type: "text_print" },
    ],
  },
];

// Initialize all lessons
// Print lessons
registerLesson(
  new Lesson(
    "print-1",
    "First Words",
    "Display your first message",
    "10 min",
    "print",
    [
      {
        kind: "category",
        name: "Text",
        colour: "#5CA68D",
        contents: [
          { kind: "block", type: "text" },
          { kind: "block", type: "text_print" },
        ],
      },
    ],
    {
      expectedOutput: "hello world",
      caseSensitive: false,
      trimWhitespace: true,
      exactMatch: false,
    }
  )
);

registerLesson(
  new Lesson(
    "print-2",
    "Multiple Messages",
    "Print several messages in sequence",
    "15 min",
    "print",
    [
      {
        kind: "category",
        name: "Text",
        colour: "#5CA68D",
        contents: [
          { kind: "block", type: "text" },
          { kind: "block", type: "text_join" },
          { kind: "block", type: "text_print" },
        ],
      },
    ],
    {
      expectedOutput: ["Hello", "World"],
      caseSensitive: false,
      trimWhitespace: true,
      exactMatch: false,
    }
  )
);

// Helper functions
export function getLesson(lessonId: string): Lesson | null {
  return lessonRegistry.get(lessonId) || null;
}

export function getToolboxForLesson(lessonId: string): any {
  const lesson = getLesson(lessonId);
  return lesson ? lesson.getToolbox() : { kind: "categoryToolbox", contents: defaultToolbox };
}

export function getLessonValidation(lessonId: string): LessonValidation | null {
  const lesson = getLesson(lessonId);
  return lesson ? lesson.getValidation() : null;
}

export function getAllLessons(): Lesson[] {
  return Array.from(lessonRegistry.values());
}

export function getLessonsByTopic(topicId: string): Lesson[] {
  return getAllLessons().filter((lesson) => lesson.topicId === topicId);
}

/**
 * Get the next lesson after the current one
 * Returns null if there's no next lesson
 */
export function getNextLesson(currentLessonId: string): Lesson | null {
  const allLessons = getAllLessons();
  const currentLesson = getLesson(currentLessonId);
  
  if (!currentLesson) return null;
  
  // Get all lessons in the same topic
  const topicLessons = getLessonsByTopic(currentLesson.topicId).sort((a, b) => {
    // Sort by lesson ID to maintain order (e.g., print-1, print-2)
    return a.id.localeCompare(b.id);
  });
  
  // Find current lesson index
  const currentIndex = topicLessons.findIndex(l => l.id === currentLessonId);
  
  // If there's a next lesson in the same topic
  if (currentIndex >= 0 && currentIndex < topicLessons.length - 1) {
    return topicLessons[currentIndex + 1];
  }
  
  // If this is the last lesson in the topic, find the first lesson of the next topic
  // For now, return null (can be enhanced later to find next topic)
  return null;
}

/**
 * Normalize output string for comparison
 */
function normalizeOutput(output: string, caseSensitive: boolean, trimWhitespace: boolean): string {
  let normalized = output;
  if (!caseSensitive) {
    normalized = normalized.toLowerCase();
  }
  if (trimWhitespace) {
    normalized = normalized.trim();
  }
  return normalized;
}

/**
 * Check if actual output matches expected output
 */
export function validateLessonOutput(
  actualOutput: string[],
  validation: LessonValidation
): { passed: boolean; message: string } {
  const { expectedOutput, caseSensitive = false, trimWhitespace = true, exactMatch = false } = validation;

  // Normalize actual output
  const normalizedActual = actualOutput.map((line) =>
    normalizeOutput(line, caseSensitive, trimWhitespace)
  );

  // Handle single expected output
  if (typeof expectedOutput === "string") {
    const normalizedExpected = normalizeOutput(expectedOutput, caseSensitive, trimWhitespace);
    const actualText = normalizedActual.join("\n");

    if (exactMatch) {
      const passed = actualText === normalizedExpected;
      return {
        passed,
        message: passed
          ? "✅ Correct! Your output matches the expected result."
          : `❌ Not quite right. Expected: "${expectedOutput}", but got: "${actualOutput.join(", ")}"`,
      };
    } else {
      // Contains check
      const passed = actualText.includes(normalizedExpected) || normalizedActual.some((line) => line.includes(normalizedExpected));
      return {
        passed,
        message: passed
          ? "✅ Correct! Your output contains the expected result."
          : `❌ Not quite right. Expected output should contain: "${expectedOutput}"`,
      };
    }
  }

  // Handle array of expected outputs
  if (Array.isArray(expectedOutput)) {
    const normalizedExpected = expectedOutput.map((exp) =>
      normalizeOutput(exp, caseSensitive, trimWhitespace)
    );

    if (exactMatch) {
      // Must match exactly in order
      const passed =
        normalizedActual.length === normalizedExpected.length &&
        normalizedActual.every((actual, i) => actual === normalizedExpected[i]);
      return {
        passed,
        message: passed
          ? "✅ Correct! Your output matches exactly."
          : `❌ Not quite right. Expected: ${expectedOutput.join(", ")}, but got: ${actualOutput.join(", ")}`,
      };
    } else {
      // Check if all expected outputs are present (order doesn't matter)
      const passed = normalizedExpected.every((expected) =>
        normalizedActual.some((actual) => actual.includes(expected))
      );
      return {
        passed,
        message: passed
          ? "✅ Correct! Your output contains all expected results."
          : `❌ Not quite right. Expected to see: ${expectedOutput.join(", ")}`,
      };
    }
  }

  return {
    passed: false,
    message: "Validation error: Invalid expected output format",
  };
}
