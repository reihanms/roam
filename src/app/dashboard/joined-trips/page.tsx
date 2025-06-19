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
import { createClient } from "../../../../supabase/server";
import { Calendar, MapPin, UserCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function JoinedTripsPage({
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

  const { data: participations, error } = await supabase
    .from("trip_participants")
    .select(
      `
      *,
      trip:trips(
        *,
        host:users!trips_host_id_fkey(full_name, name)
      )
    `,
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("joined_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching joined trips:", error);
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
            <h1 className="text-3xl font-bold">Joined Trips</h1>
          </header>

          {participations && participations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {participations.map((participation: any) => {
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
          ) : (
            <div className="text-center py-16 border-dashed border-2 rounded-lg">
              <h2 className="text-xl font-semibold">No joined trips yet!</h2>
              <p className="text-muted-foreground mt-2 mb-4">
                You haven't joined any trips. Explore trips to find your next
                adventure!
              </p>
              <Link href="/explore">
                <Button>Explore Trips</Button>
              </Link>
            </div>
          )}

          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/dashboard/joined-trips?page=${currentPage - 1}`}
                    />
                  </PaginationItem>
                )}
                {participations && participations.length === pageSize && (
                  <PaginationItem>
                    <PaginationNext
                      href={`/dashboard/joined-trips?page=${currentPage + 1}`}
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
