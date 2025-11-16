export interface Lesson {
  id: string;
  title: string;
  storyTheme: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  culturalContext: string;
  codingGoal: string;
  storyPrompt: string;
  imageUrl: string;
  estimatedTime: string;
  completed?: boolean;
  progress?: number;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  techField: string;
  region: string;
  availability: 'available' | 'limited' | 'unavailable';
  bio: string;
  expertise: string[];
  culturalBackground: string;
  imageUrl: string;
  connected?: boolean;
}

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Raven Steals the Sun',
    storyTheme: 'Raven Stories',
    topic: 'Conditionals',
    difficulty: 'beginner',
    description: 'Learn decision-making with conditionals through the story of Raven bringing light to the world.',
    culturalContext: 'In Coast Salish tradition, Raven is a trickster and transformer who brought light to the world. This story teaches us about making decisions and choosing paths.',
    codingGoal: 'Use IF/ELSE blocks to help Raven make decisions on his journey to steal the sun and bring light to the people.',
    storyPrompt: 'Raven sees the world is dark and the people are struggling. He must decide: should he fly to the Sky Chief\'s house? If the door is open, enter quietly. If it\'s closed, transform into a pine needle.',
    imageUrl: 'https://images.unsplash.com/photo-1636517618500-d0a917a69491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXZlbiUyMGJpcmQlMjBteXRob2xvZ3l8ZW58MXx8fHwxNzYzMjU4Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    estimatedTime: '30 min',
  },
  {
    id: '2',
    title: 'Basket Weaving Patterns',
    storyTheme: 'Traditional Crafts',
    topic: 'Loops',
    difficulty: 'beginner',
    description: 'Discover the power of loops by creating repeating patterns inspired by traditional basket weaving.',
    culturalContext: 'Coast Salish basket weavers create intricate patterns through repetition and precision. Each pattern tells a story and serves a purpose.',
    codingGoal: 'Use FOR loops to create repeating patterns, just like the repetitive weaving motions that create beautiful baskets.',
    storyPrompt: 'A master weaver teaches you that to create a strong basket, you must repeat the same weaving pattern over and over. Can you help create the pattern using loops?',
    imageUrl: 'https://images.unsplash.com/photo-1708434866032-90aedbeddabb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIwYXJ0JTIwcGF0dGVybnN8ZW58MXx8fHwxNzYzMjU3Njg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    estimatedTime: '25 min',
  },
  {
    id: '3',
    title: 'Canoe Navigation',
    storyTheme: 'Canoe Journey',
    topic: 'Variables',
    difficulty: 'beginner',
    description: 'Learn about variables by tracking a canoe\'s journey across the waters.',
    culturalContext: 'Canoe journeys are sacred traditions that connect communities. Navigators must track distance, direction, and resources.',
    codingGoal: 'Create variables to track the canoe\'s position, speed, and supplies as it travels between villages.',
    storyPrompt: 'Your family\'s canoe is preparing for a journey to visit neighboring communities. You must keep track of how far you\'ve traveled, how much food remains, and your current location.',
    imageUrl: 'https://images.unsplash.com/photo-1759755487060-c8a5f9a190a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNhbm9lJTIwd2F0ZXJ8ZW58MXx8fHwxNzYzMjU4Mzk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    estimatedTime: '20 min',
  },
  {
    id: '4',
    title: 'Salmon Run Simulation',
    storyTheme: 'Natural Cycles',
    topic: 'Events',
    difficulty: 'intermediate',
    description: 'Understand event-driven programming through the annual salmon run cycle.',
    culturalContext: 'The salmon run is central to Coast Salish life, providing food and spiritual connection. Communities prepare and respond to the salmon\'s return.',
    codingGoal: 'Program events that trigger when salmon arrive, when nets are cast, and when the catch is brought to shore.',
    storyPrompt: 'The salmon are returning! The community must respond to different events: when salmon enter the river, when eagles appear, when the tide changes. Each event requires a different action.',
    imageUrl: 'https://images.unsplash.com/photo-1747607022973-a3618f7c6447?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNpZmljJTIwbm9ydGh3ZXN0JTIwbmF0dXJlfGVufDF8fHx8MTc2MzI1NzY4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    estimatedTime: '40 min',
  },
  {
    id: '5',
    title: 'Transformer Stories: Changing Forms',
    storyTheme: 'Transformer Stories',
    topic: 'Functions',
    difficulty: 'intermediate',
    description: 'Learn about functions through transformer beings who change between forms.',
    culturalContext: 'Transformer stories tell of powerful beings who shaped the land and people. They could change forms and teach important lessons.',
    codingGoal: 'Create functions that transform objects from one form to another, just like the Transformers changed mountains, rivers, and people.',
    storyPrompt: 'The Transformer travels through the land, changing selfish people into rocks and generous people into cedar trees. Create transformation functions for different beings.',
    imageUrl: 'https://images.unsplash.com/photo-1708434866032-90aedbeddabb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIwYXJ0JTIwcGF0dGVybnN8ZW58MXx8fHwxNzYzMjU3Njg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    estimatedTime: '35 min',
  },
  {
    id: '6',
    title: 'Potlatch Gift Distribution',
    storyTheme: 'Community Ceremonies',
    topic: 'Arrays',
    difficulty: 'intermediate',
    description: 'Master arrays by organizing and distributing gifts at a potlatch ceremony.',
    culturalContext: 'Potlatches are ceremonies where hosts distribute gifts to guests, honoring relationships and demonstrating generosity.',
    codingGoal: 'Use arrays to organize guests, gifts, and distribution order. Ensure everyone receives appropriate gifts based on their role.',
    storyPrompt: 'Your family is hosting a potlatch. You must organize the guest list, track all the gifts (blankets, tools, food), and ensure proper distribution according to tradition.',
    imageUrl: 'https://images.unsplash.com/photo-1606239763507-f44d0c248629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIweW91dGglMjBsZWFybmluZ3xlbnwxfHx8fDE3NjMyNTgzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    estimatedTime: '45 min',
  },
  {
    id: '7',
    title: 'Cedar Tree Processing',
    storyTheme: 'Traditional Crafts',
    topic: 'Algorithms',
    difficulty: 'advanced',
    description: 'Build complex algorithms based on the step-by-step process of harvesting and using cedar.',
    culturalContext: 'Cedar is a gift from the Creator. Every part is used with respect and gratitude. The process of harvesting and preparing cedar follows specific steps.',
    codingGoal: 'Create an algorithm that follows the traditional steps: prayer, harvesting bark, stripping, drying, and preparing for weaving.',
    storyPrompt: 'You are learning from an elder how to respectfully harvest cedar bark. Each step must be done in order and with proper protocols. Program the complete process.',
    imageUrl: 'https://images.unsplash.com/photo-1747607022973-a3618f7c6447?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNpZmljJTIwbm9ydGh3ZXN0JTIwbmF0dXJlfGVufDF8fHx8MTc2MzI1NzY4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    estimatedTime: '50 min',
  },
  {
    id: '8',
    title: 'Winter Dance Choreography',
    storyTheme: 'Community Ceremonies',
    topic: 'Sequences',
    difficulty: 'advanced',
    description: 'Program complex sequences by choreographing traditional dance movements.',
    culturalContext: 'Winter dances are sacred ceremonies with specific movements, songs, and timing. Each element must flow in harmony.',
    codingGoal: 'Create sequences that coordinate multiple dancers, drum beats, and song phases in perfect timing.',
    storyPrompt: 'The winter dance ceremony requires precise coordination. Four dancers must move in sequence with the drums, while singers begin at specific moments. Choreograph the entire ceremony.',
    imageUrl: 'https://images.unsplash.com/photo-1606239763507-f44d0c248629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIweW91dGglMjBsZWFybmluZ3xlbnwxfHx8fDE3NjMyNTgzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    estimatedTime: '55 min',
  },
];

export const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Whitebear',
    title: 'Senior Software Engineer',
    techField: 'Web Development',
    region: 'Pacific Northwest',
    availability: 'available',
    bio: 'Dr. Sarah Whitebear is a Musqueam software engineer with over 15 years of experience in web development and cloud computing. She is passionate about creating pathways for Indigenous youth in technology.',
    expertise: ['React', 'Node.js', 'Cloud Architecture', 'Mobile Apps'],
    culturalBackground: 'Musqueam Nation - Coast Salish. Sarah grew up learning traditional weaving from her grandmother and sees parallels between weaving patterns and coding logic.',
    imageUrl: 'https://images.unsplash.com/photo-1710488140888-88896ecafdcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIwd29tYW4lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMjYwNTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: '2',
    name: 'Marcus Daniels',
    title: 'Game Developer',
    techField: 'Game Development',
    region: 'British Columbia',
    availability: 'available',
    bio: 'Marcus specializes in creating educational games that incorporate Indigenous stories and teachings. He believes games can be powerful tools for cultural preservation.',
    expertise: ['Unity', 'C#', 'Game Design', '3D Modeling'],
    culturalBackground: 'Squamish Nation. Marcus combines his love of storytelling with interactive media to create engaging cultural experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1584348075595-8afb0a0a0c25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXRpdmUlMjBhbWVyaWNhbiUyMG1hbiUyMGZyaWVuZGx5fGVufDF8fHx8MTc2MzI2MDUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: '3',
    name: 'Jessica Redcrow',
    title: 'Data Scientist',
    techField: 'Data Science',
    region: 'Coast Salish Territory',
    availability: 'limited',
    bio: 'Jessica uses data science to address environmental and health issues in Indigenous communities. She is committed to data sovereignty and ethical AI.',
    expertise: ['Python', 'Machine Learning', 'Data Visualization', 'R'],
    culturalBackground: 'Tsleil-Waututh Nation. Jessica applies traditional ecological knowledge alongside modern data analysis techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1666902715814-691194b2f45f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIwd29tYW4lMjBwcm9mZXNzaW9uYWwlMjBzbWlsZXxlbnwxfHx8fDE3NjMyNjA1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: '4',
    name: 'Thomas Eaglespeaker',
    title: 'Cybersecurity Specialist',
    techField: 'Cybersecurity',
    region: 'Vancouver Island',
    availability: 'available',
    bio: 'Thomas protects Indigenous organizations from cyber threats and teaches digital sovereignty. He believes secure technology is essential for Indigenous self-determination.',
    expertise: ['Network Security', 'Ethical Hacking', 'Privacy', 'Cryptography'],
    culturalBackground: 'Coast Salish. Thomas sees protecting digital spaces as an extension of traditional roles as community protectors.',
    imageUrl: 'https://images.unsplash.com/photo-1727551309641-16395c7eacd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJzdCUyMG5hdGlvbnMlMjBwZXJzb24lMjB3YXJtfGVufDF8fHx8MTc2MzI2MDUyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: '5',
    name: 'Lisa Silverfox',
    title: 'UX/UI Designer',
    techField: 'Design',
    region: 'Pacific Northwest',
    availability: 'available',
    bio: 'Lisa designs user interfaces that center Indigenous perspectives and aesthetics. She advocates for culturally responsive design practices.',
    expertise: ['Figma', 'Adobe Creative Suite', 'User Research', 'Accessibility'],
    culturalBackground: 'Musqueam Nation. Lisa incorporates traditional Coast Salish design principles into modern digital interfaces.',
    imageUrl: 'https://images.unsplash.com/photo-1583504931326-e9c4ce222a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXRpdmUlMjB3b21hbiUyMG1vZGVybnxlbnwxfHx8fDE3NjMyNjA1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: '6',
    name: 'Robert Thundercloud',
    title: 'Mobile App Developer',
    techField: 'Mobile Development',
    region: 'British Columbia',
    availability: 'limited',
    bio: 'Robert builds mobile apps focused on language revitalization and cultural education. His apps have helped thousands learn Indigenous languages.',
    expertise: ['iOS', 'Android', 'React Native', 'Flutter'],
    culturalBackground: 'Stó:lō Nation. Robert is dedicated to using technology for language preservation and cultural continuity.',
    imageUrl: 'https://rhf-frh.ca/wp-content/uploads/2023/12/Rachel-Mishenene.png',
  },
];