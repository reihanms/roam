import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Input } from "./input";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationSearchProps {
  onLocationSelect: (location: {
    address: string;
    coordinates: [number, number];
  }) => void;
  defaultValue?: string;
}

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export function LocationSearch({
  onLocationSelect,
  defaultValue = "",
}: LocationSearchProps) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: [number, number];
  } | null>(null);
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [showResults, setShowResults] = useState(false);

  const provider = new OpenStreetMapProvider();

  const handleSearch = async (value: string) => {
    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await provider.search({ query: value });
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };

  const handleLocationSelect = (result: any) => {
    const location = {
      address: result.label,
      coordinates: [result.y, result.x] as [number, number],
    };
    setSelectedLocation(location);
    setSearchValue(result.label);
    setShowResults(false);
    onLocationSelect(location);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          name="destination"
          placeholder="Search location..."
          value={searchValue}
          onChange={(e) => {
            const value = e.target.value;
            setSearchValue(value);
            handleSearch(value);
          }}
          onFocus={() => setShowResults(true)}
        />
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-[2000] w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={() => handleLocationSelect(result)}
              >
                {result.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-[300px] w-full rounded-md border overflow-hidden">
        <MapContainer
          center={selectedLocation?.coordinates || [0, 0]}
          zoom={selectedLocation ? 13 : 2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedLocation && (
            <>
              <Marker position={selectedLocation.coordinates} icon={icon} />
              <MapUpdater center={selectedLocation.coordinates} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

