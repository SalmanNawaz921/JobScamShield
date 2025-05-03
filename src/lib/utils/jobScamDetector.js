// utils/jobScamDetector.js

const commonScamIndicators = [
    { 
      name: "upfront_payment",
      pattern: /pay.*upfront|registration fee|training fee|processing fee|security deposit/i,
      description: "Legitimate employers never ask for money upfront"
    },
    {
      name: "generic_email",
      pattern: /@gmail\.com$|@yahoo\.com$|@hotmail\.com$/i,
      description: "Professional companies usually have their own domain emails"
    },
    {
      name: "poor_grammar",
      pattern: /(urgent|immediate|start now|act now|limited time|opportunity of a lifetime)/i,
      description: "Excessive urgency or poor grammar can indicate scams"
    },
    // Add more indicators as needed
  ];
  
  export const analyzeJobPosting = (text) => {
    if (!text || typeof text !== 'string') {
      return {
        isScam: false,
        warnings: [],
        score: 0
      };
    }
  
    const warnings = commonScamIndicators
      .filter(indicator => indicator.pattern.test(text))
      .map(indicator => ({
        type: indicator.name,
        description: indicator.description,
        severity: "medium" // could be dynamic based on context
      }));
  
    const score = Math.min(100, warnings.length * 20); // Simple scoring
  
    return {
      isScam: score > 40, // Threshold for considering it a scam
      warnings,
      score,
      summary: warnings.length > 0 
        ? "This job posting shows several potential scam indicators"
        : "No obvious scam indicators detected"
    };
  };
  
  export const generateResponseData = (jobText) => {
    const analysis = analyzeJobPosting(jobText);
    
    return [
      {
        type: "summary",
        content: analysis.summary,
        isCritical: analysis.isScam
      },
      {
        type: "score",
        content: `Scam likelihood score: ${analysis.score}/100`,
        isCritical: analysis.score > 40
      },
      ...analysis.warnings.map(warning => ({
        type: "warning",
        content: warning.description,
        isCritical: true
      })),
      {
        type: "advice",
        content: analysis.isScam 
          ? "We strongly recommend avoiding this job posting" 
          : "Always verify the company through official channels",
        isCritical: analysis.isScam
      }
    ];
  };