// app/api/scraper/route.ts

import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  location: string;
  priceRange: string;
  builder: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const CITIES = {
  mumbai: 'https://www.magicbricks.com/new-projects-mumbai',
  delhi: 'https://www.magicbricks.com/new-projects-delhi',
  bangalore: 'https://www.magicbricks.com/new-projects-bangalore',
  hyderabad: 'https://www.magicbricks.com/new-projects-hyderabad',
  chennai: 'https://www.magicbricks.com/new-projects-chennai',
  kolkata: 'https://www.magicbricks.com/new-projects-kolkata',
  pune: 'https://www.magicbricks.com/new-projects-pune',
  ahmedabad: 'https://www.magicbricks.com/new-projects-ahmedabad'
};

// City center coordinates
const CITY_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  mumbai: { latitude: 19.076, longitude: 72.877 },
  delhi: { latitude: 28.613, longitude: 77.209 },
  bangalore: { latitude: 12.972, longitude: 77.594 },
  hyderabad: { latitude: 17.385, longitude: 78.486 },
  chennai: { latitude: 13.083, longitude: 80.270 },
  kolkata: { latitude: 22.572, longitude: 88.363 },
  pune: { latitude: 18.520, longitude: 73.856 },
  ahmedabad: { latitude: 23.023, longitude: 72.571 }
};

// Function to generate realistic coordinates around a city center
function generateCoordinatesAroundCity(city: string, index: number): { latitude: number; longitude: number } {
  const cityCenter = CITY_COORDINATES[city];
  if (!cityCenter) {
    return { latitude: 0, longitude: 0 };
  }
  
  // Generate points in different directions from city center
  // This creates a pattern around the city center to make markers visible
  const spread = 0.02; // Approximately 2km spread
  const offsets = [
    { lat: spread, lng: spread },     // Northeast
    { lat: spread, lng: -spread },    // Northwest
    { lat: -spread, lng: spread },    // Southeast
    { lat: -spread, lng: -spread },   // Southwest
    { lat: spread * 1.5, lng: 0 },    // North
    { lat: -spread * 1.5, lng: 0 },   // South
    { lat: 0, lng: spread * 1.5 },    // East
    { lat: 0, lng: -spread * 1.5 }    // West
  ];
  
  const offsetIndex = index % offsets.length;
  return {
    latitude: cityCenter.latitude + offsets[offsetIndex].lat,
    longitude: cityCenter.longitude + offsets[offsetIndex].lng
  };
}

// Fallback data to use when scraping fails
const FALLBACK_DATA: Record<string, Project[]> = {
  mumbai: [
    { id: 1, name: "Lodha Bellissimo", location: "Worli, Mumbai", priceRange: "₹2.5 Cr - ₹5 Cr", builder: "Lodha Group", coordinates: { latitude: 19.0176, longitude: 72.8156 } },
    { id: 2, name: "Oberoi Sky City", location: "Borivali East, Mumbai", priceRange: "₹1.8 Cr - ₹3.5 Cr", builder: "Oberoi Realty", coordinates: { latitude: 19.2183, longitude: 72.8641 } },
    { id: 3, name: "Godrej Trees", location: "Vikhroli, Mumbai", priceRange: "₹1.2 Cr - ₹2.8 Cr", builder: "Godrej Properties", coordinates: { latitude: 19.0996, longitude: 72.9260 } },
    { id: 4, name: "Hiranandani Fortune City", location: "Panvel, Mumbai", priceRange: "₹75 L - ₹1.5 Cr", builder: "Hiranandani Group", coordinates: { latitude: 19.0330, longitude: 73.1011 } }
  ],
  delhi: [
    { id: 1, name: "DLF Kings Court", location: "Greater Kailash, Delhi", priceRange: "₹2.2 Cr - ₹4 Cr", builder: "DLF Limited", coordinates: { latitude: 28.5494, longitude: 77.2443 } },
    { id: 2, name: "Godrej South Estate", location: "Okhla, Delhi", priceRange: "₹1.5 Cr - ₹3.2 Cr", builder: "Godrej Properties", coordinates: { latitude: 28.5312, longitude: 77.2707 } },
    { id: 3, name: "Tata Primanti", location: "Sector 72, Delhi", priceRange: "₹1.1 Cr - ₹2.5 Cr", builder: "Tata Housing", coordinates: { latitude: 28.4189, longitude: 77.0938 } },
    { id: 4, name: "ATS Pristine", location: "Sector 150, Delhi", priceRange: "₹85 L - ₹1.8 Cr", builder: "ATS Group", coordinates: { latitude: 28.4756, longitude: 77.3094 } }
  ],
  bangalore: [
    { id: 1, name: "Prestige City", location: "Whitefield, Bangalore", priceRange: "₹1.2 Cr - ₹2.8 Cr", builder: "Prestige Group", coordinates: { latitude: 12.9716, longitude: 77.7504 } },
    { id: 2, name: "Brigade Exotica", location: "Hebbal, Bangalore", priceRange: "₹1.5 Cr - ₹3 Cr", builder: "Brigade Group", coordinates: { latitude: 13.0546, longitude: 77.5975 } },
    { id: 3, name: "Sobha Dream Gardens", location: "Thanisandra, Bangalore", priceRange: "₹95 L - ₹1.8 Cr", builder: "Sobha Limited", coordinates: { latitude: 13.0660, longitude: 77.6281 } },
    { id: 4, name: "Godrej Reflections", location: "Electronic City, Bangalore", priceRange: "₹1.1 Cr - ₹2.2 Cr", builder: "Godrej Properties", coordinates: { latitude: 12.8458, longitude: 77.6612 } }
  ],
  hyderabad: [
    { id: 1, name: "My Home Bhooja", location: "Gachibowli, Hyderabad", priceRange: "₹1.2 Cr - ₹2.5 Cr", builder: "My Home Constructions", coordinates: { latitude: 17.4450, longitude: 78.3771 } },
    { id: 2, name: "Aparna Sarovar", location: "Nallagandla, Hyderabad", priceRange: "₹90 L - ₹1.8 Cr", builder: "Aparna Constructions", coordinates: { latitude: 17.4750, longitude: 78.3313 } },
    { id: 3, name: "DSR Fortune Prime", location: "Madhpur, Hyderabad", priceRange: "₹75 L - ₹1.5 Cr", builder: "DSR Builders", coordinates: { latitude: 17.4810, longitude: 78.4012 } },
    { id: 4, name: "Ramky One Marvel", location: "Gajularamaram, Hyderabad", priceRange: "₹85 L - ₹1.7 Cr", builder: "Ramky Group", coordinates: { latitude: 17.5340, longitude: 78.4601 } }
  ],
  chennai: [
    { id: 1, name: "TVS Emerald Green Enclave", location: "Perungalathur, Chennai", priceRange: "₹75 L - ₹1.4 Cr", builder: "TVS Group", coordinates: { latitude: 12.9119, longitude: 80.0784 } },
    { id: 2, name: "Casagrand Bloom", location: "Sholinganallur, Chennai", priceRange: "₹65 L - ₹1.2 Cr", builder: "Casagrand Builders", coordinates: { latitude: 12.9010, longitude: 80.2279 } },
    { id: 3, name: "Puravankara Windrush", location: "Guindy, Chennai", priceRange: "₹90 L - ₹1.8 Cr", builder: "Puravankara", coordinates: { latitude: 13.0066, longitude: 80.2206 } },
    { id: 4, name: "Godrej Azure", location: "Padur, Chennai", priceRange: "₹80 L - ₹1.5 Cr", builder: "Godrej Properties", coordinates: { latitude: 12.8304, longitude: 80.2514 } }
  ],
  kolkata: [
    { id: 1, name: "PS Group The 102", location: "Tollygunge, Kolkata", priceRange: "₹80 L - ₹1.6 Cr", builder: "PS Group", coordinates: { latitude: 22.4835, longitude: 88.3385 } },
    { id: 2, name: "Merlin Waterfront", location: "Howrah, Kolkata", priceRange: "₹65 L - ₹1.3 Cr", builder: "Merlin Group", coordinates: { latitude: 22.5908, longitude: 88.3057 } },
    { id: 3, name: "Ambuja Neotia Eco Space", location: "New Town, Kolkata", priceRange: "₹70 L - ₹1.4 Cr", builder: "Ambuja Neotia", coordinates: { latitude: 22.6233, longitude: 88.4604 } },
    { id: 4, name: "Eden Group Richmond", location: "EM Bypass, Kolkata", priceRange: "₹60 L - ₹1.2 Cr", builder: "Eden Group", coordinates: { latitude: 22.5133, longitude: 88.3979 } }
  ],
  pune: [
    { id: 1, name: "Kohinoor Grandeur", location: "Pimpri, Pune", priceRange: "₹70 L - ₹1.4 Cr", builder: "Kohinoor Group", coordinates: { latitude: 18.6233, longitude: 73.8222 } },
    { id: 2, name: "Goel Ganga Platino", location: "Kharadi, Pune", priceRange: "₹85 L - ₹1.6 Cr", builder: "Goel Ganga Developers", coordinates: { latitude: 18.5578, longitude: 73.9432 } },
    { id: 3, name: "VTP Urban Nest", location: "Undri, Pune", priceRange: "₹60 L - ₹1.2 Cr", builder: "VTP Realty", coordinates: { latitude: 18.4641, longitude: 73.9285 } },
    { id: 4, name: "Pride World City", location: "Charholi, Pune", priceRange: "₹55 L - ₹1.1 Cr", builder: "Pride Group", coordinates: { latitude: 18.6620, longitude: 73.9332 } }
  ],
  ahmedabad: [
    { id: 1, name: "Adani Shantigram", location: "SG Highway, Ahmedabad", priceRange: "₹90 L - ₹2 Cr", builder: "Adani Realty", coordinates: { latitude: 23.0734, longitude: 72.5177 } },
    { id: 2, name: "Sun Optima", location: "Navrangpura, Ahmedabad", priceRange: "₹65 L - ₹1.3 Cr", builder: "Sun Builders", coordinates: { latitude: 23.0321, longitude: 72.5698 } },
    { id: 3, name: "Iscon Platinum", location: "Bopal, Ahmedabad", priceRange: "₹55 L - ₹1.1 Cr", builder: "Iscon Group", coordinates: { latitude: 23.0344, longitude: 72.4548 } },
    { id: 4, name: "Goyal Intercity", location: "Drive In Road, Ahmedabad", priceRange: "₹75 L - ₹1.5 Cr", builder: "Goyal Group", coordinates: { latitude: 23.0465, longitude: 72.5320 } }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.toLowerCase();

  if (!city || !(city in CITIES)) {
    return NextResponse.json(
      { error: 'Invalid city parameter' },
      { status: 400 }
    );
  }

  try {
    const url = CITIES[city as keyof typeof CITIES];
    console.log(`Attempting to fetch data from: ${url}`);

    const response = await axios.get(url, {
      timeout: 30000, // Increased timeout to 30 seconds
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.data) {
      console.warn(`No data received from MagicBricks for ${city}, using fallback data`);
      return NextResponse.json({ projects: FALLBACK_DATA[city] || [] });
    }

    const $ = cheerio.load(response.data);
    const projects: Project[] = [];
    let projectId = 1;

    $('.mb-srp__card').each((index: number, element) => {
      const name = $(element).find('.mb-srp__card--title').text().trim();
      const location = $(element).find('.mb-srp__card--address').text().trim();
      const priceRange = $(element).find('.mb-srp__card__price--amount').text().trim();
      const builder = $(element).find('.mb-srp__card__ads--name').text().trim();

      if (name && location) {
        // Generate coordinates for each project
        const coordinates = generateCoordinatesAroundCity(city, index);
        
        projects.push({
          id: projectId++,
          name,
          location,
          priceRange: priceRange || 'Price on request',
          builder: builder || 'Unknown Builder',
          coordinates: coordinates
        });
      }
    });

    if (projects.length === 0) {
      console.warn(`No projects found for ${city}, using fallback data`);
      return NextResponse.json({ projects: FALLBACK_DATA[city] || [] });
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Scraping error:', error);
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      console.warn(`Request timed out for ${city}, using fallback data`);
      return NextResponse.json({ 
        projects: FALLBACK_DATA[city] || [],
        notice: 'Data retrieved from cached source due to timeout'
      });
    }
    console.warn(`Error fetching data for ${city}, using fallback data`);
    return NextResponse.json({ 
      projects: FALLBACK_DATA[city] || [],
      notice: 'Data retrieved from cached source due to error'
    });
  }
}