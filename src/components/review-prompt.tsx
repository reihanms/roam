"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare } from "lucide-react";
import { createClient } from "../../supabase/client";
import { Tables } from "@/types/supabase";

interface ReviewPromptProps {
  tripId: string;
  currentUserId: string;
  participants: (Tables<"trip_participants"> & {
    user: Tables<"users"> | null;
  })[];
  host: Tables<"users"> | null;
  hostId: string;
  tripEndDate: string;
}

interface ReviewableUser {
  id: string;
  name: string;
  role: "host" | "participant";
}

interface PendingReview {
  userId: string;
  rating: number;
  comment: string;
}

export default function ReviewPrompt({
  tripId,
  currentUserId,
  participants,
  host,
  hostId,
  tripEndDate,
}: ReviewPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [reviewableUsers, setReviewableUsers] = useState<ReviewableUser[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReviews, setExistingReviews] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    checkIfShouldShowPrompt();
  }, [tripId, currentUserId, tripEndDate]);

  const checkIfShouldShowPrompt = async () => {
    // Check if trip has ended
    const tripEndDateObj = new Date(tripEndDate);
    const now = new Date();

    if (tripEndDateObj > now) {
      return; // Trip hasn't ended yet
    }

    // Get users that can be reviewed
    const usersToReview: ReviewableUser[] = [];

    // Add host if current user is not the host
    if (currentUserId !== hostId && host) {
      usersToReview.push({
        id: hostId,
        name: host.full_name || host.name || "Host",
        role: "host",
      });
    }

    // Add other participants
    participants
      .filter((p) => p.user_id !== currentUserId && p.status === "approved")
      .forEach((p) => {
        if (p.user) {
          usersToReview.push({
            id: p.user_id!,
            name: p.user.full_name || p.user.name || "Traveler",
            role: "participant",
          });
        }
      });

    // Check which reviews have already been submitted
    const { data: existingReviewsData } = await supabase
      .from("reviews")
      .select("reviewee_id")
      .eq("trip_id", tripId)
      .eq("reviewer_id", currentUserId);

    const reviewedUserIds =
      existingReviewsData?.map((r) => r.reviewee_id) || [];
    setExistingReviews(reviewedUserIds);

    // Filter out users already reviewed
    const pendingUsers = usersToReview.filter(
      (u) => !reviewedUserIds.includes(u.id),
    );

    if (pendingUsers.length > 0) {
      setReviewableUsers(pendingUsers);
      setPendingReviews(
        pendingUsers.map((u) => ({ userId: u.id, rating: 0, comment: "" })),
      );
      setShowPrompt(true);
    }
  };

  const updateReview = (
    userId: string,
    field: "rating" | "comment",
    value: number | string,
  ) => {
    setPendingReviews((prev) =>
      prev.map((review) =>
        review.userId === userId ? { ...review, [field]: value } : review,
      ),
    );
  };

  const submitReviews = async () => {
    setIsSubmitting(true);

    try {
      const reviewsToSubmit = pendingReviews
        .filter((review) => review.rating > 0)
        .map((review) => ({
          trip_id: tripId,
          reviewer_id: currentUserId,
          reviewee_id: review.userId,
          rating: review.rating,
          comment: review.comment || null,
        }));

      if (reviewsToSubmit.length > 0) {
        const { error } = await supabase
          .from("reviews")
          .insert(reviewsToSubmit);

        if (error) {
          console.error("Error submitting reviews:", error);
          alert("Failed to submit reviews. Please try again.");
        } else {
          setShowPrompt(false);
          alert("Reviews submitted successfully!");
        }
      }
    } catch (error) {
      console.error("Error submitting reviews:", error);
      alert("Failed to submit reviews. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (userId: string, currentRating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => updateReview(userId, "rating", star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= currentRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Share Your Travel Experience
          </DialogTitle>
          <DialogDescription>
            Help build our travel community by reviewing your fellow travelers.
            Your reviews will be visible once both parties have reviewed each
            other, or after 14 days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {reviewableUsers.map((user) => {
            const review = pendingReviews.find((r) => r.userId === user.id);
            if (!review) return null;

            return (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>
                    {user.role === "host" ? "Trip Host" : "Fellow Traveler"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rating *
                    </label>
                    {renderStarRating(user.id, review.rating)}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Comment (Optional)
                    </label>
                    <Textarea
                      placeholder="Share your experience traveling with this person..."
                      value={review.comment}
                      onChange={(e) =>
                        updateReview(user.id, "comment", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={submitReviews}
              disabled={
                isSubmitting || pendingReviews.every((r) => r.rating === 0)
              }
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Reviews"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPrompt(false)}
              className="flex-1"
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            You can always submit reviews later from your trip history.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
