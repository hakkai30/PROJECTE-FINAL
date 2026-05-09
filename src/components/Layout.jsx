// Re-exportaciones para mantener compatibilidad con los imports existentes en las páginas.
// Cada componente vive ahora en su propio archivo.
export { default as GlobalHeader } from "./Header";
export { default as GlobalFooter } from "./Footer";
export { default as SocialSidebar } from "./SocialSidebar";
export { default as ChatbotWidget } from "./Chatbot";

// Componentes menores que se usan en la landing.
import { useState } from "react";

export const WindowOverlay = ({ label, offsetClass, article }) => {
  const [isVisible, setIsVisible] = useState(true);
  const closeWindow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`window-frame ${offsetClass}`}
      style={{ pointerEvents: "auto" }}
      aria-hidden={article ? undefined : true}
    >
      <div className="window-header">
        <span className="window-label">{article ? "NOTICIAS" : `LOOK ${label}`}</span>
        <div className="window-actions">
          <button type="button" className="window-action window-action-close" onClick={closeWindow} aria-label="Cerrar ventana">
            ×
          </button>
        </div>
      </div>
      {article ? (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="window-body" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", cursor: "pointer" }}>
          <div className="window-url">{article.source.name.substring(0, 20)}</div>
          {article.image && (
            <div className="window-preview" style={{ padding: 0, gap: 0, overflow: "hidden" }}>
              <img 
                src={article.image} 
                alt={article.title || "Noticia"} 
                loading="lazy" 
                style={{ width: "100%", height: "80px", objectFit: "cover" }} 
                onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
              />
            </div>
          )}
          <div style={{ padding: "4px", fontSize: "0.55rem", fontWeight: "bold", color: "#333" }}>
            {article.title.length > 50 ? article.title.substring(0, 50) + "..." : article.title}
          </div>
          <div className="window-status">
            <span className="window-status-dot" />
            BREAKING
          </div>
        </a>
      ) : (
        <div className="window-body">
          <div className="window-url">robthefab.local/look/{label.toLowerCase()}</div>
          <div className="window-preview">
            <div className="window-preview-hero" />
            <div className="window-preview-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="window-status">
            <span className="window-status-dot" />
            LIVE
          </div>
        </div>
      )}
    </div>
  );
};

// Selector de idioma eliminado. Todo es español ahora.