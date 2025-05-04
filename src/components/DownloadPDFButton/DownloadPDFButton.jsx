// components/DownloadPDFButton.jsx

import { useState } from "react";

const DownloadPDFButton = ({ jobText, analysisData }) => {
    const [isGenerating, setIsGenerating] = useState(false);
  
    const handleDownload = async () => {
      setIsGenerating(true);
      try {
        const pdfData = await generateJobAnalysisPDF(jobText, analysisData);
        // In a real implementation, this would trigger download
        alert("PDF download would start here");
      } catch (error) {
        console.error("PDF generation failed:", error);
      } finally {
        setIsGenerating(false);
      }
    };
  
    return (
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Download Report'}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    );
  };
  
  export default DownloadPDFButton;