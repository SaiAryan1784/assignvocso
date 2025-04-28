import { NextResponse } from 'next/server';
import axios from 'axios';

// Simple in-memory cache
const geocodeCache: Record<string, { latitude: number; longitude: number }> = {};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const location = url.searchParams.get('location');
  const city = url.searchParams.get('city');

  if (!location) {
    return NextResponse.json(
      { error: 'Location parameter is required' },
      { status: 400 }
    );
  }

  // Normalize the location for cache key
  const cacheKey = location.trim().toLowerCase();

  // Check if we have cached results
  if (geocodeCache[cacheKey]) {
    console.log(`Using cached coordinates for ${cacheKey}`);
    return NextResponse.json({ coordinates: geocodeCache[cacheKey] });
  }

  // Define preset coordinates for common locations in India
  const presetCoordinates: Record<string, { latitude: number; longitude: number }> = {
    'marathahalli': { latitude: 12.9591, longitude: 77.6974 },
    'jp nagar': { latitude: 12.9105, longitude: 77.5857 },
    'bangalore': { latitude: 12.9716, longitude: 77.5946 },
    'delhi': { latitude: 28.6139, longitude: 77.2090 },
    'mumbai': { latitude: 19.0760, longitude: 72.8777 },
    'hyderabad': { latitude: 17.3850, longitude: 78.4867 },
    'chennai': { latitude: 13.0827, longitude: 80.2707 },
    // Add more preset locations as needed
  };

  // Check if we have preset coordinates for this location
  if (presetCoordinates[cacheKey]) {
    console.log(`Using preset coordinates for ${cacheKey}`);
    // Cache the preset coordinates
    geocodeCache[cacheKey] = presetCoordinates[cacheKey];
    return NextResponse.json({ coordinates: presetCoordinates[cacheKey] });
  }

  try {
    // Get the API key from environment variables
    const API_KEY = process.env.POSITIONSTACK_API_KEY;
    if (!API_KEY) {
      throw new Error('PositionStack API key not configured');
    }

    // Add HTTPS to the URL (the original was using HTTP which might not work)
    // Also, add a timeout to prevent hanging requests
    const response = await axios.get('https://api.positionstack.com/v1/forward', {
      params: {
        access_key: API_KEY,
        query: city ? `${location}, ${city}, India` : `${location}, India`
      },
      timeout: 5000 // 5 second timeout
    });

    if (response.data.data && response.data.data.length > 0) {
      const { latitude, longitude } = response.data.data[0];
      
      // Cache the successful result
      geocodeCache[cacheKey] = { latitude, longitude };
      
      return NextResponse.json({ coordinates: { latitude, longitude } });
    } else {
      throw new Error('No coordinates found for this location');
    }
  } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Geocoding error:', error.message);
      } else {
        console.error('Geocoding error:', error);
    }
    
    // Generate deterministic mock coordinates based on the location string
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    };

    const locationHash = hashCode(cacheKey);
    
    // Use the hash to create consistent but unique coordinates
    // Center around Bangalore with small offsets
    const mockCoordinates = {
      latitude: 12.9716 + (locationHash % 1000) / 10000,
      longitude: 77.5946 + (locationHash % 500) / 10000
    };

    // Cache the mock coordinates
    geocodeCache[cacheKey] = mockCoordinates;
    
    // Return mock coordinates along with a flag indicating they're mocked
    return NextResponse.json({ 
      coordinates: mockCoordinates,
      source: 'mock'
    });
  }
}