'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams?.get('error');

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
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-200" />
            <h1 className="text-5xl mb-4 text-amber-50">Something Went Wrong</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              We encountered an error processing your request
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
                <AlertCircle className="w-6 h-6 text-amber-700" />
                Error
              </CardTitle>
              <CardDescription className="text-amber-900">
                An error occurred while processing your request
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  {error ? (
                    <p className="text-sm text-red-800">
                      <strong>Error:</strong> {error}
                    </p>
                  ) : (
                    <p className="text-sm text-red-800">
                      An unspecified error occurred. Please try again.
                    </p>
                  )}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-900 mb-2">
                    <strong>What you can do:</strong>
                  </p>
                  <ul className="space-y-1 text-sm text-amber-800">
                    <li>• Try the operation again</li>
                    <li>• Check if you&apos;re using the correct link</li>
                    <li>• Contact support if the problem persists</li>
                  </ul>
                </div>
                <div className="pt-4 border-t-2 border-amber-200">
                  <Button
                    onClick={() => router.push('/')}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg py-6"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Go to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex w-full min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
