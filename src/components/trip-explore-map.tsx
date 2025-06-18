"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tables } from "@/types/supabase";
import dynamic from "next/dynamic";

// Dynamically import the entire map component to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-lg border overflow-hidden flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface ExtendedTrip extends Tables<"trips"> {
  host: Tables<"users"> | null;
  participants: Tables<"trip_participants">[];
  latitude: number;
  longitude: number;
}

interface TripExploreMapProps {
  trips: ExtendedTrip[];
  className?: string;
}

export function TripExploreMap({ trips, className = "" }: TripExploreMapProps) {
  return (
    <div className={className}>
      <MapComponent trips={trips} />
    </div>
  );
}
