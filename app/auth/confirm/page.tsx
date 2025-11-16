'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

async function ensureYouthRecord(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data: existing } = await supabase
    .from('youth')
    .select('id')
    .eq('id', userId)
    .single();

  if (!existing) {
    const { data: { user } } = await supabase.auth.getUser();
    const displayName = user?.user_metadata?.display_name || null;
    const band = user?.user_metadata?.band || null;

    const { error } = await supabase
      .from('youth')
      .insert({
        id: userId,
        display_name: displayName,
        band: band,
        photo_url: null,
      });

    if (error) {
      console.error('Failed to create youth record after confirmation:', error);
    }
  }
}

async function handleSuccess(
  supabase: ReturnType<typeof createClient>,
  setStatus: (status: 'success') => void,
  router: { push: (path: string) => void }
) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData?.session?.user) {
    await ensureYouthRecord(supabase, sessionData.session.user.id);
  }
  setStatus('success');
  setTimeout(() => router.push('/'), 2000);
}

export default function ConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleConfirmation = async () => {
      const url = new URL(window.location.href);
      
      let params: URLSearchParams;
      let access_token: string | null = null;
      let refresh_token: string | null = null;
      let type: string | null = null;
      let error: string | null = null;
      let error_description: string | null = null;
      let token_hash: string | null = null;
      let token: string | null = null;
      let code: string | null = null;

      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        params = new URLSearchParams(hash);
        access_token = params.get('access_token');
        refresh_token = params.get('refresh_token');
        type = params.get('type');
        error = params.get('error');
        error_description = params.get('error_description');
        code = params.get('code');
      }
      
      params = url.searchParams;
      if (!access_token) access_token = params.get('access_token');
      if (!refresh_token) refresh_token = params.get('refresh_token');
      if (!type) type = params.get('type');
      if (!token_hash) token_hash = params.get('token_hash');
      if (!token) token = params.get('token');
      if (!code) code = params.get('code');
      if (!error) error = params.get('error');
      if (!error_description) error_description = params.get('error_description');

      if (error) {
        setErrorMessage(error_description || error);
        setStatus('error');
        return;
      }

      const supabase = createClient();

      try {
        if (access_token && window.location.hash) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || '',
          });

          if (sessionError) {
            setErrorMessage(sessionError.message || 'Failed to confirm email');
            setStatus('error');
            return;
          }

          await handleSuccess(supabase, setStatus, router);
          return;
        }

        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          await handleSuccess(supabase, setStatus, router);
          return;
        }

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            if (exchangeError.message?.includes('code verifier') || exchangeError.message?.includes('non-empty')) {
              setErrorMessage('The confirmation link has expired or was opened in a different browser. Please try signing up again to receive a new confirmation email.');
            } else {
              setErrorMessage(exchangeError.message || 'Failed to confirm email. Please try signing up again.');
            }
            setStatus('error');
            return;
          }

          if (data.session) {
            await ensureYouthRecord(supabase, data.session.user.id);
            setStatus('success');
            setTimeout(() => router.push('/'), 2000);
          } else {
            setErrorMessage('Failed to create session after email confirmation');
            setStatus('error');
          }
        } else if (access_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || '',
          });

          if (sessionError) {
            setErrorMessage(sessionError.message || 'Failed to confirm email');
            setStatus('error');
            return;
          }

          await handleSuccess(supabase, setStatus, router);
        } else if (token_hash && type) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash,
          });

          if (verifyError) {
            setErrorMessage(verifyError.message || 'Failed to verify email');
            setStatus('error');
            return;
          }

          await handleSuccess(supabase, setStatus, router);
        } else if (token && type) {
          const email = params.get('email');
          const verifyParams: any = {
            type: type as any,
            token,
          };
          if (email) {
            verifyParams.email = email;
          }
          const { error: verifyError } = await supabase.auth.verifyOtp(verifyParams);

          if (verifyError) {
            setErrorMessage(verifyError.message || 'Failed to verify email');
            setStatus('error');
            return;
          }

          await handleSuccess(supabase, setStatus, router);
        } else {
          const urlInfo = `URL: ${window.location.href}\nHash: ${window.location.hash || '(none)'}\nSearch: ${window.location.search || '(none)'}`;
          setErrorMessage(`Invalid confirmation link. Missing required parameters.\n\nDebug info:\n${urlInfo}\n\nPlease check your Supabase email template configuration.`);
          setStatus('error');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setErrorMessage(message);
        setStatus('error');
      }
    };

    handleConfirmation();
  }, [router]);

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
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-amber-200 animate-spin" />
                <h1 className="text-5xl mb-4 text-amber-50">Confirming Your Email</h1>
                <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                  Please wait while we verify your account
                </p>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-amber-200" />
                <h1 className="text-5xl mb-4 text-amber-50">Email Confirmed!</h1>
                <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                  Your account has been successfully verified
                </p>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-200" />
                <h1 className="text-5xl mb-4 text-amber-50">Confirmation Failed</h1>
                <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                  We encountered an error verifying your email
                </p>
              </>
            )}
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
                {status === 'loading' && <Loader2 className="w-6 h-6 text-amber-700 animate-spin" />}
                {status === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
                {status === 'error' && <AlertCircle className="w-6 h-6 text-red-600" />}
                {status === 'loading' && 'Confirming Email'}
                {status === 'success' && 'Email Confirmed'}
                {status === 'error' && 'Confirmation Error'}
              </CardTitle>
              <CardDescription className="text-amber-900">
                {status === 'loading' && 'Please wait...'}
                {status === 'success' && 'Your email has been successfully verified'}
                {status === 'error' && 'There was a problem verifying your email'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {status === 'loading' && (
                <div className="space-y-4">
                  <p className="text-amber-900">Verifying your email address...</p>
                </div>
              )}

              {status === 'success' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-900">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p>Your email has been confirmed successfully!</p>
                  </div>
                  <p className="text-sm text-amber-700">Redirecting you to the home page...</p>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      <strong>Error:</strong> {errorMessage}
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900 mb-2">
                      <strong>What you can do:</strong>
                    </p>
                    <ul className="space-y-1 text-sm text-amber-800">
                      <li>• The confirmation link may have expired</li>
                      <li>• Try signing up again to receive a new confirmation email</li>
                      <li>• Contact support if the problem persists</li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t-2 border-amber-200">
                    <Button
                      onClick={() => router.push('/youth-sign-up')}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg py-6"
                    >
                      Sign Up Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
