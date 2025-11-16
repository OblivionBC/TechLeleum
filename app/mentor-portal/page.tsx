// AuthFormWrapper + MentorAuthPage (fixed)
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { LoginForm } from "@/components/login-form";
import { MentorApplicationForm } from "../../components/mentor-application-form"; 

type MentorAuthSection = 'mentor-signin' | 'mentor-application' | 'home' | 'mentors' | string;

interface AuthFormWrapperProps {
  onNavigate: (section: string, id?: string) => void;
  isLogin: boolean;
}

const AuthFormWrapper = ({ onNavigate, isLogin }: AuthFormWrapperProps) => {
  return (
    <div className="w-full">
      {isLogin ? (
        // === Mentor Sign In View ===
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Mentor Sign In</h2>
        
          <LoginForm onNavigate={onNavigate} />
          <p className="mt-4 text-center text-sm">
            Not registered?{' '}
            <button 
              className="text-amber-600 hover:underline"
              onClick={() => onNavigate('mentor-application')}
            >
              Apply to be a Mentor
            </button>
          </p>
        </div>
      ) : (
        // === Mentor Application View (Uses the new component) ===
        <MentorApplicationForm onNavigate={onNavigate} />
      )}
    </div>
  );
}


export default function MentorAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const getInitialView = (): 'mentor-signin' | 'mentor-application' => {
    return (searchParams.get('view') === 'application' ? 'mentor-application' : 'mentor-signin');
  };

  const [currentSection, setCurrentSection] = useState<'mentor-signin' | 'mentor-application'>(getInitialView());

  useEffect(() => {
    const viewParam = searchParams.get('view');
    const newState = viewParam === 'application' ? 'mentor-application' : 'mentor-signin';
    setCurrentSection(newState);
  }, [searchParams]);

  const handleNavigate = (section: string, id?: string) => {
    if (section === 'home') {
      router.push('/');
    } else if (section === 'mentors') {
      router.push('/mentors');
    } else {
      setCurrentSection(section as 'mentor-signin' | 'mentor-application');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className={`flex w-full ${currentSection === 'mentor-signin' ? 'min-h-svh items-center justify-center p-6 md:p-10' : ''}`}>
      <AuthFormWrapper 
        onNavigate={handleNavigate}
        isLogin={currentSection === 'mentor-signin'}
      />
    </div>
  );
}
