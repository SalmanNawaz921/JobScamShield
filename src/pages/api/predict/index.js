// import SecurityValidator from "@/lib/utils/SecurityValidator";
// import axios from "axios";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }
//   try {
//     const { content } = req.body;
//     if (!content) {
//       return res.status(400).json({ message: "Content is required" });
//     }
//     const validatedContent = SecurityValidator.sanitizeString(content, {
//       maxLength: 2000,
//     });
//     const modelResponse = await axios.post(
//       `${process.env.MODAL_API_URL}/predict`,
//       {
//         text: validatedContent,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-Key": process.env.MODAL_API_KEY,
//         },
//       }
//     );
//     return res.status(200).json(modelResponse.data); // Send the API response back to the client
//   } catch (error) {
//     console.error("Error getting job posting result:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

import { authMiddleware } from "@/lib/auth/middleware/authMiddleware";
import SecurityValidator from "@/lib/utils/SecurityValidator";
import axios from "axios";

export default authMiddleware(async (req, res) => {
  // Apply rate limiting middleware

  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      error: "method_not_allowed",
      message: "Only POST requests are accepted",
    });
  }

  try {
    const { content } = req.body;

    // Validate content exists and is a string
    if (!content || typeof content !== "string") {
      throw {
        status: 400,
        error: "invalid_content",
        message: "Content must be a non-empty string",
      };
    }

    // Sanitize and validate content
    const validatedContent = SecurityValidator.sanitizeString(content, {
      maxLength: 2000,
    });

    if (validatedContent.length < 3) {
      throw {
        status: 400,
        error: "invalid_content_length",
        message: "Content must be at least 3 characters long",
      };
    }

    // Call the prediction API - let any errors propagate
    const modelResponse = await axios.post(
      `${process.env.MODAL_API_URL}/predict`,
      { text: validatedContent },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.MODAL_API_KEY,
        },
        // Don't throw for 4xx/5xx errors - we'll handle them
        validateStatus: () => true,
      }
    );

    // Forward the exact response from the prediction API
    return res.status(modelResponse.status).json(modelResponse.data);
  } catch (error) {
    console.error("API Error:", error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Forward API error response exactly as received
        return res.status(error.response.status).json(error.response.data);
      }

      // Network errors or timeouts
      return res.status(503).json({
        error: "service_unavailable",
        message: "Prediction service is not responding",
        details: error.message,
      });
    }

    // Handle our thrown validation errors
    if (error.status && error.error) {
      return res.status(error.status).json({
        error: error.error,
        message: error.message,
      });
    }

    // Unexpected errors
    return res.status(500).json({
      error: "internal_server_error",
      message: "An unexpected error occurred",
      details: error.message,
    });
  }
});
