/**
 * Utility functions for managing mentor applications and approvals
 * Updated to use Supabase instead of localStorage
 */

import { createClient } from "@/lib/supabase/client";
import { Mentor } from "./mockData";

// For client components, this creates a singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

const supabase = getSupabaseClient();

/**
 * Schema-only type matching the mentors table exactly
 * Fields: id, bio, expertise, region, band, photo_url, display_name, created_at, updated_at
 */
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

/**
 * Get all mentors from Supabase mentors table
 * Returns only schema fields: id, bio, expertise, region, band, photo_url, display_name, created_at, updated_at
 */
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

/**
 * Get a single mentor by ID from Supabase
 * Returns raw database record (only schema fields)
 */
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

/**
 * Get all approved mentors from Supabase
 * @deprecated Use getMentors() instead - this is just a wrapper
 */
export async function getApprovedMentors(): Promise<MentorSchema[]> {
  return getMentors();
}

/**
 * Get mentor applications from localStorage (legacy - for any pending applications stored locally)
 * This is kept for backward compatibility if there are local applications not yet in the database
 */
export function getMentorApplications(): MentorApplication[] {
  if (typeof window === "undefined") return [];

  const applications = localStorage.getItem("mentorApplications");
  return applications ? JSON.parse(applications) : [];
}

/**
 * Approve a mentor application (Admin function)
 * This would typically create a record in the mentors table
 * For now, this updates local storage as a transition step
 */
export async function approveMentorApplication(
  applicationId: string
): Promise<boolean> {
  try {
    const applications = getMentorApplications();
    const application = applications.find((app) => app.id === applicationId);

    if (!application) {
      return false;
    }

    // Update application status in localStorage
    application.status = "approved";
    application.approved = true;
    localStorage.setItem("mentorApplications", JSON.stringify(applications));

    // For now, also add to approved mentors in localStorage
    const approvedMentors = getApprovedMentors();
    // This will be async, so we'll keep local storage for now
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

/**
 * Reject a mentor application (Admin function)
 */
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

/**
 * Check if a user is signed in as a mentor
 */
export function getMentorSession(): MentorSession | null {
  if (typeof window === "undefined") return null;

  const session = localStorage.getItem("mentorSession");
  return session ? JSON.parse(session) : null;
}

/**
 * Sign out mentor
 */
export function signOutMentor(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mentorSession");
  }
}

/**
 * Check if an email is already registered as a mentor
 */
export async function isMentorEmailRegistered(email: string): Promise<boolean> {
  try {
    // We can't directly query auth.users, but we can check if there's a mentor record
    // This would require joining with auth.users via a database function or view
    // For now, we'll check the mentors table based on other criteria

    // Note: This is a simplified check. In production, you'd want to:
    // 1. Create a database view that joins mentors with auth.users
    // 2. Or use a Supabase Edge Function to check email in auth.users

    const mentors = await getMentors();
    // Since we don't have email in mentors table directly, we can't fully check this
    // This is kept for backward compatibility
    return false;
  } catch (error) {
    console.error("Error checking mentor email:", error);
    return false;
  }
}

/**
 * Check if an application already exists for an email
 */
export function hasExistingApplication(email: string): boolean {
  if (typeof window === "undefined") return false;

  const applications = getMentorApplications();
  return applications.some(
    (app) => app.email === email && app.status === "pending"
  );
}

/**
 * Get pending applications count (Admin function)
 */
export function getPendingApplicationsCount(): number {
  const applications = getMentorApplications();
  return applications.filter((app) => app.status === "pending").length;
}

/**
 * Load all mentors with connection status
 * Combines getMentors, convertApplicationToMentor, and getMentorsWithConnection
 */
export async function loadMentorsWithConnection(): Promise<Mentor[]> {
  const { getMentorsWithConnection } = await import("./progressUtils");
  const mentors = await getMentors();
  const converted = mentors.map(convertApplicationToMentor);
  return getMentorsWithConnection(converted);
}

/**
 * Convert mentor schema or application to Mentor interface
 */
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
