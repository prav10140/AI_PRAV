// File: /api/wolfram.js

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const APP_ID = "LHRUQL-3QP3LLWTV2"; // Replace with your WolframAlpha App ID
  const encodedInput = encodeURIComponent(query);
  const url = `https://api.wolframalpha.com/v2/query?appid=${APP_ID}&input=${encodedInput}&output=JSON`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from WolframAlpha", details: error.message });
  }
}
