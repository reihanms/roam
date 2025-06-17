import Link from "next/link";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center p-8 space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <Frown className="w-full h-full text-primary animate-pulse" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-primary drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Oops! Page Not Found.
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button size="lg">Go Back Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
