import React, { useState } from 'react';
import { useRive } from '@rive-app/react-canvas';

interface RiveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  riveSrc?: string;
  stateMachine?: string;
  hoverState?: string;
  idleState?: string;
}

const RiveButton: React.FC<RiveButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children,
  riveSrc = '/button.riv', // You can use Rive's sample button animation
  stateMachine = 'State Machine 1',
  hoverState = 'Hover',
  idleState = 'Idle',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { RiveComponent } = useRive({
    src: riveSrc,
    stateMachines: stateMachine,
    autoplay: true,
    onStateChange: (event) => {
      // Handle state changes if needed
    },
  });

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden group ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <RiveComponent className="w-full h-full" />
      </div>
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </button>
  );
};

export default RiveButton;

