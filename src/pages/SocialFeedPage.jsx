import { useState } from "react";
import { MOCK_POSTS } from "../data/mockData";
import { localizePost } from "../data/i18n";

const POST_COPY = {
  ca: { 1: "Passejos per la ciutat amb la nova colleccio SS24. Ja disponible.", 2: "Els detalls importen. Capes per al fred." },
  es: { 1: "Paseos por la ciudad con la nueva colección SS24. Ya disponible.", 2: "Los detalles importan. Capas para el frío." },
  en: { 1: "City walks with the new SS24 collection. Available now.", 2: "Details matter. Layers for the cold." },
  fr: { 1: "Balades en ville avec la nouvelle collection SS24. Disponible dès maintenant.", 2: "Les détails comptent. Des couches pour le froid." },
};

const SocialFeedPage = ({ changePage, currentUser, onLogout, language = "ca", t }) => {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleLike = (id) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  return (
    <div className="social-layout">
      <div className="social-sidebar">
        <button className="sidebar-link" onClick={() => changePage("landing")}>
          {t("social.sidebar.home", "HOME")}
        </button>
        <button className="sidebar-link" onClick={() => changePage("shop")}>
          {t("social.sidebar.shop", "SHOP")}
        </button>
        <div style={{ borderBottom: "2px solid black", margin: "1rem 0" }}></div>
        <button className="sidebar-link">{t("social.sidebar.brand", "ROB_THE_FAB")}</button>
        <button className="sidebar-link" onClick={() => changePage("messages")}>
          {t("social.sidebar.messages", "MESSAGES")}
        </button>
        <button className="sidebar-link">{t("social.sidebar.discover", "DISCOVER")}</button>
        <button className="sidebar-link">{t("social.sidebar.savedLooks", "SAVED LOOKS")}</button>
        <p className="sidebar-user-chip">@{currentUser?.name || "USER"}</p>
        <button className="sidebar-link sidebar-logout" onClick={onLogout}>
          {t("social.sidebar.logout", "LOG OUT")}
        </button>
        <button
          className="sidebar-link"
          style={{ marginTop: "auto", color: "gray" }}
          onClick={() => changePage("settings")}
        >
          {t("social.sidebar.settings", "SETTINGS")}
        </button>
      </div>

      <div className="social-feed">
        {posts.map((post) => {
          const localizedPost = localizePost(post, language);
          return (
          <div key={post.id} className="social-post">
            <div className="post-header">
              <div className="user-avatar"></div>
              <span>@{post.user}</span>
            </div>
            <img
              src={localizedPost.img}
              alt={`${t("social.postAlt", "Post by")} ${post.user}`}
              className="post-img"
            />
            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
              <button>💬 {t("social.actions.comment", "COMMENT")}</button>
              <button className="shop-look-btn">🛒 {t("social.actions.shopLook", "SHOP THIS LOOK")}</button>
            </div>
            <div style={{ padding: "0 1.5rem 1.5rem 1.5rem", fontSize: "1.1rem" }}>
              <strong>{post.user}</strong> {localizedPost.desc}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialFeedPage;
