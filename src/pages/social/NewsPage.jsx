import { useState, useEffect } from "react";
import { getFashionNews } from "../../services/newsService";
import { GlobalHeader, GlobalFooter, SocialSidebar } from "../../components/Layout";

const NewsPage = ({ 
  changePage, 
  language = "ca", 
  t, 
  cartCount, 
  wishlistCount, 
  theme, 
  onToggleTheme,
  currentUser,
  onLogout,
  onMarkNotificationRead,
  setLanguage,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNews();
  }, [language]);

  const loadNews = async () => {
    setIsLoading(true);
    setError("");
    try {
      const news = await getFashionNews(language);
      setArticles(news);
    } catch (err) {
      setError(t("news.error", "No se pudieron cargar las noticias."));
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
        language={language}
        setLanguage={setLanguage}
        t={t}
        currentUser={currentUser}
        onLogout={onLogout}
        notifications={notifications}
        unreadNotificationsCount={unreadNotificationsCount}
        onMarkNotificationRead={onMarkNotificationRead}
      />
      <div className="social-layout">
        <SocialSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          changePage={changePage} 
          t={t} 
        />
        <main className="social-feed" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <div style={{ flex: 1 }}>
          <div className="social-feed-header">
            <h1 className="social-feed-title">{t("news.title", "FASHION NEWS")}</h1>
            <p className="social-feed-subtitle">
              {t("news.subtitle", "Tendencias y noticias actuales del mundo de la moda.")}
            </p>
          </div>

          {isLoading ? (
            <div className="saved-looks-empty">
              <h2>{t("news.loading", "LOADING NEWS...")}</h2>
            </div>
          ) : error ? (
            <div className="saved-looks-empty">
              <h2>ERROR</h2>
              <p>{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="saved-looks-empty">
              <h2>{t("news.noResults", "No news found.")}</h2>
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
      <GlobalFooter t={t} />
    </div>
  );
};

export default NewsPage;
