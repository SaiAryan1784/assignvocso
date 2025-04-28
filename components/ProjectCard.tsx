// src/components/ProjectCard.tsx
import { Project } from '@/lib/store';

export default function ProjectCard({ 
  project, 
  onClick 
}: { 
  project: Project; 
  onClick: () => void;
}) {
  return (
    <div 
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-gray-600">{project.location}</p>
      <p className="text-gray-800 font-semibold">{project.priceRange}</p>
      <p className="text-gray-600 text-sm">By {project.builder}</p>
    </div>
  );
}