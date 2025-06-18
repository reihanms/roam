import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { createClient } from "../../../supabase/server";
import { Tables } from "@/types/supabase";
import Link from "next/link";
import { ExploreMapSection } from "@/components/explore-map-section";

type Trip = Tables<"trips"> & {
  host: Tables<"users"> | null;
  participants: Tables<"trip_participants">[];
  latitude: number;
  longitude: number;
};

export default async function ExplorePage() {
  const supabase = await createClient();

  // Get current user for authentication status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch upcoming trips for both map and destinations list
  const { data: trips, error } = await supabase
    .from("trips")
    .select(
      `
      *,
      host:users!trips_host_id_fkey(full_name, name),
      participants:trip_participants(id, status)
    `
    )
    .gte("start_date", new Date().toISOString().split("T")[0])
    .order("created_at", { ascending: false })
    .limit(50);

  const typedTrips = (trips || []) as Trip[];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAvailableSpots = (trip: Trip) => {
    const approvedParticipants = trip.participants.filter(
      (p) => p.status === "approved"
    ).length;
    return (trip.max_participants || 4) - approvedParticipants - 1; // -1 for host
  };

  // Group trips by destination for the destinations grid
  const tripsByDestination = typedTrips.reduce(
    (acc, trip) => {
      const destination = trip.destination;
      if (!acc[destination]) {
        acc[destination] = [];
      }
      acc[destination].push(trip);
      return acc;
    },
    {} as Record<string, Trip[]>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Explore Destinations</h1>
            <p className="text-muted-foreground">
              Discover amazing destinations and the trips happening there.
            </p>
          </div>

          {/* Interactive Map */}
          <ExploreMapSection trips={typedTrips} />

          {/* Destinations Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>

            {Object.keys(tripsByDestination).length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No destinations available
                </h3>
                <p className="text-muted-foreground mb-6">
                  No upcoming trips are currently available.
                </p>
                {user ? (
                  <Link href="/dashboard/create-trip">
                    <Button>Create the First Trip</Button>
                  </Link>
                ) : (
                  <Link href="/sign-up">
                    <Button>Join Roam</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(tripsByDestination).map(
                  ([destination, destinationTrips]) => {
                    const totalSpots = destinationTrips.reduce(
                      (sum, trip) => sum + getAvailableSpots(trip),
                      0
                    );
                    const upcomingTrips = destinationTrips.filter(
                      (trip) => new Date(trip.start_date) > new Date()
                    ).length;

                    return (
                      <Card
                        key={destination}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                {destination}
                              </CardTitle>
                              <CardDescription>
                                {destinationTrips.length} trip
                                {destinationTrips.length !== 1 ? "s" : ""}{" "}
                                available
                              </CardDescription>
                            </div>
                            {totalSpots > 0 && (
                              <Badge variant="secondary">
                                {totalSpots} spot{totalSpots !== 1 ? "s" : ""}{" "}
                                available
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Show first 2 trips */}
                          <div className="space-y-3">
                            {destinationTrips.slice(0, 2).map((trip) => {
                              const availableSpots = getAvailableSpots(trip);
                              return (
                                <div
                                  key={trip.id}
                                  className="p-3 bg-muted/50 rounded-lg"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-sm">
                                      {trip.title}
                                    </h4>
                                    {availableSpots > 0 ? (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {availableSpots} left
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Full
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="w-3 h-3" />
                                      <span>{formatDate(trip.start_date)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      <span>
                                        {trip.participants.filter(
                                          (p) => p.status === "approved"
                                        ).length + 1}
                                        /{trip.max_participants || 4}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {destinationTrips.length > 2 && (
                            <p className="text-sm text-muted-foreground">
                              +{destinationTrips.length - 2} more trip
                              {destinationTrips.length - 2 !== 1 ? "s" : ""}
                            </p>
                          )}

                          <div className="pt-2">
                            <Link
                              href={`/trips?destination=${encodeURIComponent(destination)}`}
                            >
                              <Button className="w-full" variant="outline">
                                View All Trips to {destination}
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-emerald-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Ready to Explore?</h3>
            <p className="text-muted-foreground mb-6">
              Browse all available trips or create your own adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trips">
                <Button size="lg">Browse All Trips</Button>
              </Link>
              {user ? (
                <Link href="/dashboard/create-trip">
                  <Button size="lg" variant="outline">
                    Create a Trip
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up">
                  <Button size="lg" variant="outline">
                    Join Roam
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

