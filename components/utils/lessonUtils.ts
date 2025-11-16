import { createClient } from "@/lib/supabase/client";

import { Lesson } from "./mockData";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
    if (!supabaseInstance) {
        supabaseInstance = createClient();
    }
    return supabaseInstance;
}


const supabase = getSupabaseClient();


export async function getLessons(): Promise<Lesson[]> {
    try {
        const { data, error } = await supabase
            .from("lessons")
            .select(`
        id,
        title,
        story_theme,
        description,
        difficulty,
        created_at,
        updated_at,
        inputs,
        expected_outputs
      `);


        if (error) {
            console.error("Error fetching lessons:", error);
            return [];
        }

        return (data || []) as Lesson[];
    } catch (error) {
        console.error("Error in getLessons:", error);
        return [];
    }
}