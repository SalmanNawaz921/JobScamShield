import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { content } = req.body;
    const modelResponse = await axios.post(
      `${process.env.MODAL_API_URL}/predict`,
      {
        text: content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).json(modelResponse.data);  // Send the API response back to the client
  } catch (error) {
    console.error("Error getting job posting result:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
