"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tables } from "@/types/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface ExtendedTrip extends Tables<"trips"> {
  host: Tables<"users"> | null;
  participants: Tables<"trip_participants">[];
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  trips: ExtendedTrip[];
}

export default function MapComponent({ trips }: MapComponentProps) {
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    // Import Leaflet and create icon only on client side
    import("leaflet").then((L) => {
      // Fix for default marker icon in Leaflet
      const leafletIcon = L.icon({
        iconUrl: "/marker-icon.png",
        iconRetinaUrl: "/marker-icon-2x.png",
        shadowUrl: "/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setIcon(leafletIcon);
    });
  }, []);

  // Calculate center based on trips or default to a world view
  const getMapCenter = () => {
    if (trips.length === 0) return [0, 0];

    const validTrips = trips.filter((trip) => trip.latitude && trip.longitude);
    if (validTrips.length === 0) return [0, 0];

    const sumLat = validTrips.reduce((sum, trip) => sum + trip.latitude, 0);
    const sumLng = validTrips.reduce((sum, trip) => sum + trip.longitude, 0);
    return [sumLat / validTrips.length, sumLng / validTrips.length];
  };

  // Calculate appropriate zoom level
  const getZoomLevel = () => {
    if (trips.length === 0) return 2;
    if (trips.length === 1) return 10;
    return 4;
  };

  if (!icon) {
    return (
      <div className="h-[500px] w-full rounded-lg border overflow-hidden flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full rounded-lg border overflow-hidden">
      <MapContainer
        center={getMapCenter() as [number, number]}
        zoom={getZoomLevel()}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trips.map((trip) =>
          trip.latitude && trip.longitude ? (
            <Marker
              key={trip.id}
              position={[trip.latitude, trip.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{trip.title}</h3>
                  <p className="text-sm text-gray-600">{trip.destination}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(trip.start_date).toLocaleDateString()} -{" "}
                    {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Hosted by {trip.host?.name}
                  </p>
                  <Link
                    href={`/dashboard/trips/${trip.id}`}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 block"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ) : null,
        )}
      </MapContainer>
    </div>
  );
}
