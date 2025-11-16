'use client';
import { getMentorCount } from "@/components/utils/mentorUtils";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Users, Award, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Mentor } from './utils/mockData';
import { TopicLesson, Topic } from './utils/learningMapData';
interface LessonWithTopic extends TopicLesson {
  topic: Topic;
  progress: number;
}

const NEW_HERO_IMAGE_URL = 'https://t3.ftcdn.net/jpg/00/74/65/96/360_F_74659654_E0VLKWSUlCUzlHKQskuTp2P3wC8kIvNN.jpg';
const ABOUT_IMAGE_URL = 'https://images.unsplash.com/photo-1637177304935-382b60b372cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlbSUyMHBvbGUlMjBhcnR8ZW58MXx8fHwxNzYzMjYyNDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';


export default function Home() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalInProgress: 0,
    connectedMentorsCount: 0,
  });

  const [inProgressLessons, setInProgressLessons] = useState<LessonWithTopic[]>([]);
  const [connectedMentors, setConnectedMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    async function loadDashboardNumbers() {
      // 1. Get total lessons count
      const totalLessons = 842
      const totalInProgressLessons = 241
      const totalMentors = await getMentorCount();

      setStats({
        totalCompleted: totalLessons,
        totalInProgress: totalInProgressLessons,
        connectedMentorsCount: totalMentors,
      });
    }

    loadDashboardNumbers();
  }, []);

  useEffect(() => {
    async function loadRandomMentors() {
      try {
        const response = await fetch('/api/mentors/random');
        if (response.ok) {
          const mentors = await response.json();
          setConnectedMentors(mentors);
        } else {
          console.error('Failed to fetch random mentors');
        }
      } catch (error) {
        console.error('Error fetching random mentors:', error);
      }
    }

    loadRandomMentors();
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          {/* Main Hero Image */}
          <ImageWithFallback
              src={NEW_HERO_IMAGE_URL}
              alt="Indigenous youth in a group learning setting"
              className="w-full h-full object-cover brightness-75 block"
          />

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles size={32} className="text-amber-400 animate-pulse" />
                <h1 className="text-4xl md:text-6xl text-white">Tech Lelem</h1>
                <Sparkles size={32} className="text-amber-400 animate-pulse" />
              </div>
              <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                Learn programming through our stories, guided by our community
              </p>
              
              {/* === START: Button Group (Start Learning + Mentor Portal) === */}
              <div className="flex justify-center gap-4">
                
                {/* Primary Button: Start Learning */}
                <button
                    onClick={() => router.push('/lessons')}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 rounded-xl transition-all shadow-2xl hover:shadow-amber-500/50 inline-flex items-center gap-3 text-lg"
                >
                  Start Learning
                  <ArrowRight size={24} />
                </button>
              </div>
              {/* === END: Button Group === */}
              
            </div>
          </div>
        </section>

        {/* Stats Dashboard */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100">
              <div className="flex items-center gap-5">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg">
                  <Award className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-stone-600 text-base mb-1">Completed Lessons</p>
                  <p className="text-3xl text-stone-900">{stats.totalCompleted}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-blue-100">
              <div className="flex items-center gap-5">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl shadow-lg">
                  <TrendingUp className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-stone-600 text-base mb-1">In Progress</p>
                  <p className="text-3xl text-stone-900">{stats.totalInProgress}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-amber-100">
              <div className="flex items-center gap-5">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                  <Users className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-stone-600 text-base mb-1">Connected Mentors</p>
                  <p className="text-3xl text-stone-900">{stats.connectedMentorsCount}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connected Mentors */}
        <section className="bg-amber-50 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-amber-900 text-2xl font-bold">Our Mentors</h2>
              <button
                  onClick={() => router.push('/mentors')}
                  className="text-amber-700 hover:text-amber-900 flex items-center gap-2"
              >
                Find More Mentors
                <ArrowRight size={18} />
              </button>
            </div>
            {connectedMentors.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {connectedMentors.map((mentor) => (
                      <div
                          key={mentor.id}
                          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                          onClick={() => router.push(`/mentors/${mentor.id}`)}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-200">
                            <ImageWithFallback src={mentor.imageUrl} alt={mentor.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="text-amber-900 text-lg font-semibold">{mentor.name}</h3>
                            <p className="text-sm text-stone-600">{mentor.title}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.slice(0, 3).map((skill: string, idx: number) => (
                              <span key={idx} className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded">
                        {skill}
                      </span>
                          ))}
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <Users className="mx-auto text-stone-400 mb-4" size={48} />
                  <p className="text-stone-600 mb-4">Connect with mentors to guide your learning journey</p>
                  <button
                      onClick={() => router.push('/mentors')}
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Browse Mentors
                  </button>
                </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-200">
              <ImageWithFallback
                  src={ABOUT_IMAGE_URL}
                  alt="Traditional totem pole art"
                  className="w-full h-full object-cover block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-lg">Honoring our heritage through technology</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={32} className="text-amber-500" />
                <h2 className="text-amber-900 text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-stone-700 mb-5 text-lg leading-relaxed">
                Tech Lelum combines traditional storytelling with modern programming education, creating a culturally relevant pathway for Indigenous youth to enter the technology field.
              </p>
              <p className="text-stone-700 mb-5 text-lg leading-relaxed">
                Every lesson integrates various Indigenous stories, languages, values, and knowledge with fundamental programming concepts, making coding education meaningful and connected to our culture.
              </p>
              <p className="text-stone-700 mb-6 text-lg leading-relaxed">
                Just as totem poles tell stories and preserve our history, code allows us to create and share our narratives with the world.
              </p>
              <button
                  onClick={() => router.push('/about')}
                  className="text-amber-700 hover:text-white bg-amber-50 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 px-6 py-3 rounded-xl transition-all flex items-center gap-2 border-2 border-amber-200 hover:border-transparent shadow-md hover:shadow-xl"
              >
                Learn More About Us
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>
            <footer className="footer">
                <p>© 2025 Indigenous Youth Code. All rights reserved.</p>
                <p>Built with respect for Coast Salish traditions and territories.</p>
            </footer>
      </div>
  );
}