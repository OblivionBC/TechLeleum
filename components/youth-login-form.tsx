'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { UserCircle, Lock, ArrowLeft, GraduationCap, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function YouthLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Failed to sign in. Please try again.');
        setIsLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from('youth')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        setError('Error checking your profile. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push('/');
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
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-amber-200" />
            <h1 className="text-5xl mb-4 text-amber-50">Youth Sign In</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Continue your learning journey with Tech Lelum
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
                <UserCircle className="w-6 h-6 text-amber-700" />
                Youth Portal Sign In
              </CardTitle>
              <CardDescription className="text-amber-900">
                Sign in to access your lessons and learning progress
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSignIn} className="space-y-6">
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
                    // ✨ FIX APPLIED: Using text-black and placeholder-gray-500
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-black placeholder-gray-500" 
                  />
                </div>

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
                    // ✨ FIX APPLIED: Using text-black and placeholder-gray-500
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-black placeholder-gray-500" 
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
                    <GraduationCap className="w-5 h-5 mr-2" />
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <p className="text-sm text-center text-amber-700 mt-4">
                    Access your personalized learning journey
                  </p>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t border-amber-200 bg-amber-50/50">
              <div className="text-center text-sm text-amber-900">
                Don't have an account?
              </div>
              <Button 
                onClick={() => router.push('/youth-sign-up')}
                variant="outline"
                className="w-full border-2 border-amber-600 text-amber-900 hover:bg-amber-100 hover:border-amber-700"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Sign Up for Youth Account
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8 p-6 bg-white/80 backdrop-blur rounded-xl border-2 border-amber-200 shadow-lg">
            <h3 className="text-amber-950 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              What You Can Do
            </h3>
            <ul className="space-y-2 text-amber-900">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Access interactive coding lessons and tutorials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Track your learning progress and achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Connect with mentors in the Indigenous tech community</span>
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