'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useProjectStore } from '@/lib/store';
import L from 'leaflet';

// Fix for Leaflet marker icons
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Map({ cityName }: { cityName?: string }) {
  const { projects, selectedProject } = useProjectStore();
  // Initial map center state
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.076, 72.877]); // Default to Mumbai
  const [zoom] = useState(12); // Default zoom level

  useEffect(() => {
    // Set initial map center based on cityName
    const cityCoordinates: Record<string, [number, number]> = {
      'mumbai': [19.076, 72.877],
      'delhi': [28.613, 77.209],
      'bangalore': [12.972, 77.594],
      'hyderabad': [17.385, 78.486],
      'chennai': [13.083, 80.270],
      'kolkata': [22.572, 88.363],
      'pune': [18.520, 73.856],
      'ahmedabad': [23.023, 72.571]
    };

    // Add null/undefined check before using cityName
    if (!cityName) {
      console.log('No city name provided, using default map center');
      return; // Exit early if cityName is not provided
    }

    const normalizedCityName = cityName.toLowerCase();
    if (cityCoordinates[normalizedCityName]) {
      setMapCenter(cityCoordinates[normalizedCityName]);
      console.log(`Map initialized for city: ${cityName} at coordinates: ${cityCoordinates[normalizedCityName]}`);
    } else {
      // If city not in our predefined list, try to fetch coordinates
      const fetchCityCoordinates = async () => {
        try {
          const response = await fetch(`/api/geocoding?location=${encodeURIComponent(cityName)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.coordinates) {
              setMapCenter([data.coordinates.latitude, data.coordinates.longitude]);
              console.log(`Fetched coordinates for ${cityName}: [${data.coordinates.latitude}, ${data.coordinates.longitude}]`);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch coordinates for ${cityName}:`, error);
        }
      };
      fetchCityCoordinates();
    }
  }, [cityName]);

  useEffect(() => {
    // Update map center based on selected project
    if (selectedProject?.coordinates) {
      setMapCenter([
        selectedProject.coordinates.latitude,
        selectedProject.coordinates.longitude
      ]);
    }
  }, [selectedProject]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        key={`${mapCenter[0]}-${mapCenter[1]}`} // Add key to force re-render when center changes
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {projects.filter(p => p.coordinates).map((project) => (
          <Marker
            key={project.id}
            position={[
              project.coordinates!.latitude,
              project.coordinates!.longitude
            ]}
            icon={icon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{project.name}</h3>
                <p>{project.location}</p>
                <p>{project.priceRange}</p>
                <p>By {project.builder}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}