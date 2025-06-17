"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Navigation, MapPin } from "lucide-react";
import { TripExploreMap } from "@/components/trip-explore-map";
import { Tables } from "@/types/supabase";

interface ExtendedTrip extends Tables<"trips"> {
  host: Tables<"users"> | null;
  participants: Tables<"trip_participants">[];
  latitude: number;
  longitude: number;
}

interface ExploreMapSectionProps {
  trips: ExtendedTrip[];
}

export function ExploreMapSection({ trips }: ExploreMapSectionProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a brief loading state for smoother transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Interactive Map
        </CardTitle>
        <CardDescription>Explore trip destinations on the map</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-96 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Navigation className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-spin" />
              <p className="text-emerald-600">Loading trips...</p>
            </div>
          </div>
        ) : trips.some((trip) => trip.latitude && trip.longitude) ? (
          <TripExploreMap trips={trips} className="h-96" />
        ) : (
          <div className="h-96 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <p className="text-emerald-600">
                No trip locations available on the map yet
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

