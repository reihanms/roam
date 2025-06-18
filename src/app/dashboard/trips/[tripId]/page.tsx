import { manageTripRequestAction, joinTripAction } from "@/app/actions";
import DashboardNavbar from "@/components/dashboard-navbar";
import Chat from "@/components/chat";
import ReviewPrompt from "@/components/review-prompt";
import TripReviewSection from "@/components/trip-review-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  User,
  Clock,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
import { Tables } from "@/types/supabase";
import { TripExploreMap } from "@/components/trip-explore-map";

type Trip = Tables<"trips"> & {
  host: Tables<"users"> | null;
  participants: (Tables<"trip_participants"> & {
    user: Tables<"users"> | null;
  })[];
  latitude: number | null;
  longitude: number | null;
};

export default async function TripDetailsPage({
  params,
}: {
  params: { tripId: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch trip details with host and participants
  const { data: trip, error } = await supabase
    .from("trips")
    .select(
      `
      *,
      host:users!trips_host_id_fkey(*),
      participants:trip_participants(
        *,
        user:users(*)
      )
    `
    )
    .eq("id", params.tripId)
    .single();

  if (error || !trip) {
    return redirect("/dashboard");
  }

  const typedTrip = trip as Trip;
  const isHost = user.id === typedTrip.host_id;
  const userParticipation = typedTrip.participants.find(
    (p) => p.user_id === user.id
  );
  const pendingRequests = typedTrip.participants.filter(
    (p) => p.status === "pending"
  );
  const approvedParticipants = typedTrip.participants.filter(
    (p) => p.status === "approved"
  );
  const isApprovedParticipant = userParticipation?.status === "approved";
  const hasAccessToChat = isHost || isApprovedParticipant;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) return `$${min} - $${max}`;
    if (min) return `From $${min}`;
    if (max) return `Up to $${max}`;
    return "Budget not specified";
  };

  return (
    <div className="bg-background min-h-screen">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Trip Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{typedTrip.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{typedTrip.destination}</span>
                </div>
              </div>
              {!isHost && !userParticipation && (
                <form action={joinTripAction}>
                  <input type="hidden" name="trip_id" value={params.tripId} />
                  <Button type="submit">Request to Join</Button>
                </form>
              )}
              {userParticipation && (
                <Badge
                  variant={
                    userParticipation.status === "approved"
                      ? "default"
                      : userParticipation.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {userParticipation.status === "approved"
                    ? "Approved"
                    : userParticipation.status === "pending"
                      ? "Pending"
                      : "Declined"}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Trip Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(typedTrip.start_date)} -{" "}
                          {formatDate(typedTrip.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Budget</p>
                        <p className="text-sm text-muted-foreground">
                          {formatBudget(
                            typedTrip.budget_min,
                            typedTrip.budget_max
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Group Size</p>
                        <p className="text-sm text-muted-foreground">
                          {approvedParticipants.length + 1} /{" "}
                          {typedTrip.max_participants || 4} people
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Host</p>
                        <p className="text-sm text-muted-foreground">
                          {typedTrip.host?.full_name ||
                            typedTrip.host?.name ||
                            "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {typedTrip.description && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {typedTrip.description}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  {typedTrip.latitude && typedTrip.longitude ? (
                    <div className="h-64 w-full rounded-lg overflow-hidden">
                      <TripExploreMap
                        trips={[typedTrip as any]}
                        className="h-full w-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Map data not available
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Chat Component */}
              <Chat
                tripId={params.tripId}
                currentUserId={user.id}
                isParticipant={hasAccessToChat}
              />
              {/* Approved Participants */}
              {approvedParticipants.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Host */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {(typedTrip.host?.full_name ||
                            typedTrip.host?.name ||
                            "H")[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {typedTrip.host?.full_name ||
                              typedTrip.host?.name ||
                              "Host"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Trip Host
                          </p>
                        </div>
                      </div>

                      {approvedParticipants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-medium">
                            {(participant.user?.full_name ||
                              participant.user?.name ||
                              "U")[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {participant.user?.full_name ||
                                participant.user?.name ||
                                "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Joined{" "}
                              {new Date(
                                participant.joined_at || ""
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pending Requests (Host Only) */}
              {isHost && pendingRequests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingRequests.map((request) => (
                        <div key={request.id} className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-medium">
                              {(request.user?.full_name ||
                                request.user?.name ||
                                "U")[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {request.user?.full_name ||
                                  request.user?.name ||
                                  "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Requested{" "}
                                {new Date(
                                  request.joined_at || ""
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <form
                              action={manageTripRequestAction}
                              className="flex-1"
                            >
                              <input
                                type="hidden"
                                name="participant_id"
                                value={request.id}
                              />
                              <input
                                type="hidden"
                                name="action"
                                value="approve"
                              />
                              <input
                                type="hidden"
                                name="trip_id"
                                value={params.tripId}
                              />
                              <Button
                                type="submit"
                                size="sm"
                                className="w-full"
                              >
                                Approve
                              </Button>
                            </form>
                            <form
                              action={manageTripRequestAction}
                              className="flex-1"
                            >
                              <input
                                type="hidden"
                                name="participant_id"
                                value={request.id}
                              />
                              <input
                                type="hidden"
                                name="action"
                                value="decline"
                              />
                              <input
                                type="hidden"
                                name="trip_id"
                                value={params.tripId}
                              />
                              <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                                className="w-full"
                              >
                                Decline
                              </Button>
                            </form>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trip Review Section */}
              <TripReviewSection
                tripId={params.tripId}
                currentUserId={user.id}
                participants={typedTrip.participants}
                host={typedTrip.host}
                hostId={typedTrip.host_id!}
                isHost={isHost}
                isApprovedParticipant={isApprovedParticipant}
              />
            </div>
          </div>
        </div>

        {/* Review Prompt */}
        <ReviewPrompt
          tripId={params.tripId}
          currentUserId={user.id}
          participants={typedTrip.participants}
          host={typedTrip.host}
          hostId={typedTrip.host_id!}
          tripEndDate={typedTrip.end_date}
        />
      </main>
    </div>
  );
}

