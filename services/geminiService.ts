import { TrafficAnalysisResult } from '../types';

// Get API URL from environment variable or use default
const getApiUrl = () => {
  // In Amplify, use environment variable or fallback to relative path
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  }
  // Default to relative path for local development
  return '/api';
};

// This function now sends the image files to our backend API
// instead of calling the Gemini API directly from the client.
export const analyzeTrafficImagesAPI = async (formData: FormData): Promise<TrafficAnalysisResult> => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // Try to parse a specific error message from the backend
      const errorData = await response.json().catch(() => null);
      if (errorData && errorData.detail) {
        throw new Error(errorData.detail);
      }
      // Generic error if no specific message is available
      throw new Error(`Network error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("API call to backend failed:", error);
    if (error instanceof Error) {
        throw error; // Re-throw the error with the specific message
    }
    // Fallback for unexpected errors
    throw new Error("Failed to connect to the analysis service. Please check your connection and try again.");
  }
};
