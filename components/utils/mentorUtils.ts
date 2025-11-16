import { createClient } from "@/lib/supabase/client";
import { Mentor } from "./mockData";
import { getProgress } from "./progressUtils";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

const supabase = getSupabaseClient();

export interface MentorSchema {
  id: string;
  bio: string | null;
  expertise: string | null;
  region: string | null;
  band: string | null;
  photo_url: string | null;
  display_name: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MentorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  techField: string;
  expertise: string;
  experience: string;
  culturalBackground: string;
  motivation: string;
  availability: "available" | "limited" | "unavailable";
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  approved: boolean;
}

export interface MentorSession {
  email: string;
  name: string;
  loginTime: string;
}

export async function getMentors(): Promise<MentorSchema[]> {
  try {
    const { data, error } = await supabase
      .from("mentors")
      .select(
        "id, bio, expertise, region, band, photo_url, display_name, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching mentors:", error);
      return [];
    }

    return (data || []) as MentorSchema[];
  } catch (error) {
    console.error("Error in getMentors:", error);
    return [];
  }
}

export async function getMentorById(id: string): Promise<MentorSchema | null> {
  try {
    const { data, error } = await supabase
      .from("mentors")
      .select("id, bio, expertise, region, band, photo_url, display_name, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching mentor by ID:", error);
      return null;
    }

    return (data || null) as MentorSchema | null;
  } catch (error) {
    console.error("Error in getMentorById:", error);
    return null;
  }
}

export async function getApprovedMentors(): Promise<MentorSchema[]> {
  return getMentors();
}

export function getMentorApplications(): MentorApplication[] {
  if (typeof window === "undefined") return [];

  const applications = localStorage.getItem("mentorApplications");
  return applications ? JSON.parse(applications) : [];
}

export async function getMentorCount(): Promise<number> {
  if (typeof window === "undefined") return 0;

  const { count, error } = await supabase
    .from("mentors")
    .select("*", { count: "exact", head: true });

  if (error || count === null) return 0;

  return count;
}


export async function approveMentorApplication(
  applicationId: string
): Promise<boolean> {
  try {
    const applications = getMentorApplications();
    const application = applications.find((app) => app.id === applicationId);

    if (!application) {
      return false;
    }

    application.status = "approved";
    application.approved = true;
    localStorage.setItem("mentorApplications", JSON.stringify(applications));

    const approvedMentorsLocal = JSON.parse(
      localStorage.getItem("approvedMentors") || "[]"
    );
    approvedMentorsLocal.push(application);
    localStorage.setItem(
      "approvedMentors",
      JSON.stringify(approvedMentorsLocal)
    );

    return true;
  } catch (error) {
    console.error("Error approving mentor application:", error);
    return false;
  }
}

export function rejectMentorApplication(
  applicationId: string,
  reason?: string
): boolean {
  try {
    const applications = getMentorApplications();
    const application = applications.find((app) => app.id === applicationId);

    if (!application) {
      return false;
    }

    application.status = "rejected";
    application.approved = false;

    localStorage.setItem("mentorApplications", JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error("Error rejecting mentor application:", error);
    return false;
  }
}

export function getMentorSession(): MentorSession | null {
  if (typeof window === "undefined") return null;

  const session = localStorage.getItem("mentorSession");
  return session ? JSON.parse(session) : null;
}

export function signOutMentor(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mentorSession");
  }
}

export async function isMentorEmailRegistered(email: string): Promise<boolean> {
  try {
    const mentors = await getMentors();
    return false;
  } catch (error) {
    console.error("Error checking mentor email:", error);
    return false;
  }
}

export function hasExistingApplication(email: string): boolean {
  if (typeof window === "undefined") return false;

  const applications = getMentorApplications();
  return applications.some(
    (app) => app.email === email && app.status === "pending"
  );
}

export function getPendingApplicationsCount(): number {
  const applications = getMentorApplications();
  return applications.filter((app) => app.status === "pending").length;
}

export async function loadMentorsWithConnection(): Promise<Mentor[]> {
  const { getMentorsWithConnection } = await import("./progressUtils");
  const mentors = await getMentors();
  const converted = mentors.map(convertApplicationToMentor);
  return getMentorsWithConnection(converted);
}

export async function getConnectedMentorsCount(): Promise<number> {
  const mentors = await loadMentorsWithConnection();
  return mentors.filter((m) => m.connected).length;
}

export function convertApplicationToMentor(
  application: MentorSchema | MentorApplication
): Mentor {
  const isSchemaRecord = "display_name" in application;

  if (isSchemaRecord) {
    const schemaRecord = application as MentorSchema;

    const displayName = schemaRecord.display_name?.trim() || "";
    const bio = schemaRecord.bio?.trim() || "";
    const expertise = schemaRecord.expertise?.trim() || "";
    const region = schemaRecord.region?.trim() || "";
    const band = schemaRecord.band?.trim() || "";
    const photoUrl = schemaRecord.photo_url?.trim() || "";

    const expertiseArray = expertise
      ? expertise
          .split(",")
          .map((e: string) => e.trim())
          .filter((e: string) => e.length > 0)
      : [];

    return {
      id: schemaRecord.id,
      display_name: displayName || "Mentor",
      title: expertise || "",
      techField: expertise || "",
      region: region,
      availability: "available" as const,
      bio: bio,
      expertise: expertiseArray,
      band: band,
      photo_url: photoUrl || "",
      connected: false,
    };
  } else {
    const app = application as MentorApplication;
    return {
      id: app.id,
      display_name: app.name,
      title: app.techField,
      techField: app.techField,
      region: app.region,
      availability: app.availability,
      bio: app.experience,
      expertise: app.expertise.split(",").map((e: string) => e.trim()),
      band: app.culturalBackground || "",
      photo_url: "",
      connected: false,
    };
  }
}

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