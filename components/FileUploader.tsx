import React, { useState, useCallback, useMemo } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { AnalyzeIcon } from './icons/AnalyzeIcon';

interface FileUploaderProps {
  onFilesSelect: (files: File[]) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelect, onAnalyze, isLoading }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      onFilesSelect(fileArray);
      
      previews.forEach(URL.revokeObjectURL);

      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      setFileCount(fileArray.length);
    }
  }, [onFilesSelect, previews]);

  const hasFiles = useMemo(() => fileCount > 0, [fileCount]);
  
  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const analyzeButtonText = fileCount > 1 ? 'Analyze Sequence' : 'Analyze Image';

  return (
    <div className="flex flex-col space-y-6">
      <div className="mb-2">
        <h2 className="text-lg font-medium text-white">Upload Images</h2>
        <p className="text-sm text-slate-400 mt-1">Select one or more traffic images</p>
      </div>
      
      <label 
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center w-full h-32 border border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isDragging ? 'border-cyan-400 bg-slate-800/50' : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600'}`}
      >
        <div className="flex flex-col items-center justify-center text-slate-400">
          <UploadIcon className="w-8 h-8 mb-2 opacity-60"/>
          <p className="text-sm">Click to upload or drag and drop</p>
          <p className="text-xs mt-1 text-slate-500">PNG, JPG</p>
        </div>
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          accept="image/png, image/jpeg"
          multiple
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>

      {hasFiles && (
        <div className="mt-4">
          <p className="text-sm text-slate-400 mb-2">{fileCount} image{fileCount > 1 ? 's' : ''} selected</p>
          <div className="flex overflow-x-auto space-x-2 p-2 bg-slate-900/30 rounded border border-slate-800">
            {previews.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt={`Preview ${index + 1}`} 
                className="w-20 h-20 object-cover rounded flex-shrink-0 border border-slate-700" 
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onAnalyze}
        disabled={isLoading || !hasFiles}
        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <AnalyzeIcon className="w-4 h-4 mr-2" />
            {analyzeButtonText}
          </>
        )}
      </button>
    </div>
  );
};

export default FileUploader;