import { Lesson, Mentor } from './mockData';

const PROGRESS_KEY = 'indigenous_learning_progress';
const CONNECTED_MENTORS_KEY = 'connected_mentors';

export interface UserProgress {
  completedLessons: string[];
  lessonProgress: { [lessonId: string]: number };
  connectedMentors: string[];
}

export const getProgress = (): UserProgress => {
  if (typeof window === 'undefined') {
    return { completedLessons: [], lessonProgress: {}, connectedMentors: [] };
  }
  
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with some sample progress
  const initialProgress: UserProgress = {
    completedLessons: ['1', '2'],
    lessonProgress: {
      '1': 100,
      '2': 100,
      '3': 60,
      '4': 30,
    },
    connectedMentors: ['1', '5'],
  };
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(initialProgress));
  return initialProgress;
};

export const saveProgress = (progress: UserProgress) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
};

export const updateLessonProgress = (lessonId: string, progress: number) => {
  const currentProgress = getProgress();
  currentProgress.lessonProgress[lessonId] = progress;
  
  if (progress >= 100 && !currentProgress.completedLessons.includes(lessonId)) {
    currentProgress.completedLessons.push(lessonId);
  }
  
  saveProgress(currentProgress);
};

export const connectMentor = (mentorId: string) => {
  const progress = getProgress();
  if (!progress.connectedMentors.includes(mentorId)) {
    progress.connectedMentors.push(mentorId);
    saveProgress(progress);
  }
};

export const disconnectMentor = (mentorId: string) => {
  const progress = getProgress();
  progress.connectedMentors = progress.connectedMentors.filter(id => id !== mentorId);
  saveProgress(progress);
};

export const getLessonsWithProgress = (lessons: Lesson[]): Lesson[] => {
  const progress = getProgress();
  return lessons.map(lesson => ({
    ...lesson,
    completed: progress.completedLessons.includes(lesson.id),
    progress: progress.lessonProgress[lesson.id] || 0,
  }));
};

export const getMentorsWithConnection = (mentors: Mentor[]): Mentor[] => {
  const progress = getProgress();
  return mentors.map(mentor => ({
    ...mentor,
    connected: progress.connectedMentors.includes(mentor.id),
  }));
};

export const getStats = () => {
  const progress = getProgress();
  return {
    totalCompleted: progress.completedLessons.length,
    totalInProgress: Object.keys(progress.lessonProgress).filter(
      id => progress.lessonProgress[id] > 0 && progress.lessonProgress[id] < 100
    ).length,
    connectedMentorsCount: progress.connectedMentors.length,
  };
};
