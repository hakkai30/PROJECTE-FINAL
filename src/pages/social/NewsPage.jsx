import { useState, useEffect } from "react";
import { getFashionNews } from "../../services/newsService";
import { GlobalHeader, GlobalFooter, SocialSidebar } from "../../components/Layout";

const NewsPage = ({ 
  changePage, 
  cartCount, 
  wishlistCount, 
  theme, 
  onToggleTheme,
  currentUser,
  onLogout,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Forzamos español para las noticias
      const news = await getFashionNews("es");
      setArticles(news);
    } catch (err) {
      setError("No se pudieron cargar las noticias.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="category-page">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        theme={theme}
        onToggleTheme={onToggleTheme}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <div className="social-layout">
        <SocialSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          changePage={changePage} 
        />
        <main className="social-feed" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <div style={{ flex: 1 }}>
          <div className="social-feed-header">
            <h1 className="social-feed-title">NOTICIAS DE MODA</h1>
            <p className="social-feed-subtitle">
              Tendencias y noticias actuales del mundo de la moda.
            </p>
          </div>

          {isLoading ? (
            <div className="saved-looks-empty">
              <h2>CARGANDO NOTICIAS...</h2>
            </div>
          ) : error ? (
            <div className="saved-looks-empty">
              <h2>ERROR</h2>
              <p>{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="saved-looks-empty">
              <h2>No se han encontrado noticias.</h2>
            </div>
          ) : (
            <div className="news-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
              {articles.map((article) => (
                <a 
                  key={article.url} 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="user-product-card"
                  style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
                >
                  <div className="product-image-wrapper" style={{ height: "200px" }}>
                    <img
                      src={article.image || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={article.title}
                      className="product-image"
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <div className="product-info" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>{article.title}</h3>
                    <p className="product-description" style={{ flex: 1 }}>{article.description}</p>
                    <div className="product-meta" style={{ marginTop: "10px", opacity: 0.6 }}>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      <span style={{ float: "right" }}>{article.source.name}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
        </main>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default NewsPage;
