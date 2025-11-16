'use client';

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const onNavigate = (section: string, id?: string) => {
    switch (section) {
      case 'home':
        router.push('/');
        break;
      case 'mentor-application':
        router.push('/auth?view=application');
        break;
      case 'mentors':
        router.push('/mentors');
        break;
      case 'profile':
        if (id) router.push(`/mentors/${id}`);
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-16 py-8">
        <div className="w-full max-w-5xl">
          <LoginForm onNavigate={onNavigate} />
        </div>
      </main>
    </div>
  );
}
