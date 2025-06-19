import DashboardNavbar from "@/components/dashboard-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar, MapPin, Plus, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function TripsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 9;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: trips, error: tripsError } = await supabase
    .from("trips")
    .select(
      `
      *,
      participants:trip_participants(
        id,
        status,
        user_id
      )
    `
    )
    .eq("host_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (tripsError) {
    console.error("Error fetching trips:", tripsError);
  }

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
        <div className="container mx-auto px-4 py-8">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Trips</h1>
            <Link href="/dashboard/create-trip">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Trip
              </Button>
            </Link>
          </header>

          {trips && trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip: any) => {
                const pendingCount =
                  trip.participants?.filter((p: any) => p.status === "pending")
                    .length || 0;
                const approvedCount =
                  trip.participants?.filter((p: any) => p.status === "approved")
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
          ) : (
            <div className="text-center py-16 border-dashed border-2 rounded-lg">
              <h2 className="text-xl font-semibold">No trips yet!</h2>
              <p className="text-muted-foreground mt-2 mb-4">
                It looks like you haven't created any trips. Get started now!
              </p>
              <Link href="/dashboard/create-trip">
                <Button>Create Your First Trip</Button>
              </Link>
            </div>
          )}

          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/dashboard/trips?page=${currentPage - 1}`}
                    />
                  </PaginationItem>
                )}
                {trips && trips.length === pageSize && (
                  <PaginationItem>
                    <PaginationNext
                      href={`/dashboard/trips?page=${currentPage + 1}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
    </>
  );
}

