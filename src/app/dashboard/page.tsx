import DashboardNavbar from "@/components/dashboard-navbar";
import {
  InfoIcon,
  UserCircle,
  Plus,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's trips
  const { data: userTrips } = await supabase
    .from("trips")
    .select(
      `
      *,
      participants:trip_participants(
        id,
        status,
        user_id
      )
    `,
    )
    .eq("host_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch trips user has joined
  const { data: joinedTrips } = await supabase
    .from("trip_participants")
    .select(
      `
      *,
      trip:trips(
        *,
        host:users!trips_host_id_fkey(full_name, name)
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("joined_at", { ascending: false })
    .limit(5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Link href="/dashboard/create-trip">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Trip
                </Button>
              </Link>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to your travel dashboard. Create trips and manage your
                travel companions.
              </span>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Trips</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userTrips?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trips you've created
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Joined Trips
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {joinedTrips?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trips you've joined
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userTrips?.reduce((acc, trip) => {
                    const pendingCount =
                      trip.participants?.filter((p) => p.status === "pending")
                        .length || 0;
                    return acc + pendingCount;
                  }, 0) || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting your approval
                </p>
              </CardContent>
            </Card>
          </div>

          {/* My Trips Section */}
          {userTrips && userTrips.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My Trips</h2>
                <Link
                  href="/dashboard/trips"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userTrips.map((trip) => {
                  const pendingCount =
                    trip.participants?.filter((p) => p.status === "pending")
                      .length || 0;
                  const approvedCount =
                    trip.participants?.filter((p) => p.status === "approved")
                      .length || 0;

                  return (
                    <Card
                      key={trip.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base line-clamp-1">
                            {trip.title}
                          </CardTitle>
                          {pendingCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {pendingCount} pending
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {trip.destination}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(trip.start_date)} -{" "}
                              {formatDate(trip.end_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>
                              {approvedCount + 1} / {trip.max_participants || 4}{" "}
                              people
                            </span>
                          </div>
                        </div>
                        <Link href={`/dashboard/trips/${trip.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                          >
                            Manage Trip
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Joined Trips Section */}
          {joinedTrips && joinedTrips.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Trips I've Joined</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedTrips.map((participation) => {
                  const trip = participation.trip;
                  if (!trip) return null;

                  return (
                    <Card
                      key={participation.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base line-clamp-1">
                          {trip.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {trip.destination}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(trip.start_date)} -{" "}
                              {formatDate(trip.end_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-3 w-3" />
                            <span>
                              Host:{" "}
                              {trip.host?.full_name ||
                                trip.host?.name ||
                                "Unknown"}
                            </span>
                          </div>
                        </div>
                        <Link href={`/dashboard/trips/${trip.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                          >
                            View Trip
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Empty State */}
          {(!userTrips || userTrips.length === 0) &&
            (!joinedTrips || joinedTrips.length === 0) && (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your travel journey by creating your first trip or
                    exploring trips created by others.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/dashboard/create-trip">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Trip
                      </Button>
                    </Link>
                    <Link href="/dashboard/explore">
                      <Button variant="outline">Explore Trips</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </main>
    </>
  );
}
