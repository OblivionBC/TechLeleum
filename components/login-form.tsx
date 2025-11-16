import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { UserCircle, Lock, UserPlus, Users } from 'lucide-react';
import { getMentorApplications } from './utils/mentorUtils';

interface MentorSignInProps {
  onNavigate: (section: string, id?: string) => void;
}

export function LoginForm({ onNavigate }: MentorSignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if mentor exists in localStorage (approved mentors)
    const approvedMentors = localStorage.getItem('approvedMentors');
    const mentors = approvedMentors ? JSON.parse(approvedMentors) : [];
    
    const mentor = mentors.find((m: any) => m.email === email);
    
    if (mentor && mentor.approved) {
      // Sign in successful - store session
      localStorage.setItem('mentorSession', JSON.stringify({ email, name: mentor.name }));
      // Navigate to mentor dashboard (future implementation)
      alert('Sign in successful! Mentor dashboard coming soon.');
    } else if (mentor && !mentor.approved) {
      setError('Your application is still under review. Please check back later.');
    } else {
      // Check if there's a pending application
      const applications = getMentorApplications();
      const pendingApp = applications.find((app: any) => app.email === email && app.status === 'pending');
      
      if (pendingApp) {
        setError('Your application is currently under review. You will be notified once it has been processed.');
      } else {
        setError('Invalid credentials or mentor account not found. Please apply to become a mentor first.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1606239763507-f44d0c248629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIweY91dgluZ3xlbnwxfHx8fDE3NjMyNTgzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Indigenous community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 via-amber-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <Users className="w-16 h-16 mx-auto mb-4 text-amber-200" />
            <h1 className="text-5xl mb-4 text-amber-50">Mentor Sign In</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Guiding the next generation of Indigenous technologists
            </p>
          </div>
        </div>
      </section>

      {/* Sign In Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-amber-200 shadow-xl bg-white/95 backdrop-blur">
            <CardHeader className="space-y-1 bg-gradient-to-br from-amber-50 to-orange-50 border-b-2 border-amber-200">
              <CardTitle className="flex items-center gap-2 text-amber-950">
                <UserCircle className="w-6 h-6 text-amber-700" />
                Mentor Portal
              </CardTitle>
              <CardDescription className="text-amber-900">
                Sign in to access your mentor dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-950">
                    Email Address
                  </Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="mentor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-amber-950">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    <p>{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-amber-200 bg-amber-50/50">
              <div className="text-center text-sm text-amber-900">
                Not a mentor yet?
              </div>
              <Button 
                onClick={() => onNavigate('mentor-application')}
                variant="outline"
                className="w-full border-2 border-amber-600 text-amber-900 hover:bg-amber-100 hover:border-amber-700"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Apply to Become a Mentor
              </Button>
            </CardFooter>
          </Card>

          {/* Additional Info Section */}
          <div className="mt-8 p-6 bg-white/80 backdrop-blur rounded-xl border-2 border-amber-200 shadow-lg">
            <h3 className="text-amber-950 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-700" />
              Why Become a Mentor?
            </h3>
            <ul className="space-y-2 text-amber-900">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Guide Indigenous youth in their technology journey</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Share your expertise and cultural knowledge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Build connections within the Indigenous tech community</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Help preserve culture while teaching modern skills</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Decorative Cultural Elements */}
      <div className="fixed bottom-8 left-8 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-24 h-48 bg-gradient-to-b from-amber-800 to-amber-950 rounded-lg"></div>
      </div>
      <div className="fixed top-32 right-8 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-24 h-48 bg-gradient-to-b from-orange-800 to-orange-950 rounded-lg"></div>
      </div>
    </div>
  );
}