export const getFashionNews = async (lang = "es") => {
  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY || "";
  const query = "moda OR fashion";
  // Convert standard language codes to ones GNews uses if needed, or default to the requested one
  const safeLang = ["en", "es", "fr"].includes(lang) ? lang : "en";
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${safeLang}&max=12&apikey=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error fetching fashion news:", error);
    return [];
  }
};
