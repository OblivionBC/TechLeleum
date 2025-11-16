import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface MentorCardProps {
  id: string;
  name?: string;
  expertise: string;
  band: string;
  photo_url: string | null;
}

export function MentorCard({
  id,
  name,
  expertise,
  band,
  photo_url,
}: MentorCardProps) {
  return (
    <Link href={`/mentors/${id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
            {photo_url ? (
              <Image
                src={photo_url}
                alt={name || expertise}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-4xl">👤</span>
              </div>
            )}
          </div>
          <CardTitle className="text-xl">
            {name || expertise || "Mentor"}
          </CardTitle>
          {expertise && <CardDescription>{expertise}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">Band: </span>
              <span className="text-sm text-muted-foreground">{band}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <span className="text-sm text-primary hover:underline">
            View Profile →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
