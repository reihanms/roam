import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How Roam Works
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Planning your next adventure is as easy as 1-2-3.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Step 1: Sign Up</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Create your free Roam account to unlock a world of travel
                planning tools. All you need is an email to get started.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Step 2: Create a Trip</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Head to your dashboard and create a new trip. Give it a name,
                set your dates, and you're ready to start planning your
                itinerary.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Step 3: Explore & Add to Itinerary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Use our interactive map to discover amazing places. Found
                something you like? Add it to your trip with a single click.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Step 4: Collaborate with Friends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Invite your friends to your trip and plan together in real-time.
                Our built-in chat makes collaboration seamless.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Step 5: Enjoy Your Adventure</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                With your itinerary set, all that's left is to pack your bags
                and enjoy your well-planned trip. Roam is with you on the go.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Step 6: Leave Reviews</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                After your trip, share your experiences by leaving reviews for
                the places you visited. Help other travelers in the Roam
                community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;

