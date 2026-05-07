export const getFashionNews = async (lang = "es") => {
  const safeLang = ["en", "es", "fr"].includes(lang) ? lang : "en";

  // En producción se usa la función serverless de Vercel para evitar problemas de CORS.
  // En local se llama a GNews directamente para simplificar la depuración.
  const isLocal = window.location.hostname === "localhost";

  let url;
  if (isLocal) {
    const API_KEY = import.meta.env.VITE_GNEWS_API_KEY || "";
    const query = "moda OR fashion";
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${safeLang}&max=12&apikey=${API_KEY}`;
  } else {
    url = `/api/news?lang=${safeLang}`;
  }

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
