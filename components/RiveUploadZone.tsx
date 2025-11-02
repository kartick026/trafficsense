import React, { useState } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

interface RiveUploadZoneProps {
  isDragging: boolean;
  hasFiles: boolean;
  onFilesSelect: (files: File[]) => void;
  children: React.ReactNode;
}

const RiveUploadZone: React.FC<RiveUploadZoneProps> = ({
  isDragging,
  hasFiles,
  onFilesSelect,
  children,
}) => {
  const { rive, RiveComponent } = useRive({
    src: '/upload-zone.riv', // Upload zone animation
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  const dragInput = useStateMachineInput(rive, 'State Machine 1', 'isDragging');
  const filesInput = useStateMachineInput(rive, 'State Machine 1', 'hasFiles');

  React.useEffect(() => {
    if (dragInput) {
      dragInput.value = isDragging;
    }
  }, [isDragging, dragInput]);

  React.useEffect(() => {
    if (filesInput) {
      filesInput.value = hasFiles;
    }
  }, [hasFiles, filesInput]);

  return (
    <div className="relative">
      {/* Background Rive animation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <RiveComponent className="w-full h-full" />
      </div>
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default RiveUploadZone;

