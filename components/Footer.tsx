'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 border-t mt-[3rem]"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">Real Estate Project Finder</h3>
            <p className="text-sm text-gray-600">Find your dream property with ease</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Real Estate Project Finder. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
} 