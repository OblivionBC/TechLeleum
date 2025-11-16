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
  band: string;
  indigenousWriting: string;
  tribeImageUrl: string;

  constructor(
    id: string,
    title: string,
    description: string,
    estimatedTime: string,
    topicId: string,
    toolboxConfiguration: any,
    validation: LessonValidation | null = null,
    band: string = "",
    indigenousWriting: string = "",
    tribeImageUrl: string = ""
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.estimatedTime = estimatedTime;
    this.topicId = topicId;
    this.toolboxConfiguration = toolboxConfiguration;
    this.validation = validation;
    this.band = band;
    this.indigenousWriting = indigenousWriting;
    this.tribeImageUrl = tribeImageUrl;
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
    "Sharing Your Voice",
    "In xʷməθkʷəy̓əm culture, knowledge is shared through conversation and oral teaching. When your program uses print(), it's like sharing your voice so someone else can learn from it or receive your message. Welcome someone to xʷməθkʷəy̓əm territory with a respectful greeting like ʔəy̓ skʷeyəɬ.",
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
      expectedOutput: "ʔəy̓ skʷeyəɬ",
      caseSensitive: false,
      trimWhitespace: true,
      exactMatch: false,
    },
    "Musqueam",
    "xʷməθkʷəy̓əm",
    "https://iconictributes.com/wp-content/uploads/www.musqueam.bc_.ca_.jpg"
  )
);

registerLesson(
  new Lesson(
    "print-2",
    "Messages for the Community",
    "In xʷməθkʷəy̓əm communities, stéʔexʷəł (children) help with community events and gatherings. When you tátələt (are learning), you practice sharing messages. Create multiple print statements that describe helping your community. Each print statement sends a message about what your program is doing, just like sharing what you're doing to help others.",
    "15 min",
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
      expectedOutput: ["I am learning", "I am helping", "I am being a good relative"],
      caseSensitive: false,
      trimWhitespace: true,
      exactMatch: false,
    },
    "Musqueam",
    "xʷməθkʷəy̓əm",
    "https://iconictributes.com/wp-content/uploads/www.musqueam.bc_.ca_.jpg"
  )
);

// Conditional (if statement) lessons - Coast Salish (Hul'q'umi'num')
registerLesson(
  new Lesson(
    "conditionals-1",
    "Making Decisions Like Raven",
    "In Coast Salish stories, spaal' (Raven) brings light to the world through curiosity, observation, and careful decision-making. Like spaal', you are watching the world and noticing what needs to change. Your program behaves differently depending on what it 'sees' - this is how programs observe conditions, just as spaal' observed the environment before making choices.",
    "15 min",
    "conditionals",
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
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "logic_boolean" },
        ],
      },
    ],
    {
      expectedOutput: "It is dark",
      caseSensitive: false,
      trimWhitespace: true,
      exactMatch: false,
    },
    "Coast Salish",
    "hul'q'umi'num'",
    "https://www.sfu.ca/content/sfu/brc/our-work/imesh-mobile-app/indigenous-art-walk/coast-salish-prints/jcr:content/main_content/image_1588500320.img.2000.high.jpg/1656097222232.jpeg"
  )
);

registerLesson(
  new Lesson(
    "conditionals-2",
    "A Condition Appears",
    "In Coast Salish stories, spaal' (Raven) waits until the right moment to act. Your program also waits and checks conditions: Is it dark? Is sumshathut (the sun) available? When a condition becomes true, your program will do something - just like spaal' did when the right moment came. Learn to use if statements to check conditions and make your program respond.",
    "20 min",
    "conditionals",
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
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "logic_boolean" },
        ],
      },
    ],
    {
      expectedOutput: ["It's time to bring some light"],
      caseSensitive: false,
      trimWhitespace: true,
      exactMatch: false,
    },
    "Coast Salish",
    "hul'q'umi'num'",
    "https://www.sfu.ca/content/sfu/brc/our-work/imesh-mobile-app/indigenous-art-walk/coast-salish-prints/jcr:content/main_content/image_1588500320.img.2000.high.jpg/1656097222232.jpeg"
  )
);

registerLesson(
  new Lesson(
    "conditionals-3",
    "Making a Decision",
    "spaal' (Raven) made decisions based on what spaal' observed. Programs do the same: they check conditions and choose actions. Learn to use if-else statements to create branching logic - when one condition is true, do one thing; otherwise, do something else. This mirrors how spaal' chose different paths based on what was observed.",
    "25 min",
    "conditionals",
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
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "controls_ifelse" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "logic_boolean" },
        ],
      },
    ],
    {
      expectedOutput: ["I can brighten the world", "I must keep searching"],
      caseSensitive: false,
      trimWhitespace: true,
      exactMatch: false,
    },
    "Coast Salish",
    "hul'q'umi'num'",
    "https://www.sfu.ca/content/sfu/brc/our-work/imesh-mobile-app/indigenous-art-walk/coast-salish-prints/jcr:content/main_content/image_1588500320.img.2000.high.jpg/1656097222232.jpeg"
  )
);

registerLesson(
  new Lesson(
    "conditionals-4",
    "Changing the World",
    "In Coast Salish stories, spaal' (Raven)'s final action changed everything. When your program finds the right condition, it brings 'light' into your virtual scene. Learn to use multiple if statements to check different conditions and create programs that respond to the world around them, just as spaal' actions transformed the world.",
    "30 min",
    "conditionals",
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
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "controls_ifelse" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "logic_boolean" },
        ],
      },
    ],
    {
      expectedOutput: ["It is dark. I need to do something", "I can brighten the world now", "The world becomes bright"],
      caseSensitive: false,
      trimWhitespace: true,
      exactMatch: false,
    },
    "Coast Salish",
    "hul'q'umi'num'",
    "https://www.sfu.ca/content/sfu/brc/our-work/imesh-mobile-app/indigenous-art-walk/coast-salish-prints/jcr:content/main_content/image_1588500320.img.2000.high.jpg/1656097222232.jpeg"
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
