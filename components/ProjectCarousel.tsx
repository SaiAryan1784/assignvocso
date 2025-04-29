'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  id: number;
  name: string;
  location: string;
  priceRange: string;
  builder: string;
  city: string;
}

const featuredProjects: Project[] = [
  {
    id: 1,
    name: "Lodha Bellissimo",
    location: "Worli, Mumbai",
    priceRange: "₹2.5 Cr - ₹5 Cr",
    builder: "Lodha Group",
    city: "Mumbai"
  },
  {
    id: 2,
    name: "Godrej Air",
    location: "Gurgaon, Delhi",
    priceRange: "₹1.8 Cr - ₹3.5 Cr",
    builder: "Godrej Properties",
    city: "Delhi"
  },
  {
    id: 3,
    name: "Prestige City",
    location: "Whitefield, Bangalore",
    priceRange: "₹1.2 Cr - ₹2.8 Cr",
    builder: "Prestige Group",
    city: "Bangalore"
  },
  {
    id: 4,
    name: "Brigade Utopia",
    location: "Hitech City, Hyderabad",
    priceRange: "₹1.5 Cr - ₹3 Cr",
    builder: "Brigade Group",
    city: "Hyderabad"
  },
  {
    id: 5,
    name: "Sobha Dream Gardens",
    location: "Pallikaranai, Chennai",
    priceRange: "₹1 Cr - ₹2.5 Cr",
    builder: "Sobha Limited",
    city: "Chennai"
  },
  {
    id: 6,
    name: "Tata New Haven",
    location: "New Town, Kolkata",
    priceRange: "₹80 L - ₹2 Cr",
    builder: "Tata Housing",
    city: "Kolkata"
  },
  {
    id: 7,
    name: "Mahindra LifeSpaces",
    location: "Hinjewadi, Pune",
    priceRange: "₹1.2 Cr - ₹2.5 Cr",
    builder: "Mahindra Group",
    city: "Pune"
  },
  {
    id: 8,
    name: "Adani Shantigram",
    location: "SG Highway, Ahmedabad",
    priceRange: "₹90 L - ₹2 Cr",
    builder: "Adani Realty",
    city: "Ahmedabad"
  }
];

export default function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProjects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Featured Projects</h2>
      <div className="relative h-[400px] overflow-hidden rounded-xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                setDirection(1);
                setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProjects.length);
              } else if (swipe > swipeConfidenceThreshold) {
                setDirection(-1);
                setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredProjects.length) % featuredProjects.length);
              }
            }}
            className="absolute w-full h-full"
          >
            <Link href={`/city/${featuredProjects[currentIndex].city}`}>
              <div className="relative w-full h-full rounded-xl shadow-lg overflow-hidden cursor-pointer bg-white">
                <div className="absolute inset-0">
                  <Image
                    src="/building.jpg"
                    alt="Building"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                    quality={100}
                  />
                </div>
                <div className="relative h-full flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-bold mb-2">
                    {featuredProjects[currentIndex].name}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-300">Location</p>
                      <p className="font-semibold">{featuredProjects[currentIndex].location}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Price Range</p>
                      <p className="font-semibold text-blue-300">{featuredProjects[currentIndex].priceRange}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Builder</p>
                      <p className="font-semibold">{featuredProjects[currentIndex].builder}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-4 space-x-3">
        {featuredProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-600 scale-125 ring-2 ring-blue-400 ring-offset-2' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 