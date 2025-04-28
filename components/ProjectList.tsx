// src/components/ProjectList.tsx
import { useProjectStore } from '@/lib/store';
import ProjectCard from './ProjectCard';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectList() {
  const { projects, loading, error, setSelectedProject } = useProjectStore();

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 p-4"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-y-auto max-h-[600px]"
    >
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold mb-4"
      >
        Projects
      </motion.h2>
      
      <AnimatePresence>
        {loading && projects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex justify-center p-4"
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={`${project.id}-${project.name}-${project.location}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ProjectCard 
                project={project} 
                onClick={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      <AnimatePresence>
        {loading && projects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex justify-center p-4"
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}