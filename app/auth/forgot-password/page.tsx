'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Lock, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Page() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (resetError) {
        setError(resetError.message || 'An error occurred');
        setIsLoading(false);
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
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
            <Lock className="w-16 h-16 mx-auto mb-4 text-amber-200" />
            <h1 className="text-5xl mb-4 text-amber-50">Reset Your Password</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              We&apos;ll help you get back into your account
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
                <Lock className="w-6 h-6 text-amber-700" />
                {success ? 'Check Your Email' : 'Reset Password'}
              </CardTitle>
              <CardDescription className="text-amber-900">
                {success 
                  ? 'Password reset instructions sent'
                  : 'Enter your email to receive reset instructions'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-900">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p>Password reset email sent successfully!</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900">
                      If you registered using your email and password, you will receive a password reset email. 
                      Click the link in the email to reset your password.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-amber-950 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
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
                      className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
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
                      <Mail className="w-5 h-5 mr-2" />
                      {isLoading ? 'Sending...' : 'Send Reset Email'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>

            {!success && (
              <CardFooter className="flex flex-col space-y-4 border-t border-amber-200 bg-amber-50/50">
                <div className="text-center text-sm text-amber-900">
                  Remember your password?
                </div>
                <Button
                  onClick={() => router.push('/youth-login')}
                  variant="outline"
                  className="w-full border-2 border-amber-600 text-amber-900 hover:bg-amber-100 hover:border-amber-700"
                >
                  Back to Sign In
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
