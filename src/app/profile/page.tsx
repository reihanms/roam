import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Users } from "lucide-react";
import { updateProfileAction } from "../actions";
import DashboardNavbar from "@/components/dashboard-navbar";

interface TravelStyle {
  id: string;
  name: string;
}

interface UserTravelStyle {
  travel_style_id: string;
  travel_styles: TravelStyle;
}

interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  max_participants: number;
  host_id: string;
  trip_participants: { user_id: string; status: string }[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_id: string;
  users: { name: string; full_name: string };
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return redirect("/sign-in");
  }

  // Fetch user profile data
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch all available travel styles
  const { data: allTravelStyles } = await supabase
    .from("travel_styles")
    .select("*")
    .order("name");

  // Fetch user's selected travel styles
  const { data: userTravelStyles } = await supabase
    .from("user_travel_styles")
    .select(
      `
      travel_style_id,
      travel_styles (id, name)
    `,
    )
    .eq("user_id", user.id);

  // Fetch user's trips (hosted and participated)
  const { data: hostedTrips } = await supabase
    .from("trips")
    .select(
      `
      *,
      trip_participants (user_id, status)
    `,
    )
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });

  const { data: participatedTrips } = await supabase
    .from("trip_participants")
    .select(
      `
      trips (*)
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "approved");

  // Fetch visible reviews received by the user
  const { data: reviews } = await supabase
    .from("visible_reviews")
    .select(
      `
      *,
      users!reviews_reviewer_id_fkey (name, full_name)
    `,
    )
    .eq("reviewee_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate average rating
  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const selectedTravelStyleIds =
    userTravelStyles?.map((uts) => uts.travel_style_id) || [];
  const allTrips = [
    ...(hostedTrips || []).map((trip) => ({ ...trip, role: "host" })),
    ...(participatedTrips || []).map((pt) => ({
      ...pt.trips,
      role: "participant",
    })),
  ];

  return (
    <div className="bg-background min-h-screen">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={userProfile?.avatar_url || ""}
                    alt={userProfile?.name || "User"}
                  />
                  <AvatarFallback className="text-2xl">
                    {(
                      userProfile?.name ||
                      userProfile?.full_name ||
                      user.email ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">
                    {userProfile?.name ||
                      userProfile?.full_name ||
                      "Anonymous User"}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  {reviews && reviews.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {averageRating.toFixed(1)} ({reviews.length} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Edit Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateProfileAction} className="space-y-6">
                {/* Bio Section */}
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    About Me
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell other travelers about yourself..."
                    defaultValue={userProfile?.bio || ""}
                    rows={4}
                  />
                </div>

                {/* Travel Styles Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel Styles</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allTravelStyles?.map((style) => (
                      <label
                        key={style.id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="travel_styles"
                          value={style.id}
                          defaultChecked={selectedTravelStyleIds.includes(
                            style.id,
                          )}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{style.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Travel Styles Display */}
          {userTravelStyles && userTravelStyles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Travel Styles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userTravelStyles.map((uts) => (
                    <Badge key={uts.travel_style_id} variant="secondary">
                      {uts.travel_styles.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bio Display */}
          {userProfile?.bio && (
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{userProfile.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Trip History */}
          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
            </CardHeader>
            <CardContent>
              {allTrips.length > 0 ? (
                <div className="space-y-4">
                  {allTrips.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{trip.title}</h3>
                        <Badge
                          variant={
                            trip.role === "host" ? "default" : "secondary"
                          }
                        >
                          {trip.role === "host" ? "Hosted" : "Participated"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {trip.destination}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(
                            trip.start_date,
                          ).toLocaleDateString()} -{" "}
                          {new Date(trip.end_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {trip.trip_participants?.filter(
                            (p) => p.status === "approved",
                          ).length || 0}
                          /{trip.max_participants}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No trips yet. Start exploring!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews from Other Travelers</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.users?.name ||
                              review.users?.full_name ||
                              "Anonymous"}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
