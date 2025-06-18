import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";
import { createClient } from "../../../supabase/server";
import { Tables } from "@/types/supabase";
import Link from "next/link";

type Trip = Tables<"trips"> & {
  host: Tables<"users"> | null;
  participants: Tables<"trip_participants">[];
};

interface SearchParams {
  destination?: string;
  sort_by?: string;
}

export default async function TripsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();

  // Get current user for authentication status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch trips with search and filter
  let query = supabase
    .from("trips")
    .select(
      `
      *,
      host:users!trips_host_id_fkey(full_name, name),
      participants:trip_participants(id, status)
    `
    )
    .gte("start_date", new Date().toISOString().split("T")[0]);

  if (searchParams.destination?.trim()) {
    query = query.ilike("destination", `%${searchParams.destination}%`);
  }

  if (searchParams.sort_by === "start_date") {
    query = query.order("start_date", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (searchParams.destination) {
    query = query.textSearch("title", searchParams.destination);
  }

  const { data: trips } = await query.limit(20);

  const typedTrips = (trips as Trip[]) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Budget flexible";
    if (min && max) return `$${min} - $${max}`;
    if (min) return `From $${min}`;
    if (max) return `Up to $${max}`;
    return "Budget flexible";
  };

  const getAvailableSpots = (trip: Trip) => {
    const approvedParticipants = trip.participants.filter(
      (p) => p.status === "approved"
    ).length;
    return (trip.max_participants || 4) - approvedParticipants - 1; // -1 for host
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Discover Trips</h1>
            <p className="text-muted-foreground">
              Find your perfect travel companions and join amazing adventures.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg border p-6 mb-8">
            <form method="GET" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      name="destination"
                      placeholder="Search by destination..."
                      defaultValue={searchParams.destination || ""}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select
                    name="sort_by"
                    defaultValue={searchParams.sort_by || "created_at"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Newest First</SelectItem>
                      <SelectItem value="start_date">Start Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {typedTrips.length} trip{typedTrips.length !== 1 ? "s" : ""} found
              {searchParams.destination && (
                <span> for &quot;{searchParams.destination}&quot;</span>
              )}
            </p>
          </div>

          {/* Trips Grid */}
          {typedTrips.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No trips found</h3>
              <p className="text-muted-foreground mb-6">
                {searchParams.destination
                  ? `No trips found for "${searchParams.destination}". Try a different search term.`
                  : "No upcoming trips available at the moment."}
              </p>
              {user ? (
                <Link href="/dashboard/create-trip">
                  <Button>Create a Trip</Button>
                </Link>
              ) : (
                <Link href="/sign-up">
                  <Button>Join Roam</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typedTrips.map((trip) => {
                const availableSpots = getAvailableSpots(trip);
                return (
                  <Card
                    key={trip.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {trip.title}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{trip.destination}</span>
                          </div>
                        </div>
                        {availableSpots > 0 ? (
                          <Badge variant="secondary">
                            {availableSpots} spot
                            {availableSpots !== 1 ? "s" : ""} left
                          </Badge>
                        ) : (
                          <Badge variant="outline">Full</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {trip.description && (
                        <CardDescription className="line-clamp-2">
                          {trip.description}
                        </CardDescription>
                      )}

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {formatDate(trip.start_date)} -{" "}
                            {formatDate(trip.end_date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {formatBudget(trip.budget_min, trip.budget_max)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {trip.participants.filter(
                              (p) => p.status === "approved"
                            ).length + 1}{" "}
                            / {trip.max_participants || 4} travelers
                          </span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Link href={`/dashboard/trips/${trip.id}`}>
                          <Button
                            className="w-full"
                            variant={availableSpots > 0 ? "default" : "outline"}
                          >
                            {availableSpots > 0
                              ? "View & Join"
                              : "View Details"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Load More */}
          {typedTrips.length >= 20 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Trips
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

