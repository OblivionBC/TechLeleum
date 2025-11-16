/**
 * Utility functions for managing mentor applications and approvals
 */

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
  availability: 'available' | 'limited' | 'unavailable';
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approved: boolean;
}

export interface MentorSession {
  email: string;
  name: string;
  loginTime: string;
}

/**
 * Get all mentor applications from localStorage
 */
export function getMentorApplications(): MentorApplication[] {
  const applications = localStorage.getItem('mentorApplications');
  return applications ? JSON.parse(applications) : [];
}

/**
 * Get all approved mentors
 */
export function getApprovedMentors(): MentorApplication[] {
  const mentors = localStorage.getItem('approvedMentors');
  return mentors ? JSON.parse(mentors) : [];
}

/**
 * Approve a mentor application (Admin function)
 * This would typically be done through an admin dashboard
 */
export function approveMentorApplication(applicationId: string): boolean {
  try {
    const applications = getMentorApplications();
    const application = applications.find(app => app.id === applicationId);
    
    if (!application) {
      return false;
    }

    // Update application status
    application.status = 'approved';
    application.approved = true;
    
    // Save updated applications
    localStorage.setItem('mentorApplications', JSON.stringify(applications));
    
    // Add to approved mentors
    const approvedMentors = getApprovedMentors();
    approvedMentors.push(application);
    localStorage.setItem('approvedMentors', JSON.stringify(approvedMentors));
    
    return true;
  } catch (error) {
    console.error('Error approving mentor application:', error);
    return false;
  }
}

/**
 * Reject a mentor application (Admin function)
 */
export function rejectMentorApplication(applicationId: string, reason?: string): boolean {
  try {
    const applications = getMentorApplications();
    const application = applications.find(app => app.id === applicationId);
    
    if (!application) {
      return false;
    }

    application.status = 'rejected';
    application.approved = false;
    
    localStorage.setItem('mentorApplications', JSON.stringify(applications));
    
    return true;
  } catch (error) {
    console.error('Error rejecting mentor application:', error);
    return false;
  }
}

/**
 * Check if a user is signed in as a mentor
 */
export function getMentorSession(): MentorSession | null {
  const session = localStorage.getItem('mentorSession');
  return session ? JSON.parse(session) : null;
}

/**
 * Sign out mentor
 */
export function signOutMentor(): void {
  localStorage.removeItem('mentorSession');
}

/**
 * Check if an email is already registered as a mentor
 */
export function isMentorEmailRegistered(email: string): boolean {
  const approvedMentors = getApprovedMentors();
  return approvedMentors.some(mentor => mentor.email === email);
}

/**
 * Check if an application already exists for an email
 */
export function hasExistingApplication(email: string): boolean {
  const applications = getMentorApplications();
  return applications.some(app => app.email === email && app.status === 'pending');
}

/**
 * Get pending applications count (Admin function)
 */
export function getPendingApplicationsCount(): number {
  const applications = getMentorApplications();
  return applications.filter(app => app.status === 'pending').length;
}

/**
 * Convert approved mentor application to the Mentor format used in mockData
 */
export function convertApplicationToMentor(application: MentorApplication) {
  return {
    id: application.id,
    name: application.name,
    title: application.techField,
    techField: application.techField,
    region: application.region,
    availability: application.availability,
    bio: application.experience,
    expertise: application.expertise.split(',').map(e => e.trim()),
    culturalBackground: application.culturalBackground || 'Indigenous community member',
    imageUrl: 'https://images.unsplash.com/photo-1710488140888-88896ecafdcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIwd29tYW4lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMjYwNTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    connected: false,
  };
}
