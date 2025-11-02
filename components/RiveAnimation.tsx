import React from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

interface RiveAnimationProps {
  congestionLevel: 'Light' | 'Medium' | 'Heavy';
  ambulanceDetected: boolean;
}

// NOTE: This component assumes you have a Rive file named `trafficsense.riv`
// in a public/assets folder, with a state machine named 'TrafficState' and inputs:
// - 'Congestion' (Number: 0=Light, 1=Medium, 2=Heavy)
// - 'Ambulance' (Boolean: true/false)

export const RiveAnimation: React.FC<RiveAnimationProps> = ({ congestionLevel, ambulanceDetected }) => {
  const { rive, RiveComponent } = useRive({
    src: '/trafficsense.riv', // This file should be created in your Rive editor
    stateMachines: 'TrafficState',
    autoplay: true,
  });

  const congestionInput = useStateMachineInput(
    rive,
    'TrafficState',
    'Congestion'
  );
  
  const ambulanceInput = useStateMachineInput(
    rive,
    'TrafficState',
    'Ambulance'
  );

  React.useEffect(() => {
    if (rive && congestionInput) {
      switch (congestionLevel) {
        case 'Light':
          congestionInput.value = 0;
          break;
        case 'Medium':
          congestionInput.value = 1;
          break;
        case 'Heavy':
          congestionInput.value = 2;
          break;
        default:
          congestionInput.value = 0;
      }
    }
  }, [congestionLevel, rive, congestionInput]);

  React.useEffect(() => {
    if (rive && ambulanceInput) {
      ambulanceInput.value = ambulanceDetected;
    }
  }, [ambulanceDetected, rive, ambulanceInput]);

  return (
    <div className="relative w-full aspect-video bg-slate-700/50 rounded-lg overflow-hidden border border-slate-700">
      {/* 
        This is a placeholder message. 
        To see the animation, you need to create a `trafficsense.riv` file using the Rive editor
        and place it in the public directory of your project. The Rive component below will then render it.
      */}
      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-center p-4">
        <p>
            Rive animation placeholder. <br/> 
            Create <code className="bg-slate-800 p-1 rounded text-xs text-cyan-300">public/trafficsense.riv</code> to display the live animation.
        </p>
      </div>
      <RiveComponent className="w-full h-full" />
    </div>
  );
};