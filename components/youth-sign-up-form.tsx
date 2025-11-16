'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { UserCircle, Lock, ArrowLeft, GraduationCap, Sparkles, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function YouthSignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [band, setBand] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!displayName.trim()) {
      setError('Display Name is required.');
      setIsLoading(false);
      return;
    }
    
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: { display_name: displayName.trim() },
        },
      });

      if (authError) {
        setError(authError.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from('youth')
        .insert({
          id: authData.user.id,
          display_name: displayName.trim(),
          band: band || null,
          photo_url: null,
        });

      if (profileError) {
        console.error('Profile insertion error:', profileError);
        setError('Account created but profile setup failed. You can complete your profile later.');
      }

      router.push('/auth/sign-up-success');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      <section className="relative h-[40vh] overflow-hidden">
        <ImageWithFallback
          src="https://schools.wrdsb.ca/athome/files/2020/06/nad1170px_1432040617140_eng.jpg"
          alt="Indigenous youth learning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 via-amber-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-amber-200" />
            <h1 className="text-5xl mb-4 text-amber-50">Join Tech Leleum</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Start your journey in technology and coding
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="mb-6 text-amber-900 hover:bg-amber-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="border-2 border-amber-200 shadow-xl bg-white/95 backdrop-blur">
            <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 border-b-2 border-amber-200">
              <CardTitle className="flex items-center gap-2 text-amber-950">
                <UserPlus className="w-6 h-6 text-amber-700" />
                Create Youth Account
              </CardTitle>
              <CardDescription className="text-amber-900">
                Sign up to start your learning journey with Tech Leleum
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSignUp} className="space-y-6">
                
                {/* Display Name Field (Fixed text color) */}
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-amber-950 flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required 
                    disabled={isLoading}
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-gray-900 placeholder-gray-500" // ✨ ADDED text-gray-900
                  />
                  <p className="text-xs text-amber-700">This is how others will see your name (Required)</p>
                </div>

                {/* Band / Community Field (Fixed text color) */}
                <div className="space-y-2">
                  <Label htmlFor="band" className="text-amber-950">
                    Band / Community (Optional)
                  </Label>
                  <Input
                    id="band"
                    type="text"
                    placeholder="Your band or community"
                    value={band}
                    onChange={(e) => setBand(e.target.value)}
                    disabled={isLoading}
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-gray-900 placeholder-gray-500" // ✨ ADDED text-gray-900
                  />
                </div>

                {/* Email Address Field (Fixed text color) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-950 flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-gray-900 placeholder-gray-500" // ✨ ADDED text-gray-900
                  />
                </div>

                {/* Password Field (Fixed text color) */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-amber-950 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-gray-900 placeholder-gray-500" // ✨ ADDED text-gray-900
                  />
                  <p className="text-xs text-amber-700">Must be at least 6 characters</p>
                </div>

                {/* Confirm Password Field (Fixed text color) */}
                <div className="space-y-2">
                  <Label htmlFor="repeatPassword" className="text-amber-950 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <Input
                    id="repeatPassword"
                    type="password"
                    placeholder=""
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-gray-900 placeholder-gray-500" // ✨ ADDED text-gray-900
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    <p>{error}</p>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-amber-200">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg py-6"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {isLoading ? 'Creating your account...' : 'Create Account'}
                  </Button>
                  <p className="text-sm text-center text-amber-700 mt-4">
                    By signing up, you agree to start your learning journey with us
                  </p>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t border-amber-200 bg-amber-50/50">
              <div className="text-center text-sm text-amber-900">
                Already have an account?
              </div>
              <Button 
                onClick={() => router.push('/youth-login')}
                variant="outline"
                className="w-full border-2 border-amber-600 text-amber-900 hover:bg-amber-100 hover:border-amber-700"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Sign In Instead
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8 p-6 bg-white/80 backdrop-blur rounded-xl border-2 border-amber-200 shadow-lg">
            <h3 className="text-amber-950 mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-700" />
              What You'll Get
            </h3>
            <ul className="space-y-2 text-amber-900">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Access to interactive coding lessons and tutorials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Track your progress and earn achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Connect with mentors from the Indigenous tech community</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Build projects that celebrate your culture and heritage</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="fixed bottom-8 right-8 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-24 h-48 bg-gradient-to-b from-amber-800 to-amber-950 rounded-lg"></div>
      </div>
    </div>
  );
}

