export default async function handler(req, res) {
  const { lang = "en" } = req.query;
  const API_KEY = process.env.GNEWS_API_KEY || "";
  const query = "moda OR fashion";
  const safeLang = ["en", "es", "fr"].includes(lang) ? lang : "en";
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${safeLang}&max=12&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news", articles: [] });
  }
}
