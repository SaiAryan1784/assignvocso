// src/components/ProjectList.tsx
import { useProjectStore } from '@/lib/store';
import ProjectCard from './ProjectCard';
import LoadingSpinner from './LoadingSpinner';

export default function ProjectList() {
  const { projects, loading, error, setSelectedProject } = useProjectStore();

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="overflow-y-auto max-h-[600px]">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      
      {loading && projects.length === 0 && (
        <div className="flex justify-center p-4">
          <LoadingSpinner />
        </div>
      )}
      
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard 
            key={`${project.id}-${project.name}`} 
            project={project} 
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>
      
      {loading && projects.length > 0 && (
        <div className="flex justify-center p-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}