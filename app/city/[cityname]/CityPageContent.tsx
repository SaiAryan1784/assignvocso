'use client';

import { useEffect, useState } from 'react';
import { useProjectStore } from '@/lib/store';
import ProjectList from '@/components/ProjectList';
import LoadingSpinner from '@/components/LoadingSpinner';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full flex items-center justify-center"
    >
      <div className="text-gray-600">Loading map...</div>
    </motion.div>
  ),
});

export default function CityPageContent({ cityname }: { cityname: string }) {
  const { setProjects, addProject, setLoading, setError, loading } = useProjectStore();
  const [cityName] = useState(cityname);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        setProjects([]);
        
        const response = await fetch(`/api/scraper?city=${cityName}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const data = await response.json();
        
        for (const project of data.projects) {
          const geoResponse = await fetch(
            `/api/geocoding?location=${encodeURIComponent(project.location)}&city=${cityName}`
          );
          
          if (!geoResponse.ok) throw new Error('Failed to geocode location');
          
          const geoData = await geoResponse.json();
          
          addProject({
            ...project,
            coordinates: geoData.coordinates
          });
          
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [cityName, setProjects, addProject, setLoading, setError]);

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 pt-6"
    >
      <motion.div 
        className="flex items-center mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold">Real Estate Projects in {cityName}</h2>
        <AnimatePresence>
          {loading && (
            <motion.div 
              className="ml-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProjectList />
        </motion.div>
        <motion.div 
          className="md:col-span-2 h-[500px] rounded-lg overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MapWithNoSSR cityName={cityName} />
        </motion.div>
      </motion.div>
    </motion.main>  
  );
}