'use client';

import { useRouter } from 'next/navigation';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Target, Heart, Users, Lightbulb, ArrowRight } from 'lucide-react';

export default function About() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1606239763507-f44d0c248629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIweW91dGglMjBsZWFybmluZ3xlbnwxfHx8fDE3NjMyNTgzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Indigenous youth learning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl text-white mb-4">About Indigenous Youth Code</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Bridging traditional knowledge and modern technology
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-amber-900 mb-6">Our Mission</h2>
            <p className="text-stone-700 mb-4 text-lg">
              Indigenous Youth Code is dedicated to lowering barriers for Indigenous youth entering the technology field by creating a culturally relevant, story-based learning platform.
            </p>
            <p className="text-stone-700 mb-4">
              We believe that programming education should honor and integrate Indigenous knowledge, stories, and values. By connecting traditional storytelling with computational thinking, we create meaningful pathways to tech careers.
            </p>
            <p className="text-stone-700">
              Every lesson is designed with input from Indigenous educators, knowledge keepers, and tech professionals to ensure cultural authenticity and educational effectiveness.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1629481317043-16b1343d77d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBlZHVjYXRpb24lMjBjbGFzc3Jvb218ZW58MXx8fHwxNzYzMjU4Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Learning together"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-amber-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-amber-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-amber-900 text-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h3 className="text-amber-900 mb-3">Cultural Respect</h3>
              <p className="text-stone-700">
                Honoring Indigenous knowledge systems and integrating cultural protocols in all we do.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-900 text-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-amber-900 mb-3">Community-Centered</h3>
              <p className="text-stone-700">
                Building connections between learners, mentors, and the broader Indigenous tech community.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-900 text-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb size={32} />
              </div>
              <h3 className="text-amber-900 mb-3">Innovation</h3>
              <p className="text-stone-700">
                Creating new approaches to tech education that honor tradition while embracing the future.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-900 text-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} />
              </div>
              <h3 className="text-amber-900 mb-3">Accessibility</h3>
              <p className="text-stone-700">
                Removing barriers and ensuring that all Indigenous youth can access quality tech education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center text-amber-900 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-amber-900 mb-3">1. Story-Based Lessons</h3>
            <p className="text-stone-700">
              Learn programming concepts through Coast Salish stories and traditions. Each lesson connects cultural knowledge with coding skills.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-amber-900 mb-3">2. Hands-On Coding</h3>
            <p className="text-stone-700">
              Use Blockly's visual programming interface to build programs. No prior experience needed - just curiosity and creativity.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-amber-900 mb-3">3. Mentor Guidance</h3>
            <p className="text-stone-700">
              Connect with Indigenous tech professionals who understand your journey and can guide your learning and career path.
            </p>
          </div>
        </div>
      </section>

      {/* The Why */}
      <section className="bg-gradient-to-br from-amber-900 to-orange-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-amber-50 mb-8">Why This Matters</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-amber-100 text-lg mb-6 text-center">
              Indigenous people are significantly underrepresented in technology fields. Yet Indigenous knowledge systems have always emphasized problem-solving, innovation, and community care - the very skills that make great technologists.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-amber-100 mb-2">The Challenge</h3>
                <p className="text-amber-200 text-sm">
                  Traditional coding education often feels disconnected from Indigenous learners' cultural backgrounds and values, creating unnecessary barriers to entry.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-amber-100 mb-2">Our Solution</h3>
                <p className="text-amber-200 text-sm">
                  By grounding tech education in familiar stories and cultural contexts, we make programming accessible, relevant, and empowering for Indigenous youth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center text-amber-900 mb-12">Our Vision for Impact</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl text-amber-900 mb-2">1000+</div>
            <p className="text-stone-700">Youth Empowered</p>
          </div>
          <div className="text-center">
            <div className="text-5xl text-amber-900 mb-2">50+</div>
            <p className="text-stone-700">Indigenous Mentors</p>
          </div>
          <div className="text-center">
            <div className="text-5xl text-amber-900 mb-2">8</div>
            <p className="text-stone-700">Story-Based Lessons</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-amber-900 mb-6">Join Our Community</h2>
          <p className="text-stone-700 text-lg mb-8">
            Whether you're a young learner, an experienced tech professional, or a community member who wants to support, there's a place for you in Indigenous Youth Code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/protected')}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Start Learning
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => router.push('/mentors')}
              className="bg-white text-amber-900 border-2 border-amber-600 px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Meet Our Mentors
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
