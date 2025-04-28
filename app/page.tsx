// app/page.tsx

import Link from 'next/link';

export default function Home() {
  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 
    'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'
  ];
  
  return (
    <main className="container mx-auto p-4 pt-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Real Estate Project Finder</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover new real estate projects across major Indian cities
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Select a City</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularCities.map((city) => (
            <Link 
              href={`/city/${city}`} 
              key={city}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-xl font-medium text-blue-600">{city}</div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 rounded-lg max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">How it works</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Select a city from the options above</li>
          <li>View real estate projects available in that city</li>
          <li>See projects plotted on an interactive map</li>
          <li>Click on map markers to view project details</li>
        </ol>
      </div>
    </main>
  );
}