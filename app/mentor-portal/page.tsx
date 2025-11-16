'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { MentorApplicationForm } from '@/components/mentor-application-form';

interface AuthFormWrapperProps {
  onNavigate: (section: string, id?: string) => void;
  isLogin: boolean;
}

const AuthFormWrapper = ({ onNavigate, isLogin }: AuthFormWrapperProps) => {
  // Make the form container width consistent for both forms (match MentorApplicationForm)
  if (isLogin) {
    return (
      <section className="py-16 px-4 w-full">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold">Mentor Sign In</h2>
            <p className="text-sm text-amber-700">Sign in to access the mentor dashboard</p>
          </div>

          {/* Ensure LoginForm can expand to the container width */}
          <div className="w-full">
            <LoginForm onNavigate={onNavigate} />
          </div>

          <p className="mt-6 text-center text-sm">
            Not registered?{' '}
            <button
              className="text-amber-600 hover:underline"
              onClick={() => onNavigate('mentor-application')}
            >
              Apply to be a Mentor
            </button>
          </p>
        </div>
      </section>
    );
  }

  // Mentor application keeps its existing look
  return (
    <section className="py-16 px-4 w-full">
      <div className="max-w-3xl mx-auto w-full">
        <MentorApplicationForm onNavigate={onNavigate} />
      </div>
    </section>
  );
};

function MentorAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialView = (): 'mentor-signin' | 'mentor-application' =>
    searchParams?.get('view') === 'application' ? 'mentor-application' : 'mentor-signin';

  const [currentSection, setCurrentSection] = useState<'mentor-signin' | 'mentor-application'>(getInitialView());

  useEffect(() => {
    const viewParam = searchParams?.get('view');
    const newState = viewParam === 'application' ? 'mentor-application' : 'mentor-signin';
    setCurrentSection(newState);
  }, [searchParams]);

  const handleNavigate = (section: string, id?: string) => {
    if (section === 'home') {
      router.push('/');
    } else if (section === 'mentors') {
      router.push('/mentors');
    } else {
      setCurrentSection(section === 'mentor-application' ? 'mentor-application' : 'mentor-signin');
      window.scrollTo(0, 0);
    }
  };

  return (
      <div>
    <div className={`relative flex w-full ${currentSection === 'mentor-signin' ? 'min-h-screen items-center justify-center' : ''} bg-stone-50`}>
      
     <div 
        className="absolute bottom-0 right-0 h-96 w-96 bg-gradient-to-tl from-amber-200 to-orange-100 rounded-2xl transform translate-x-1/2 translate-y-1/2 opacity-30 blur-xl pointer-events-none"
        aria-hidden="true"
      />
      <div className="flex-row">
      <AuthFormWrapper onNavigate={handleNavigate} isLogin={currentSection === 'mentor-signin'} />
      </div>
    </div>
        <footer className="footer">
          <p>© 2025 Indigenous Youth Code. All rights reserved.</p>
          <p>Built with respect for Coast Salish traditions and territories.</p>
        </footer>
      </div>
  );
}

export default function MentorAuthPage() {
  return (
    <Suspense fallback={
      <div className="flex w-full min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    }>
      <MentorAuthContent />
    </Suspense>
  );
}