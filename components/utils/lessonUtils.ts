import { createClient } from "@/lib/supabase/client";

export async function getTotalLessonsCount() {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching lesson count:", error);
    return 0;
  }

  return count ?? 0;
}
