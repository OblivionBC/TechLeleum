import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { MentorSchema } from "@/components/utils/mentorUtils";
import { Mentor } from "@/app/utils/mockData";

/**
 * Convert Supabase mentor schema to frontend Mentor interface
 */
function convertMentorSchemaToMentor(schema: MentorSchema): Mentor {
  const displayName = schema.display_name?.trim() || "Mentor";
  const bio = schema.bio?.trim() || "";
  const expertise = schema.expertise?.trim() || "";
  const region = schema.region?.trim() || "";
  const band = schema.band?.trim() || "";
  const photoUrl = schema.photo_url?.trim() || "";

  const expertiseArray = expertise
    ? expertise
        .split(",")
        .map((e: string) => e.trim())
        .filter((e: string) => e.length > 0)
    : [];

  const title = expertise || "Tech Mentor";
  const techField = expertise || "Technology";

  return {
    id: schema.id,
    name: displayName,
    title: title,
    techField: techField,
    region: region,
    availability: "available" as const,
    bio: bio,
    expertise: expertiseArray,
    culturalBackground: band,
    imageUrl: photoUrl,
    connected: false,
  };
}

/**
 * GET /api/mentors/random
 * Returns 3 random mentors from Supabase
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("mentors")
      .select("id, bio, expertise, region, band, photo_url, display_name, created_at, updated_at")
      .limit(100);

    if (error) {
      console.error("Error fetching mentors:", error);
      return NextResponse.json(
        { error: "Failed to fetch mentors" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json([]);
    }

    const shuffled = [...data].sort(() => 0.5 - Math.random());
    const randomMentors = shuffled.slice(0, 3);

    const mentors: Mentor[] = randomMentors.map(convertMentorSchemaToMentor);

    return NextResponse.json(mentors);
  } catch (error) {
    console.error("Error in GET /api/mentors/random:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

