import React from 'react';
import { useRive } from '@rive-app/react-canvas';

interface RiveSuccessAnimationProps {
  className?: string;
  onComplete?: () => void;
}

const RiveSuccessAnimation: React.FC<RiveSuccessAnimationProps> = ({
  className = 'w-16 h-16',
  onComplete,
}) => {
  const { rive, RiveComponent } = useRive({
    src: '/success.riv', // Success checkmark animation
    autoplay: true,
    onStateChange: (event) => {
      if (onComplete && event.data.name === 'Complete') {
        onComplete();
      }
    },
  });

  return (
    <div className={className}>
      <RiveComponent className="w-full h-full" />
    </div>
  );
};

export default RiveSuccessAnimation;

