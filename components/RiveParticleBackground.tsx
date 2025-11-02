import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const RiveParticleBackground: React.FC = () => {
  const { RiveComponent } = useRive({
    src: '/particles.riv', // Use a particle animation from Rive
    autoplay: true,
  });

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30">
      <RiveComponent className="w-full h-full" />
    </div>
  );
};

export default RiveParticleBackground;

