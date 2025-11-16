"use client";

import { Lesson, Mentor } from "./mockData";
import { createClient } from "@/lib/supabase/client";

// Lazy initialization to avoid SSR issues
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used in client components');
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

export interface UserProgress {
  completedLessons: string[];
  lessonProgress: { [lessonId: string]: number };
  connectedMentors: string[];
}

/**
 * Get current user ID from Supabase auth
 */
async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * Check if the current user exists in the youth table
 * Returns the userId if they exist, null otherwise
 */
async function getYouthUserId(): Promise<string | null> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  try {
    const supabase = getSupabaseClient();
    const { data: existing, error: checkError } = await supabase
      .from("youth")
      .select("id")
      .eq("id", userId)
      .single();

    if (existing) {
      return userId;
    }

    if (checkError && 'code' in checkError && checkError.code !== "PGRST116") {
      console.error("Error checking youth record:", checkError);
    }

    return null;
  } catch (error) {
    console.error("Error checking youth record:", error);
    return null;
  }
}

/**
 * Get progress for the current user from Supabase
 */
export const getProgress = async (): Promise<UserProgress> => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { completedLessons: [], lessonProgress: {}, connectedMentors: [] };
  }

  try {
    const supabase = getSupabaseClient();
    // Fetch lessons progress
    const { data: lessonProgressData, error: progressError } = await supabase
      .from("lesson_progress")
      .select("lesson_id, completed, progress_json")
      .eq("user_id", userId);

    if (progressError) {
      console.error("Error fetching lessons progress:", progressError);
      return { completedLessons: [], lessonProgress: {}, connectedMentors: [] };
    }

    // Build completed lessons and progress map
    const completedLessons: string[] = [];
    const lessonProgress: { [lessonId: string]: number } = {};

    if (lessonProgressData) {
      lessonProgressData.forEach((item) => {
        if (item.completed) {
          completedLessons.push(item.lesson_id);
        }

        // Extract progress percentage from progress_json
        if (item.progress_json && typeof item.progress_json === "object") {
          const progressJson = item.progress_json as any;
          lessonProgress[item.lesson_id] = progressJson.progress || progressJson.percentage || (item.completed ? 100 : 0);
        } else if (item.completed) {
          lessonProgress[item.lesson_id] = 100;
        }
      });
    }

    // Fetch accepted mentorship requests (connected mentors)
    const { data: mentorshipData, error: mentorshipError } = await supabase
      .from("mentorship_requests")
      .select("mentor_id")
      .eq("youth_id", userId)
      .eq("status", "accepted");

    if (mentorshipError) {
      console.error("Error fetching mentorship requests:", mentorshipError);
    }

    const connectedMentors = mentorshipData?.map((m) => m.mentor_id) || [];

    return {
      completedLessons,
      lessonProgress,
      connectedMentors,
    };
  } catch (error) {
    console.error("Error in getProgress:", error);
    return { completedLessons: [], lessonProgress: {}, connectedMentors: [] };
  }
};


/**
 * Update or create lessons progress for the current user
 */
export const updateLessonProgress = async (
  lessonId: string,
  progress: number
) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error("No user logged in");
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const completed = progress >= 100;
    const progressJson = { progress, percentage: progress };

    // Check if progress record exists
    const { data: existing, error: checkError } = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();
    
    // Handle errors - PGRST116 means no record found (expected), other errors are real problems
    if (checkError && ('code' in checkError && checkError.code !== "PGRST116")) {
      console.error("Error checking existing progress:", checkError);
      return;
    }

    // If record exists, update it; otherwise create a new one
    if (existing?.id) {
      const { error: updateError } = await supabase
        .from("lesson_progress")
        .update({
          completed,
          progress_json: progressJson,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Error updating lessons progress:", updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from("lesson_progress")
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          completed,
          progress_json: progressJson,
        });

      if (insertError) {
        console.error("Error creating lessons progress:", insertError);
      }
    }
  } catch (error) {
    console.error("Error in updateLessonProgress:", error);
  }
};

/**
 * Create or update a mentorship request (connect to mentor)
 */
export const connectMentor = async (mentorId: string, message?: string) => {
  const userId = await getYouthUserId();
  if (!userId) {
    console.error("User is not registered as a youth. Cannot connect to mentor.");
    throw new Error("You must be registered as a youth to connect with mentors.");
  }

  const requestMessage = message?.trim() || "Request for mentorship connection";

  try {
    const supabase = getSupabaseClient();
    // Check if request already exists
    const { data: existing, error: checkError } = await supabase
      .from("mentorship_requests")
      .select("id, status")
      .eq("youth_id", userId)
      .eq("mentor_id", mentorId)
      .single();

    if (checkError && ('code' in checkError && checkError.code !== "PGRST116")) {
      console.error("Error checking existing mentorship request:", checkError);
      return;
    }

    if (existing) {
      // If already accepted, do nothing
      if (existing.status === "accepted") {
        return;
      }
      // Update to pending if rejected or update existing pending
      const { error: updateError } = await supabase
        .from("mentorship_requests")
        .update({
          status: "pending",
          message: requestMessage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Error updating mentorship request:", updateError);
      }
    } else {
      // Create new mentorship request
      const { error: insertError } = await supabase
        .from("mentorship_requests")
        .insert({
          youth_id: userId,
          mentor_id: mentorId,
          status: "pending",
          message: requestMessage,
        });

      if (insertError) {
        console.error("Error creating mentorship request:", insertError);
      }
    }
  } catch (error) {
    console.error("Error in connectMentor:", error);
  }
};

/**
 * Remove mentorship connection (reject or cancel request)
 */
export const disconnectMentor = async (mentorId: string) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error("No user logged in");
    return;
  }

  try {
    const supabase = getSupabaseClient();
    // Update status to rejected instead of deleting (for record keeping)
    const { error } = await supabase
      .from("mentorship_requests")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("youth_id", userId)
      .eq("mentor_id", mentorId);

    if (error) {
      console.error("Error disconnecting mentor:", error);
    }
  } catch (error) {
    console.error("Error in disconnectMentor:", error);
  }
};

/**
 * Get lessons with progress data attached
 */
export const getLessonsWithProgress = async (
  lessons: Lesson[]
): Promise<Lesson[]> => {
  const progress = await getProgress();
  return lessons.map((lesson) => ({
    ...lesson,
    completed: progress.completedLessons.includes(lesson.id),
    progress: progress.lessonProgress[lesson.id] || 0,
  }));
};

/**
 * Get mentors with connection status
 */
export const getMentorsWithConnection = async (
  mentors: Mentor[]
): Promise<Mentor[]> => {
  const progress = await getProgress();
  return mentors.map((mentor) => ({
    ...mentor,
    connected: progress.connectedMentors.includes(mentor.id),
  }));
};

/**
 * Get user statistics
 */
export const getStats = async () => {
  const progress = await getProgress();
  return {
    totalCompleted: progress.completedLessons.length,
    totalInProgress: Object.keys(progress.lessonProgress).filter(
      (id) =>
        progress.lessonProgress[id] > 0 && progress.lessonProgress[id] < 100
    ).length,
    connectedMentorsCount: progress.connectedMentors.length,
  };
};
