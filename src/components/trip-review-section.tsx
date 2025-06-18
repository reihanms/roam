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
import { Star, MessageSquare, Plus } from "lucide-react";
import { createClient } from "../../supabase/client";
import { Tables } from "@/types/supabase";

interface TripReviewSectionProps {
  tripId: string;
  currentUserId: string;
  participants: (Tables<"trip_participants"> & {
    user: Tables<"users"> | null;
  })[];
  host: Tables<"users"> | null;
  hostId: string;
  isHost: boolean;
  isApprovedParticipant: boolean;
}

interface ReviewableUser {
  id: string;
  name: string;
  role: "host" | "participant";
  hasReview: boolean;
}

interface NewReview {
  userId: string;
  rating: number;
  comment: string;
}

export default function TripReviewSection({
  tripId,
  currentUserId,
  participants,
  host,
  hostId,
  isHost,
  isApprovedParticipant,
}: TripReviewSectionProps) {
  const [reviewableUsers, setReviewableUsers] = useState<ReviewableUser[]>([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ReviewableUser | null>(null);
  const [newReview, setNewReview] = useState<NewReview>({
    userId: "",
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadReviewableUsers();
  }, [tripId, currentUserId]);

  const loadReviewableUsers = async () => {
    // Only show if user is host or approved participant
    if (!isHost && !isApprovedParticipant) {
      return;
    }

    const usersToReview: ReviewableUser[] = [];

    // Add host if current user is not the host
    if (currentUserId !== hostId && host) {
      usersToReview.push({
        id: hostId,
        name: host.full_name || host.name || "Host",
        role: "host",
        hasReview: false,
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
            hasReview: false,
          });
        }
      });

    // Check which reviews have already been submitted
    const { data: existingReviews } = await supabase
      .from("reviews")
      .select("reviewee_id")
      .eq("trip_id", tripId)
      .eq("reviewer_id", currentUserId);

    const reviewedUserIds = existingReviews?.map((r) => r.reviewee_id) || [];

    // Update hasReview status
    const updatedUsers = usersToReview.map((user) => ({
      ...user,
      hasReview: reviewedUserIds.includes(user.id),
    }));

    setReviewableUsers(updatedUsers);
  };

  const openReviewDialog = (user: ReviewableUser) => {
    setSelectedUser(user);
    setNewReview({ userId: user.id, rating: 0, comment: "" });
    setShowReviewDialog(true);
  };

  const updateReview = (
    field: "rating" | "comment",
    value: number | string,
  ) => {
    setNewReview((prev) => ({ ...prev, [field]: value }));
  };

  const submitReview = async () => {
    if (!selectedUser || newReview.rating === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        trip_id: tripId,
        reviewer_id: currentUserId,
        reviewee_id: newReview.userId,
        rating: newReview.rating,
        comment: newReview.comment || null,
      });

      if (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review. Please try again.");
      } else {
        setShowReviewDialog(false);
        loadReviewableUsers(); // Refresh the list
        alert("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (
    currentRating: number,
    interactive: boolean = true,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={
              interactive ? () => updateReview("rating", star) : undefined
            }
            className={interactive ? "focus:outline-none" : "cursor-default"}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 transition-colors ${
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

  if (reviewableUsers.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Trip Reviews
          </CardTitle>
          <CardDescription>
            Share your experience with fellow travelers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reviewableUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.role === "host" ? "Trip Host" : "Fellow Traveler"}
                  </p>
                </div>
                <Button
                  variant={user.hasReview ? "outline" : "default"}
                  size="sm"
                  onClick={() => openReviewDialog(user)}
                  disabled={user.hasReview}
                >
                  {user.hasReview ? "Reviewed" : "Add Review"}
                  {!user.hasReview && <Plus className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Share your experience traveling with this person. Reviews become
              visible once both parties have reviewed each other, or after 14
              days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating *</label>
              {renderStarRating(newReview.rating)}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Comment (Optional)
              </label>
              <Textarea
                placeholder="Share your experience traveling with this person..."
                value={newReview.comment}
                onChange={(e) => updateReview("comment", e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={submitReview}
                disabled={isSubmitting || newReview.rating === 0}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
