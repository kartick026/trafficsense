import React, { useEffect, useState } from 'react';
import { useRive } from '@rive-app/react-canvas';

interface AnimatedMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
  animate?: boolean;
}

const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({
  title,
  value,
  icon,
  colorClass = 'text-white',
  animate = true,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const { RiveComponent } = useRive({
    src: '/sparkle.riv', // Sparkle animation
    autoplay: animate && isVisible,
  });

  useEffect(() => {
    setIsVisible(true);
    if (typeof value === 'number') {
      const duration = 1000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [value]);

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4 border border-slate-700/50 relative overflow-hidden group hover:bg-slate-800/70 transition-all duration-300">
      {/* Subtle sparkle animation overlay */}
      {animate && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8">
            <RiveComponent className="w-full h-full" />
          </div>
        </div>
      )}
      
      <div className="p-3 bg-slate-700/50 rounded-full group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className={`text-xl font-bold flex items-center ${colorClass}`}>
          {typeof value === 'number' ? displayValue.toFixed(1) : value}
        </p>
      </div>
    </div>
  );
};

export default AnimatedMetricCard;

