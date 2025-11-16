export interface Lesson {
  id: string;
  title: string;
  story_theme: string;
  description: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
  inputs: [];
  expected_outputs: [];
}

export interface Mentor {
  id: string;
  display_name: string;
  title: string;
  techField: string;
  region: string;
  availability: "available" | "limited" | "unavailable";
  bio: string;
  expertise: string[];
  band: string;
  photo_url: string;
  connected?: boolean;
}


export const mentors: Mentor[] = [
  {
    id: "1",
    display_name: "Dr. Sarah Whitebear",
    title: "Senior Software Engineer",
    techField: "Web Development",
    region: "Pacific Northwest",
    availability: "available",
    bio: "Dr. Sarah Whitebear is a Musqueam software engineer with over 15 years of experience in web development and cloud computing. She is passionate about creating pathways for Indigenous youth in technology.",
    expertise: ["React", "Node.js", "Cloud Architecture", "Mobile Apps"],
    band: "Musqueam Nation",
    photo_url:
      "https://images.unsplash.com/photo-1710488140888-88896ecafdcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIwd29tYW4lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMjYwNTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "2",
    display_name: "Marcus Daniels",
    title: "Game Developer",
    techField: "Game Development",
    region: "British Columbia",
    availability: "available",
    bio: "Marcus specializes in creating educational games that incorporate Indigenous stories and teachings. He believes games can be powerful tools for cultural preservation.",
    expertise: ["Unity", "C#", "Game Design", "3D Modeling"],
    band: "Squamish Nation",
    photo_url:
      "https://images.unsplash.com/photo-1584348075595-8afb0a0a0c25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXRpdmUlMjBhbWVyaWNhbiUyMG1hbiUyMGZyaWVuZGx5fGVufDF8fHx8MTc2MzI2MDUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "3",
    display_name: "Jessica Redcrow",
    title: "Data Scientist",
    techField: "Data Science",
    region: "Coast Salish Territory",
    availability: "limited",
    bio: "Jessica uses data science to address environmental and health issues in Indigenous communities. She is committed to data sovereignty and ethical AI.",
    expertise: ["Python", "Machine Learning", "Data Visualization", "R"],
    band: "Tsleil-Waututh Nation",
    photo_url:
      "https://images.unsplash.com/photo-1666902715814-691194b2f45f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIwd29tYW4lMjBwcm9mZXNzaW9uYWwlMjBzbWlsZXxlbnwxfHx8fDE3NjMyNjA1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "4",
    display_name: "Thomas Eaglespeaker",
    title: "Cybersecurity Specialist",
    techField: "Cybersecurity",
    region: "Vancouver Island",
    availability: "available",
    bio: "Thomas protects Indigenous organizations from cyber threats and teaches digital sovereignty. He believes secure technology is essential for Indigenous self-determination.",
    expertise: [
      "Network Security",
      "Ethical Hacking",
      "Privacy",
      "Cryptography",
    ],
    band: "Coast Salish",
    photo_url:
      "https://images.unsplash.com/photo-1727551309641-16395c7eacd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJzdCUyMG5hdGlvbnMlMjBwZXJzb24lMjB3YXJtfGVufDF8fHx8MTc2MzI2MDUyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "5",
    display_name: "Lisa Silverfox",
    title: "UX/UI Designer",
    techField: "Design",
    region: "Pacific Northwest",
    availability: "available",
    bio: "Lisa designs user interfaces that center Indigenous perspectives and aesthetics. She advocates for culturally responsive design practices.",
    expertise: [
      "Figma",
      "Adobe Creative Suite",
      "User Research",
      "Accessibility",
    ],
    band: "Musqueam Nation",
    photo_url:
      "https://images.unsplash.com/photo-1583504931326-e9c4ce222a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXRpdmUlMjB3b21hbiUyMG1vZGVybnxlbnwxfHx8fDE3NjMyNjA1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "6",
    display_name: "Robert Thundercloud",
    title: "Mobile App Developer",
    techField: "Mobile Development",
    region: "British Columbia",
    availability: "limited",
    bio: "Robert builds mobile apps focused on language revitalization and cultural education. His apps have helped thousands learn Indigenous languages.",
    expertise: ["iOS", "Android", "React Native", "Flutter"],
    band: "Stó:lō Nation",
    photo_url:
      "https://rhf-frh.ca/wp-content/uploads/2023/12/Rachel-Mishenene.png",
  },
];
