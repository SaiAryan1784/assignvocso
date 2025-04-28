'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const popularCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 
  'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Indore', 'Bhopal',
  'Patna', 'Bhubaneswar', 'Coimbatore', 'Vadodara'
];

export default function Navbar() {
  const pathname = usePathname();
  const isCityPage = pathname.startsWith('/city/');
  const currentCity = isCityPage ? pathname.split('/')[2] : null;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          <Link href="/" className="mb-4 md:mb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real Estate Finder
              </h1>
            </motion.div>
          </Link>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            {isCityPage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <span className="text-gray-600">Current City:</span>
                <span className="font-semibold text-blue-600">{currentCity}</span>
              </motion.div>
            )}
            
            <div className="relative w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-between"
              >
                <span>Select City</span>
                <svg 
                  className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-full md:w-64 bg-white rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {popularCities.map((city) => (
                      <Link
                        key={city}
                        href={`/city/${city}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 