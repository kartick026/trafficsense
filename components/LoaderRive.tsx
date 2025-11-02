import React from 'react';
import { useRive } from '@rive-app/react-canvas';

interface LoaderRiveProps {
  className?: string;
  src?: string;
}

const LoaderRive: React.FC<LoaderRiveProps> = ({ className, src = '/loader.riv' }) => {
  const { RiveComponent } = useRive({ src, autoplay: true });
  return (
    <div className={className} aria-label="Loading animation">
      <RiveComponent className="w-6 h-6" />
    </div>
  );
};

export default LoaderRive;
