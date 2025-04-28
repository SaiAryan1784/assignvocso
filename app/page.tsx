// app/page.tsx

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ProjectCarousel from '@/components/ProjectCarousel';

export default function Home() {
  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 
    'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="container mx-auto p-4 pt-12">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Real Estate Project Finder
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover new real estate projects across major Indian cities. Find your dream property with our interactive map and detailed project listings.
          </p>
        </motion.div>

        
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto my-30"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-semibold mb-6 text-center text-gray-800"
          >
            Select a City
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularCities.map((city) => (
              <motion.div
                key={city}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href={`/city/${city}`}
                  className="block"
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:-translate-y-1">
                    <div className="text-xl font-medium text-blue-600">{city}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <ProjectCarousel />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 bg-white rounded-xl shadow-md max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">How it works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-blue-50 rounded-lg"
            >
              <h3 className="text-lg font-medium text-blue-600 mb-2">1. Select a City</h3>
              <p className="text-gray-600">Choose from our list of major Indian cities to explore real estate projects.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-blue-50 rounded-lg"
            >
              <h3 className="text-lg font-medium text-blue-600 mb-2">2. View Projects</h3>
              <p className="text-gray-600">Browse through detailed listings of real estate projects in your chosen city.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-blue-50 rounded-lg"
            >
              <h3 className="text-lg font-medium text-blue-600 mb-2">3. Interactive Map</h3>
              <p className="text-gray-600">See projects plotted on an interactive map for better location understanding.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-blue-50 rounded-lg"
            >
              <h3 className="text-lg font-medium text-blue-600 mb-2">4. Project Details</h3>
              <p className="text-gray-600">Click on map markers to view comprehensive project information.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}