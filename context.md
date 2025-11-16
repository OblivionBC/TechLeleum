Sources
Use Supabase Auth with Next.js | Supabase Docs
Password-based Authentication
JavaScript API Reference | Supabase Docs

Mastering Supabase with Next.js: The Complete Developer's Guide
Next.js 15 + Supabase Edge Functions Configuration Guide
OblivionBC / TechLelum — Updated Architecture Draft
A full-stack learning platform for Indigenous youth featuring:
Blockly-based contextual programming lessons

Cultural stories integrated with logic concepts (e.g., Raven steals the sun → conditionals, Basket Weaving Patterns → loops)

Mentor directory + messaging

Progress tracking

Login and user accounts (via Supabase Auth)

Stack
Frontend: Next.js + Tailwind CSS

Backend / Serverless Functions: Supabase Edge Functions

Database: Supabase (PostgreSQL)

Auth: Supabase Auth (password & social login)

Storage: Supabase Storage for images/audio

Architectural Components

1. Frontend (Next.js)
   Major Pages
   Home Page: Introduction, “Start Learning” CTA, highlights mentors & lessons

Learning Home Page: Listing of lessons

Filter by: difficulty, topic (loops, conditionals, events), story theme (Raven, Transformer Stories, Canoe Navigation)

Lesson Page (Blockly Integration):

Split layout: story prompt + Blockly workspace

“Coding Goal” section

“Run Program” button → optional sandboxed backend evaluation

Save lesson progress via API

Mentors Page: Grid of Indigenous tech mentors, filters: tech field, region, availability

Mentor Profile Page: Bio, expertise, cultural background, mentorship request form

Login / Signup Page: Supabase Auth UI Kit, social login

About Page: App purpose and Indigenous-focused mission

2. Backend (Supabase Edge Functions)
   Primary Responsibilities
   Expose RESTful endpoints for:

Lessons metadata & content

Saving & retrieving lesson progress

Mentor CRUD operations

Mentorship requests

Cultural stories API (optional)

Blockly program validation (optional MVP+)

Edge Function Services
Service
Responsibilities
LessonService
CRUD lessons, fetch lesson content, fetch/save user progress
MentorService
CRUD mentor profiles, get mentor directory, handle mentorship requests
ProgressService
Save/check lesson progress, track completed lessons
BlocklyEvaluationService
Receives code from frontend, sandboxed execution, returns pass/fail (MVP optional)

Note: No separate backend servers needed; Supabase Edge Functions replace Spring Boot/Express.

3. Supabase Database (PostgreSQL)
   Schema (updated)
   Users / Roles
   auth.users → base auth table

youth
| id (FK auth.users) | email | display_name | band | created_at | updated_at |

mentors
| id (FK auth.users) | bio | expertise | region | band | photo_url | created_at | updated_at |

admins
| id (FK auth.users) | display_name | created_at | updated_at |

Lessons
| id | title | story_theme | description | blockly_xml_template | difficulty | created_at | updated_at |
Lesson Stories
| id | lesson_id | body | created_at | updated_at |
Lesson Progress
| id | user_id | lesson_id | completed | progress_json | created_at | updated_at |
Mentorship Requests
| id | youth_id | mentor_id | status (pending/accepted/rejected) | message | created_at | updated_at |
Meetings
| id | youth_id | mentor_id | url | scheduled_datetime | status (scheduled/completed/cancelled) | created_at | updated_at |

4. API Endpoints (Edge Functions)
   Lessons
   GET /lessons → list all lessons

GET /lessons/{id} → get single lesson

POST /lessons → create/edit lesson

GET /users/{id}/progress → fetch lesson progress

POST /progress → save lesson progress

Mentors
GET /mentors → mentor directory

GET /mentors/{id} → mentor profile

POST /mentorship-request → request mentorship

Meetings
GET /meetings/{user_id} → fetch user meetings

POST /meetings/{user_id} → schedule meeting

POST /meetings/cancel/{meeting_id} → cancel meeting

Notes:
RLS policies secure data per role

Supabase Auth enforces authentication

Optional custom Edge Functions for more complex logic (e.g., Blockly evaluation)

5. Extra Features
   Admin Page: Create/edit lessons, approve mentors

Cultural Consultation Layer: Glossary, audio clips, cultural notes

Media Storage
Mentor photos, story images, audio clips in Supabase Storage

Team Breakdown (Updated)
Hacker 1 — Frontend Lead
Build core UI pages (Home, Learning, About, Login/Signup)

Create routing, layouts, placeholders

Supabase Auth integration for login/signup

Hacker 2 — Lesson System Engineer
Blockly integration, story + coding goal panel

Run Blockly code (local JS or optional backend eval)

Fetch/save progress via Supabase API

Hacker 3 — Edge Function Lead
Implement Edge Functions for lessons, progress, mentors, mentorship requests, meetings

Replace Spring Boot backend with serverless functions

Hacker 4 — Supabase / Database Architect
Create DB tables, RLS policies, triggers for auto-creating youth/mentor/admin on signup

Configure Auth and Storage

Seed example lessons, mentors, and stories

Hacker 5 — Mentorship Feature Engineer
Build Mentor List + Profile pages, mentorship request workflow

Connect frontend to Edge Functions for CRUD, meetings

Ensure end-to-end mentorship flow works

6. Notes on Workflow
   Supabase Auth triggers create the appropriate role-specific row (youth, mentor, admin) on signup.

RLS policies ensure users can only access their own data.

Edge Functions replace all traditional backend services.

Frontend interacts directly with Supabase (DB + Edge Functions) via REST calls or Supabase JS client.

This draft now reflects:
Supabase as backend + auth

Separate role tables (no role column)

updated_at added to relevant tables

No Spring Boot/Express required
