export default async function handler(req, res) {
  const { city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "API key is not configured in Vercel settings" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
