import React from 'react';
import { useRive } from '@rive-app/react-canvas';

interface RiveIconProps {
  src?: string;
  className?: string;
  autoplay?: boolean;
  stateMachines?: string | string[];
}

const RiveIcon: React.FC<RiveIconProps> = ({
  src = '/icon.riv',
  className = 'w-8 h-8',
  autoplay = true,
  stateMachines,
}) => {
  const { RiveComponent } = useRive({
    src,
    stateMachines,
    autoplay,
  });

  return (
    <div className={className}>
      <RiveComponent className="w-full h-full" />
    </div>
  );
};

export default RiveIcon;

