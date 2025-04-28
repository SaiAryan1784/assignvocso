// src/components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`spinner ${className || ''}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}