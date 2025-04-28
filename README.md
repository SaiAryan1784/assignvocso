# AssignVocso - Real Estate Project Viewer

> This project was created as part of a technical assignment for Vocso. It demonstrates real estate project visualization using mock data.

## Tech Stack

- Next.js 15
- TypeScript
- Zustand for state management
- Leaflet for maps
- Tailwind CSS for styling

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- 🏘️ Display of mock real estate project data
- 🗺️ Interactive map visualization using Leaflet
- 📍 Geocoding integration
- 🏃‍♂️ Real-time loading states
- 📱 Responsive design
- 🔄 Incremental data loading

## Project Structure

```
assignvocso/
├── app/
│   ├── api/          # API routes with mock data
│   ├── city/         # City-specific pages
│   └── page.tsx      # Home page
├── components/       # Reusable React components
├── lib/             # Utilities and store
│   └── mockData/    # Mock data files
└── types/           # TypeScript type definitions
```

## Environment Setup

Create a `.env.local` file in the root directory:

```plaintext
NEXT_PUBLIC_MOCK_DATA=true
NEXT_PUBLIC_GEOCODING_API_KEY=your_geocoding_api_key
```

## Available Cities

The application currently supports viewing real estate projects in:
- Mumbai
- Delhi
- Bangalore
- Hyderabad
- Chennai
- Kolkata
- Pune
- Ahmedabad

## Development

### Making Changes

You can start editing the pages by modifying files in the `app` directory. The pages auto-update as you edit the files.

### Components

The project uses a component-based architecture:
- `ProjectList`: Displays the list of real estate projects
- `ProjectCard`: Individual project display component
- `Map`: Interactive map visualization using Leaflet
- `LoadingSpinner`: Loading state indicator

## Notes

- This project uses mock data instead of live scraping
- The map view is client-side rendered to avoid SSR issues with Leaflet
- City data is loaded incrementally for better user experience

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Leaflet Maps](https://leafletjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Disclaimer

This is a technical assessment project created for Vocso and uses mock data for demonstration purposes.
