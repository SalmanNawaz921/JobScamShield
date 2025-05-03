import axios from "axios";

export const getPrediction = async (content) => {
  try {
    const response = await axios.post(
      `/api/predict`,
      {
        content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting job posting result:", error);
    throw new Error("Failed to get prediction");
  }
};
