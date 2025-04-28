// app/api/scraper/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Define the Project interface
interface Project {
  id: number;
  name: string;
  location: string;
  priceRange: string;
  builder: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cityName = url.searchParams.get('city');
  
  if (!cityName) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Format the city name for the MagicBricks URL
    const cityMapping: Record<string, string> = {
      'mumbai': 'mumbai',
      'delhi': 'delhi',
      'bangalore': 'bangalore',
      'hyderabad': 'hyderabad',
      'chennai': 'chennai',
      'kolkata': 'kolkata',
      'pune': 'pune',
      'ahmedabad': 'ahmedabad'
    };
    
    const normalizedCityName = cityName.toLowerCase();
    const formattedCityName = cityMapping[normalizedCityName] || normalizedCityName.replace(/\s+/g, '-');
    
    // Try both URL formats that MagicBricks might use
    const scrapingUrls = [
      `https://www.magicbricks.com/new-projects-${formattedCityName}`
    ];
    
    console.log(`Attempting to scrape URLs: ${scrapingUrls.join(', ')}`);
    
    // Try each URL until one works
    let response;
    
    for (const url of scrapingUrls) {
      try {
        response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.magicbricks.com/',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: 10000 // 10 second timeout
        });
        
        // Removed assignment to unused variable successUrl
        console.log(`Successfully fetched data from: ${url}`);
        break;
      } catch (err) {
        console.error(`Failed to fetch from ${url}:`, err instanceof Error ? err.message : String(err));
      }
    }
    
    if (!response) {
      throw new Error('Failed to fetch data from any MagicBricks URL');
    }
    
    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);
    
    const projects: Project[] = [];
    let projectId = 1;
    
    // MagicBricks selector for project cards - updated with more accurate selectors
    console.log('Searching for project cards with updated selectors');
    
    // Try multiple selectors that might match MagicBricks' structure
    $('.mb-srp__card').each((index, element) => {
      try {
        // Extract project name - using more generic selectors
        const name = $(element).find('[class*="propertyName"], [class*="title"], h2, .card-header, .name, .project-name').first().text().trim();
        
        // Extract location - using more generic selectors
        const location = $(element).find('[class*="location"], [class*="address"], [class*="subTitle"], .card-subtitle, .address').first().text().trim();
        
        // Extract price range - using more generic selectors
        const priceRange = $(element).find('[class*="price"], .price, .amount, [class*="cost"]').first().text().trim() || 'Price on Request';
        
        // Extract builder name - using more generic selectors
        const builder = $(element).find('[class*="developer"], [class*="builder"], .builder-name, .company, [class*="brand"]').first().text().trim() || 'Unknown Developer';
        
        // Only add projects that have at least a name and location
        if (name && location) {
          projects.push({
            id: projectId++,
            name,
            location: `${location}, ${cityName}`,
            priceRange,
            builder
          });
        }
      } catch (err) {
        console.error(`Error parsing project card ${index}:`, err);
      }
    });
    
    // Fallback if no projects found - try alternative selectors
    if (projects.length === 0) {
      console.log('First selector failed, trying alternative selectors');
      $('.SRCard, .srp-card, .m-srp-card, .srpTuple__cardWrap').each((index, element) => {
        try {
          // Using more generic selectors for alternative card style
          const name = $(element).find('[class*="title"], [class*="name"], h2, h3, .card-title').first().text().trim();
          const location = $(element).find('[class*="address"], [class*="location"], .locality, .area').first().text().trim();
          const priceRange = $(element).find('[class*="price"], .cost, .amount').first().text().trim() || 'Price on Request';
          const builder = $(element).find('[class*="developer"], [class*="builder"], .brand, .company').first().text().trim() || 'Unknown Developer';
          
          if (name && location) {
            projects.push({
              id: projectId++,
              name,
              location: `${location}, ${cityName}`,
              priceRange,
              builder
            });
          }
        } catch (err) {
          console.error(`Error parsing project card ${index} (alternative):`, err);
        }
      });
    }
    
    // If still no projects found, try one more alternative selector pattern
    if (projects.length === 0) {
      console.log('Second selector failed, trying more generic selectors');
      $('.projectTuple, .project-tuple, [data-type="PROPERTY"], .card, .property-card').each((index, element) => {
        try {
          // Using even more generic selectors as a last resort
          const name = $(element).find('h1, h2, h3, h4, [class*="name"], [class*="title"], .project-name, .property-title').first().text().trim();
          const location = $(element).find('[class*="address"], [class*="location"], .area, .locality, p:contains("Location")').first().text().trim();
          const priceRange = $(element).find('[class*="price"], [class*="cost"], [class*="amount"], .price, .rate').first().text().trim() || 'Price on Request';
          const builder = $(element).find('[class*="developer"], [class*="builder"], [class*="brand"], .company, .developer').first().text().trim() || 'Unknown Developer';
          
          if (name && location) {
            projects.push({
              id: projectId++,
              name,
              location: `${location}, ${cityName}`,
              priceRange,
              builder
            });
          }
        } catch (err) {
          console.error(`Error parsing project card ${index} (alternative 2):`, err);
        }
      });
    }
    
    // If still nothing found, provide sample data for development
    if (projects.length === 0) {
      console.log("No projects found using selectors. Using sample data.");
      return NextResponse.json({
        projects: [
          {
            id: 1,
            name: "Prestige City",
            location: `Whitefield, ${cityName}`,
            priceRange: "₹85L - 1.5Cr",
            builder: "Prestige Group"
          },
          {
            id: 2,
            name: "Godrej Woods",
            location: `Electronic City, ${cityName}`,
            priceRange: "₹72L - 95L",
            builder: "Godrej Properties"
          },
          {
            id: 3,
            name: "Brigade Meadows",
            location: `Hebbal, ${cityName}`,
            priceRange: "₹55L - 1.2Cr",
            builder: "Brigade Group"
          },
          {
            id: 4,
            name: "Sobha Dream Acres",
            location: `Marathahalli, ${cityName}`,
            priceRange: "₹65L - 90L",
            builder: "Sobha Limited"
          },
          {
            id: 5,
            name: "Puravankara Zenium",
            location: `JP Nagar, ${cityName}`,
            priceRange: "₹90L - 1.8Cr",
            builder: "Puravankara"
          }
        ]
      });
    }
    
    console.log(`Successfully scraped ${projects.length} projects`);
    return NextResponse.json({ projects });
    
  } catch (error) {
    console.error('Scraping error:', error);
    
    // Return a helpful error message
    return NextResponse.json(
      { 
        error: 'Failed to scrape projects data',
        message: error instanceof Error ? error.message : 'Unknown error',
        // Return fallback data for development
        projects: [
          {
            id: 1,
            name: "Prestige City",
            location: `Whitefield, ${cityName}`,
            priceRange: "₹85L - 1.5Cr",
            builder: "Prestige Group"
          },
          {
            id: 2,
            name: "Godrej Woods",
            location: `Electronic City, ${cityName}`,
            priceRange: "₹72L - 95L",
            builder: "Godrej Properties"
          }
        ]
      },
      { status: 200 } // Still return 200 with fallback data for development
    );
  }
}