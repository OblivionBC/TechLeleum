// auth/sign-up-success/page.tsx (or wherever your success page is located)

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming this path
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function SignUpSuccessPage() {
  const router = useRouter();

  return (
    // 1. Consistent Background
    <div className="min-h-screen flex w-full items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-2 border-amber-200 shadow-xl bg-white/95 backdrop-blur">
            
            <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 border-b-2 border-amber-200">
              <CardTitle className="flex items-center gap-2 text-amber-950 text-2xl">
                <Sparkles className="w-6 h-6 text-amber-700" />
                Thank you for signing up!
              </CardTitle>
              <CardDescription className="text-amber-900">
                Check your email to confirm your account
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <p className="text-md text-amber-900">
                You've successfully created your Tech Leleum account. 
                A confirmation link has been sent to your email address. 
                Please click the link in the email to verify your account before attempting to sign in.
              </p>
              
            
              <Button 
                onClick={() => router.push('/youth-login')}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg py-6 mt-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Youth Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}