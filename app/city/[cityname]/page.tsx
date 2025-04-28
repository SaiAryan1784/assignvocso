'use client';

import { useEffect, use } from 'react';
import { useProjectStore } from '@/lib/store';
import ProjectList from '@/components/ProjectList';
import LoadingSpinner from '@/components/LoadingSpinner';
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
});

export default function CityPage({ params }: { params: { cityname: string } }) {
  const { setProjects, addProject, setLoading, setError, loading } = useProjectStore();
  const unwrappedParams = use(params);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        setProjects([]);
        
        const response = await fetch(`/api/scraper?city=${unwrappedParams.cityname}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const data = await response.json();
        
        // Process projects and add them incrementally
        for (const project of data.projects) {
          const geoResponse = await fetch(
            `/api/geocoding?location=${encodeURIComponent(project.location)}&city=${unwrappedParams.cityname}`
          );
          
          if (!geoResponse.ok) throw new Error('Failed to geocode location');
          
          const geoData = await geoResponse.json();
          
          // Add project with coordinates
          addProject({
            ...project,
            coordinates: geoData.coordinates
          });
          
          // Add a small delay to simulate incremental loading
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [unwrappedParams.cityname, setProjects, addProject, setLoading, setError]);
  
  return (
    <main className="container mx-auto p-4 pt-6">
      <div className="flex items-center mb-6">
        <h2 className="text-3xl font-bold">Real Estate Projects in {unwrappedParams.cityname}</h2>
        {loading && (
          <div className="ml-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProjectList />
        </div>
        <div className="md:col-span-2 h-[600px] bg-gray-200 rounded-lg shadow-md overflow-hidden">
          <MapWithNoSSR cityName={unwrappedParams.cityname} />
        </div>
      </div>
    </main>  
  );
}