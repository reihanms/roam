"use client";

import { useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "react-photo-album/rows.css";

interface DestinationImagesProps {
  latitude: number;
  longitude: number;
}

interface Photo {
  src: string;
  width: number;
  height: number;
}

export default function DestinationImages({
  latitude,
  longitude,
}: DestinationImagesProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const geoResponse = await fetch(
          `/api/geocode?lat=${latitude}&lon=${longitude}`
        );
        const geoData = await geoResponse.json();
        const locationName =
          geoData.features[0]?.properties.city ||
          geoData.features[0]?.properties.country;

        if (locationName) {
          const unsplashResponse = await fetch(
            `/api/unsplash?query=${encodeURIComponent(locationName)}`
          );
          const unsplashData = await unsplashResponse.json();
          setPhotos(unsplashData.photos);
        }
      } catch (error) {
        console.error("Failed to fetch destination images:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <p>Loading images...</p>
        </div>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return null; // Don't show the card if there are no images or loading failed
  }

  return (
    <>
      <PhotoAlbum
        photos={photos}
        layout="rows"
        targetRowHeight={200}
        onClick={({ index }) => setIndex(index)}
      />
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos}
      />
    </>
  );
}

