import { createClient } from "@/lib/supabase/client";

export async function getLessonStats(userId: string) {
  const supabase = createClient();

  // Completed Lessons
  const { count: completedCount } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);

  // In Progress
  const { count: inProgressCount } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", false);

  return {
    completed: completedCount || 0,
    inProgress: inProgressCount || 0,
  };
}
