// // utils/jobScamDetector.js

import axios from "axios";

// const commonScamIndicators = [
//     {
//       name: "upfront_payment",
//       pattern: /pay.*upfront|registration fee|training fee|processing fee|security deposit/i,
//       description: "Legitimate employers never ask for money upfront"
//     },
//     {
//       name: "generic_email",
//       pattern: /@gmail\.com$|@yahoo\.com$|@hotmail\.com$/i,
//       description: "Professional companies usually have their own domain emails"
//     },
//     {
//       name: "poor_grammar",
//       pattern: /(urgent|immediate|start now|act now|limited time|opportunity of a lifetime)/i,
//       description: "Excessive urgency or poor grammar can indicate scams"
//     },
//     // Add more indicators as needed
//   ];

//   export const analyzeJobPosting = (text) => {
//     if (!text || typeof text !== 'string') {
//       return {
//         isScam: false,
//         warnings: [],
//         score: 0
//       };
//     }

//     const warnings = commonScamIndicators
//       .filter(indicator => indicator.pattern.test(text))
//       .map(indicator => ({
//         type: indicator.name,
//         description: indicator.description,
//         severity: "medium" // could be dynamic based on context
//       }));

//     const score = Math.min(100, warnings.length * 20); // Simple scoring

//     return {
//       isScam: score > 40, // Threshold for considering it a scam
//       warnings,
//       score,
//       summary: warnings.length > 0
//         ? "This job posting shows several potential scam indicators"
//         : "No obvious scam indicators detected"
//     };
//   };

//   export const generateResponseData = (jobText) => {
//     const analysis = analyzeJobPosting(jobText);

//     return [
//       {
//         type: "summary",
//         content: analysis.summary,
//         isCritical: analysis.isScam
//       },
//       {
//         type: "score",
//         content: `Scam likelihood score: ${analysis.score}/100`,
//         isCritical: analysis.score > 40
//       },
//       ...analysis.warnings.map(warning => ({
//         type: "warning",
//         content: warning.description,
//         isCritical: true
//       })),
//       {
//         type: "advice",
//         content: analysis.isScam
//           ? "We strongly recommend avoiding this job posting"
//           : "Always verify the company through official channels",
//         isCritical: analysis.isScam
//       }
//     ];
//   };

export const analyzeJobPosting = (text) => {
  const redFlags = [];

  // Define common scam indicators
  const patterns = [
    {
      description:
        "Mentions of 'quick money', 'get rich fast', or unrealistic pay.",
      regex: /(quick money|get rich|earn \$?\d{4,} (a day|weekly|fast))/i,
    },
    {
      description: "Requires payment to apply or buy training kits.",
      regex: /(pay.*(to apply|for kit|for training|upfront))/i,
    },
    {
      description: "Vague company information or anonymous recruiter.",
      regex: /(no company name|undisclosed|anonymous recruiter)/i,
    },
    {
      description: "Only contact is via Telegram, WhatsApp, or Gmail.",
      regex: /(telegram|whatsapp|@gmail\.com)/i,
    },
    {
      description:
        "Grammar/spelling errors that suggest non-professional language.",
      regex: /(oppertunity|congradulations|urgant requirement|respected sir)/i,
    },
    {
      description: "Excessive urgency like 'Apply Immediately', 'Hurry now!'.",
      regex: /(apply now|hurry|urgent opening|immediate joining)/i,
    },
  ];

  // Check all patterns
  patterns.forEach((pattern) => {
    if (pattern.regex.test(text)) {
      redFlags.push({ description: pattern.description });
    }
  });

  const score = Math.min(100, redFlags.length * 15); // 15 points per red flag
  const isScam = score >= 45;

  // Generate summary
  const summary = isScam
    ? `⚠️ This job post triggered ${redFlags.length} warning signs and scored ${score}/100 on the scam scale.`
    : `✔️ This job post appears safe with only ${
        redFlags.length
      } minor warning${
        redFlags.length !== 1 ? "s" : ""
      }. Scam score: ${score}/100.`;

  return {
    score,
    isScam,
    warnings: redFlags,
    summary,
  };
};

// export const generateResponseData = (jobText) => {
//   const analysis = analyzeJobPosting(jobText);

//   // Attempt to extract recruiter/company info (very basic regex for demonstration)
//   const recruiterMatch = jobText.match(/(?:contact|reach|apply)\s+(?:to|at)?\s*(\w+\s?\w*)/i);
//   const recruiterName = recruiterMatch ? recruiterMatch[1] : "Not specified";

//   const positionMatch = jobText.match(/(position|role|opening)\s*:\s*(.+)/i);
//   const jobTitle = positionMatch ? positionMatch[2].split("\n")[0].trim() : "Not specified";

//   const locationMatch = jobText.match(/location\s*:\s*(.+)/i);
//   const location = locationMatch ? locationMatch[1].split("\n")[0].trim() : "Not specified";

//   const companyMatch = jobText.match(/company\s*:\s*(.+)/i);
//   const companyName = companyMatch ? companyMatch[1].split("\n")[0].trim() : "Not specified";

//   return [
//     {
//       type: "header",
//       content: "📄 Job Posting Analysis Report",
//       isCritical: false,
//     },
//     {
//       type: "section",
//       content: `**Recruiter/Contact Name**: ${recruiterName}`,
//       isCritical: false,
//     },
//     {
//       type: "section",
//       content: `**Company Name**: ${companyName}`,
//       isCritical: false,
//     },
//     {
//       type: "section",
//       content: `**Job Title**: ${jobTitle}`,
//       isCritical: false,
//     },
//     {
//       type: "section",
//       content: `**Location**: ${location}`,
//       isCritical: false,
//     },
//     {
//       type: "section",
//       content: `**Scam Likelihood Score**: ${analysis.score}/100`,
//       isCritical: analysis.score > 40,
//     },
//     {
//       type: "summary",
//       content: analysis.summary,
//       isCritical: analysis.isScam,
//     },
//     {
//       type: "section",
//       content: `**Detected Scam Indicators**:\n${analysis.warnings
//         .map((w, i) => `• ${w.description}`)
//         .join("\n") || "None detected"}`,
//       isCritical: analysis.warnings.length > 0,
//     },
//     {
//       type: "section",
//       content: `**Final Determination**: [🔲 Fake / ✅ Real] (to be filled by modal)`,
//       isCritical: false,
//     },
//     {
//       type: "advice",
//       content: analysis.isScam
//         ? "⚠️ This posting raises multiple red flags. We recommend avoiding it."
//         : "✔️ This posting appears clean, but always verify the source.",
//       isCritical: analysis.isScam,
//     },
//     {
//       type: "footer",
//       content: "Generated by AI Job Scam Analyzer",
//       isCritical: false,
//     },
//   ];
// };

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const generateChatGPTContent = async (jobText) => {
  // Set up the prompt for generating the content dynamically using the OpenAI API
  const prompt = `
    Analyze the following job posting for potential scams and generate a detailed report in JSON format with all the following fields:
    
    Job Posting: 
    ${jobText}
    
    Required JSON Response Format:
    {
      "recruiterName": "Extracted recruiter/contact name or 'Not specified'",
      "companyName": "Extracted company name or 'Not specified'",
      "jobTitle": "Extracted job title or 'Not specified'",
      "location": "Extracted location or 'Not specified'",
      "scamScore": "Score from 0-100",
      "scamIndicators": ["array", "of", "detected", "indicators"],
      "isScam": "boolean",
      "summary": "Detailed summary analysis",
      "advice": "Specific advice about this posting"
    }

    Important: Only return valid JSON that can be parsed directly with JSON.parse()
  `;

  // Get response from ChatGPT
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a job scam analyzer that returns only JSON.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    // Safely extract content
    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in response");
    }


    // Clean the content string before parsing
    const cleanedContent = content
      .replace(/^```json/g, "") // Remove potential JSON markers
      .replace(/```$/g, "") // Remove potential JSON markers
      .trim();


    // Parse the JSON
    const parsed = JSON.parse(cleanedContent);
    return parsed;
  } catch (error) {
    console.error("Error in generateChatGPTContent:", error);
    return {
      recruiterName: "Error",
      companyName: "Error",
      jobTitle: "Error",
      location: "Error",
      scamScore: 0,
      scamIndicators: [],
      isScam: false,
      summary: "Analysis failed - " + error.message,
      advice: "Unable to analyze this posting due to an error",
    };
  }
};

export const generateResponseData = async (jobText) => {
  // Get complete analysis from ChatGPT
  const analysis = await generateChatGPTContent(jobText);

  return [
    // {
    //   type: "header",
    //   content: `Job Posting Analysis Report`,
    //   isCritical: false,
    // },
    {
      type: "section",
      content: `**Recruiter/Contact Name**: ${analysis.recruiterName}`,
      isCritical: false,
    },
    {
      type: "section",
      content: `**Company Name**: ${analysis.companyName}`,
      isCritical: false,
    },
    {
      type: "section",
      content: `**Job Title**: ${analysis.jobTitle}`,
      isCritical: false,
    },
    {
      type: "section",
      content: `**Location**: ${analysis.location}`,
      isCritical: false,
    },
    {
      type: "section",
      content: `**Scam Likelihood Score**: ${analysis.scamScore}/100`,
      isCritical: analysis.scamScore > 40,
    },
    {
      type: "summary",
      content: analysis.summary,
      isCritical: analysis.isScam,
    },
    {
      type: "section",
      content: `**Detected Scam Indicators**:\n${
        analysis.scamIndicators.map((w, i) => `• ${w}`).join("\n") ||
        "None detected"
      }`,
      isCritical: analysis.scamIndicators.length > 0,
    },
    {
      type: "section",
      content: `**Final Determination**: ${
        analysis.isScam ? "🔲 Fake" : "✅ Real"
      }`,
      isCritical: analysis.isScam,
    },
    {
      type: "advice",
      content: analysis.advice,
      isCritical: analysis.isScam,
    },
    // {
    //   type: "footer",
    //   content: "Generated by AI Job Scam Analyzer",
    //   isCritical: false,
    // },
  ];
};
