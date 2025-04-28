// src/lib/store.ts
import { create } from 'zustand';

export interface Project {
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

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  error: null,
  selectedProject: null,
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => {
    // Check if project already exists
    const exists = state.projects.some(p => 
      p.id === project.id && 
      p.name === project.name && 
      p.location === project.location
    );
    
    if (exists) {
      return state;
    }
    
    return { 
      projects: [...state.projects, project] 
    };
  }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedProject: (project) => set({ selectedProject: project }),
}));