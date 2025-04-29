'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useProjectStore, Project } from '@/lib/store';
import L from 'leaflet';

// Custom icon definition
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div class="relative">
      <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <div class="w-3 h-3 bg-white rounded-full"></div>
      </div>
      <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

// City coordinates mapping with proper typing
const CITY_COORDINATES: Record<string, [number, number]> = {
  'mumbai': [19.076, 72.877],
  'delhi': [28.613, 77.209],
  'bangalore': [12.972, 77.594],
  'hyderabad': [17.385, 78.486],
  'chennai': [13.083, 80.270],
  'kolkata': [22.572, 88.363],
  'pune': [18.520, 73.856],
  'ahmedabad': [23.023, 72.571]
};

// Generate coordinates for projects when needed
function getCoordinatesForCity(city: string): [number, number] {
  const normalized = city.toLowerCase();
  return CITY_COORDINATES[normalized as keyof typeof CITY_COORDINATES] || [20.5937, 78.9629];
}

export default function Map({ cityName }: { cityName?: string }) {
  const { projects, selectedProject } = useProjectStore();
  const mapRef = useRef<L.Map | null>(null);
  const [displayedProjects, setDisplayedProjects] = useState(projects);
  
  // Initial center based on India
  const defaultCenter = [20.5937, 78.9629] as [number, number];
  const defaultZoom = 5;

  // Function to fix project coordinates
  const fixProjectCoordinates = useCallback((project: Project, index: number, cityCoords: [number, number]) => {
    if (project.coordinates) {
      const lat = project.coordinates.latitude;
      const lng = project.coordinates.longitude;
      
      // Check if coordinates are roughly in the same area as the city
      const isInCityArea = Math.abs(lat - cityCoords[0]) < 1 && 
                          Math.abs(lng - cityCoords[1]) < 1;
      
      if (isInCityArea) {
        return project;
      }
    }
    
    // Generate a pattern of coordinates around the city center
    const offset = 0.02; // About 2km
    const offsets = [
      [offset, offset],       // northeast
      [offset, -offset],      // northwest  
      [-offset, offset],      // southeast
      [-offset, -offset],     // southwest
      [offset * 1.5, 0],      // north
      [-offset * 1.5, 0],     // south
      [0, offset * 1.5],      // east
      [0, -offset * 1.5]      // west
    ];
    
    const position = index % offsets.length;
    
    return {
      ...project,
      coordinates: {
        latitude: cityCoords[0] + offsets[position][0],
        longitude: cityCoords[1] + offsets[position][1]
      }
    };
  }, []);

  // Update projects and map view when cityName or projects change
  useEffect(() => {
    if (!cityName) return;
    
    // Get city coordinates
    const cityCoords = getCoordinatesForCity(cityName);
    
    // Fix project coordinates
    const fixedProjects = projects.map((project, index) => 
      fixProjectCoordinates(project, index, cityCoords)
    );
    
    // Update displayed projects
    setDisplayedProjects(fixedProjects);
    
    // Update map view if available
    if (mapRef.current) {
      console.log(`Setting map view for ${cityName} to ${cityCoords}`);
      mapRef.current.setView(cityCoords, 12);
      
      // Force a small delay to make sure the map updates
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
          mapRef.current.setView(cityCoords, 12);
        }
      }, 100);
    }
  }, [cityName, projects, fixProjectCoordinates]);
  
  // Handle selected project zoom - separate from other effects
  useEffect(() => {
    if (!selectedProject || !mapRef.current || !cityName) return;
    
    // Get fixed coordinates for the selected project
    const cityCoords = getCoordinatesForCity(cityName);
    
    // Find the project in our fixed projects list
    const fixedProject = displayedProjects.find(p => p.id === selectedProject.id);
    
    if (fixedProject && fixedProject.coordinates) {
      // Use the fixed coordinates
      const { latitude, longitude } = fixedProject.coordinates;
      console.log(`Zooming to selected project: ${fixedProject.name} at [${latitude}, ${longitude}]`);
      mapRef.current.setView([latitude, longitude], 15);
    } else {
      // Fallback to city coordinates with a small offset
      const fixedLat = cityCoords[0] + 0.01;
      const fixedLng = cityCoords[1] + 0.01;
      console.log(`Using city coordinates for ${selectedProject.name || 'project'}: [${fixedLat}, ${fixedLng}]`);
      mapRef.current.setView([fixedLat, fixedLng], 15);
    }
  // Only depend on selectedProject.id to prevent loop
  }, [selectedProject?.id, cityName, displayedProjects, selectedProject]);
  
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden mapContainer">
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .leaflet-container {
          height: 100% !important;
          width: 100% !important;
          z-index: 1;
        }
      `}</style>
      
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {displayedProjects.filter(p => p.coordinates).map((project) => (
          <Marker
            key={`${project.id}-${project.name}`}
            position={[
              project.coordinates!.latitude, 
              project.coordinates!.longitude
            ]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-4 min-w-[250px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 mb-1">{project.location}</p>
                <p className="text-blue-600 font-medium">{project.priceRange}</p>
                {project.builder && (
                  <p className="text-gray-600 mt-1">By {project.builder}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}