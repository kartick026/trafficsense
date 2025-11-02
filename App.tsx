import React, { useState, useCallback } from 'react';
import { TrafficAnalysisResult } from './types';
import { analyzeTrafficImagesAPI } from './services/geminiService';
import FileUploader from './components/FileUploader';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';

const App: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<TrafficAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelect = (files: File[]) => {
    const supportedTypes = ['image/jpeg', 'image/png'];
    const invalidFiles = files.filter(file => !supportedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError(`Invalid file format. Please upload only JPG or PNG images. The following files were invalid: ${invalidFiles.map(f => f.name).join(', ')}`);
      setImageFiles([]);
      setAnalysisResult(null);
      return;
    }
    setError(null);
    setImageFiles(files);
    setAnalysisResult(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (imageFiles.length === 0) {
      setError('Please select one or more images to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const result = await analyzeTrafficImagesAPI(formData);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFiles]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <AnimatedBackground />
      <Header />
      {/* Hero section */}
      <section className="relative border-b border-slate-800/50">
        <div className="container mx-auto px-6 py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
              Traffic Analysis
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              AI-powered traffic insights from street imagery
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          <div id="upload" className="lg:col-span-2">
            <FileUploader onFilesSelect={handleFilesSelect} onAnalyze={handleAnalyzeClick} isLoading={isLoading} />
            {error && (
              <div className="mt-4 text-sm text-red-400 bg-red-950/30 border border-red-800/50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <div id="results" className="lg:col-span-3">
            <ResultsDisplay result={analysisResult} isLoading={isLoading} imageFiles={imageFiles} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;