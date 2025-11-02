import React, { useState, useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

interface TrafficAnimationProps {
  className?: string;
  src?: string;
  stateMachines?: string | string[];
  autoplay?: boolean;
}

const TrafficAnimation: React.FC<TrafficAnimationProps> = ({
  className,
  src = '/trafficsense.riv',
  stateMachines = 'TrafficState',
  autoplay = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { rive, RiveComponent } = useRive({ 
    src, 
    stateMachines, 
    autoplay,
  });

  const hoverInput = useStateMachineInput(rive, 'TrafficState', 'isHovered');

  useEffect(() => {
    if (hoverInput) {
      hoverInput.value = isHovered;
    }
  }, [isHovered, hoverInput]);

  return (
    <div 
      className={`relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-br from-slate-800/70 to-slate-900/70 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/30 ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 transition-opacity duration-500"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.15), transparent 25%), radial-gradient(circle at 80% 30%, rgba(168,85,247,0.12), transparent 25%), radial-gradient(circle at 40% 80%, rgba(34,197,94,0.12), transparent 25%)',
        }}
      />
      
      {/* Rive animation */}
      <div className="absolute inset-0 w-full h-full">
        <RiveComponent className="w-full h-full" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 p-4 text-center text-slate-300 text-sm bg-gradient-to-t from-slate-900/70 to-transparent transition-all duration-300 group-hover:text-cyan-300">
        <span className="inline-flex items-center">
          Live traffic visualization
          <span className="ml-2 animate-pulse">●</span>
        </span>
      </div>
    </div>
  );
};

export default TrafficAnimation;
