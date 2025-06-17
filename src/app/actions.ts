"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: user.id,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        console.error("Error updating user profile:", updateError);
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const updateProfileAction = async (formData: FormData) => {
  const bio = formData.get("bio")?.toString() || "";
  const travelStyles = formData.getAll("travel_styles") as string[];
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return encodedRedirect("error", "/profile", "Authentication required");
  }

  // Update bio
  const { error: bioError } = await supabase
    .from("users")
    .update({ bio })
    .eq("id", user.id);

  if (bioError) {
    console.error("Error updating bio:", bioError);
    return encodedRedirect("error", "/profile", "Failed to update bio");
  }

  // Update travel styles
  // First, remove existing travel styles
  await supabase.from("user_travel_styles").delete().eq("user_id", user.id);

  // Then add new travel styles
  if (travelStyles.length > 0) {
    const travelStyleInserts = travelStyles.map((styleId) => ({
      user_id: user.id,
      travel_style_id: styleId,
    }));

    const { error: stylesError } = await supabase
      .from("user_travel_styles")
      .insert(travelStyleInserts);

    if (stylesError) {
      console.error("Error updating travel styles:", stylesError);
      return encodedRedirect(
        "error",
        "/profile",
        "Failed to update travel styles",
      );
    }
  }

  return encodedRedirect("success", "/profile", "Profile updated successfully");
};

export const createTripAction = async (formData: FormData) => {
  const title = formData.get("title")?.toString();
  const destination = formData.get("destination")?.toString();
  const description = formData.get("description")?.toString();
  const startDate = formData.get("start_date")?.toString();
  const endDate = formData.get("end_date")?.toString();
  const budgetMin = parseInt(formData.get("budget_min")?.toString() || "0");
  const budgetMax = parseInt(formData.get("budget_max")?.toString() || "0");
  const maxParticipants = parseInt(
    formData.get("max_participants")?.toString() || "4",
  );

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return encodedRedirect(
      "error",
      "/dashboard/create-trip",
      "Authentication required",
    );
  }

  if (!title || !destination || !startDate || !endDate) {
    return encodedRedirect(
      "error",
      "/dashboard/create-trip",
      "Title, destination, start date, and end date are required",
    );
  }

  const { data: trip, error } = await supabase
    .from("trips")
    .insert({
      title,
      destination,
      description,
      start_date: startDate,
      end_date: endDate,
      budget_min: budgetMin || null,
      budget_max: budgetMax || null,
      max_participants: maxParticipants,
      host_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating trip:", error);
    return encodedRedirect(
      "error",
      "/dashboard/create-trip",
      "Failed to create trip",
    );
  }

  return redirect(`/dashboard/trips/${trip.id}`);
};

export const manageTripRequestAction = async (formData: FormData) => {
  const participantId = formData.get("participant_id")?.toString();
  const action = formData.get("action")?.toString(); // 'approve' or 'decline'
  const tripId = formData.get("trip_id")?.toString();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return encodedRedirect("error", "/dashboard", "Authentication required");
  }

  if (!participantId || !action || !tripId) {
    return encodedRedirect(
      "error",
      `/dashboard/trips/${tripId}`,
      "Invalid request",
    );
  }

  // Verify user is the host of the trip
  const { data: trip } = await supabase
    .from("trips")
    .select("host_id")
    .eq("id", tripId)
    .single();

  if (!trip || trip.host_id !== user.id) {
    return encodedRedirect(
      "error",
      `/dashboard/trips/${tripId}`,
      "Unauthorized",
    );
  }

  const status = action === "approve" ? "approved" : "declined";

  const { error } = await supabase
    .from("trip_participants")
    .update({ status })
    .eq("id", participantId);

  if (error) {
    console.error("Error updating trip request:", error);
    return encodedRedirect(
      "error",
      `/dashboard/trips/${tripId}`,
      "Failed to update request",
    );
  }

  return encodedRedirect(
    "success",
    `/dashboard/trips/${tripId}`,
    `Request ${action}d successfully`,
  );
};

export const joinTripAction = async (formData: FormData) => {
  const tripId = formData.get("trip_id")?.toString();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return encodedRedirect("error", "/dashboard", "Authentication required");
  }

  if (!tripId) {
    return encodedRedirect("error", "/dashboard", "Invalid trip");
  }

  // Check if user already has a request for this trip
  const { data: existingRequest } = await supabase
    .from("trip_participants")
    .select("id")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .single();

  if (existingRequest) {
    return encodedRedirect(
      "error",
      `/dashboard/trips/${tripId}`,
      "You have already requested to join this trip",
    );
  }

  const { error } = await supabase.from("trip_participants").insert({
    trip_id: tripId,
    user_id: user.id,
    status: "pending",
  });

  if (error) {
    console.error("Error joining trip:", error);
    return encodedRedirect(
      "error",
      `/dashboard/trips/${tripId}`,
      "Failed to join trip",
    );
  }

  return encodedRedirect(
    "success",
    `/dashboard/trips/${tripId}`,
    "Join request sent successfully",
  );
};
