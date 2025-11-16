'use client';

import { useState, useEffect } from 'react';
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

export default function MentorAuthPage() {
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

  // Apply centered, min-height screen only when showing the sign-in (so it vertically centers)
  return (
    <div className={`flex w-full ${currentSection === 'mentor-signin' ? 'min-h-screen items-center justify-center' : ''}`}>
      <AuthFormWrapper onNavigate={handleNavigate} isLogin={currentSection === 'mentor-signin'} />
    </div>
  );
}
