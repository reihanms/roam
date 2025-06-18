import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfileAction } from "../actions";
import DashboardNavbar from "@/components/dashboard-navbar";

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

                <Button type="submit" className="w-full">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>

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
        </div>
      </main>
    </div>
  );
}

