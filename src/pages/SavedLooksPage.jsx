import { Bookmark, Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { localizePost } from "../data/i18n";

const SavedLooksPage = ({
  changePage,
  currentUser,
  onLogout,
  savedLooks = [],
  savedLookIds = [],
  onToggleSavedLook,
  language = "ca",
  t,
}) => {
  const [likedPostIds, setLikedPostIds] = useState([]);
  const savedLooksCount = savedLookIds.length;
  const totalLikes = savedLooks.reduce((acc, post) => acc + post.likes, 0);

  const handleLike = (postId) => {
    setLikedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="social-layout">
      <div className="social-sidebar">
        <button type="button" className="sidebar-link" onClick={() => changePage("landing")}>
          {t("social.sidebar.home", "HOME")}
        </button>
        <button type="button" className="sidebar-link" onClick={() => changePage("shop")}>
          {t("social.sidebar.shop", "SHOP")}
        </button>
        <div className="sidebar-divider" aria-hidden="true"></div>
        <button type="button" className="sidebar-link" onClick={() => changePage("socials")}>
          {t("social.sidebar.brand", "ROB_THE_FAB")}
        </button>
        <button type="button" className="sidebar-link" onClick={() => changePage("messages")}>
          {t("social.sidebar.messages", "MESSAGES")}
        </button>
        <button type="button" className="sidebar-link sidebar-link-active" onClick={() => changePage("saved-looks")}>
          {t("social.sidebar.savedLooks", "SAVED LOOKS")}
        </button>
        <p className="sidebar-user-chip">@{currentUser?.name || "USER"}</p>
        <button type="button" className="sidebar-link sidebar-logout" onClick={onLogout}>
          {t("social.sidebar.logout", "LOG OUT")}
        </button>
        <button
          type="button"
          className="sidebar-link sidebar-settings-link"
          onClick={() => changePage("settings")}
        >
          {t("social.sidebar.settings", "SETTINGS")}
        </button>
      </div>

      <div className="social-feed">
        <div className="social-feed-header">
          <div className="social-feed-title-row">
            <h1 className="social-feed-title">{t("social.savedLooks.title", "SAVED LOOKS")}</h1>
            <button
              type="button"
              className="social-feed-count-chip"
              onClick={() => changePage("socials")}
            >
              {t("social.feed.title", "SOCIAL FEED")}
            </button>
          </div>
          <p className="social-feed-subtitle">
            {t(
              "social.savedLooks.subtitle",
              "Your collected looks from the social community."
            )}
          </p>
          <div className="social-feed-toolbar">
            <span className="social-feed-stat">
              {t("social.feed.statsSaved", "SAVED")}: {savedLooksCount}
            </span>
            <span className="social-feed-stat">LIKES: {totalLikes}</span>
          </div>
        </div>

        {savedLooks.length === 0 && (
          <div className="saved-looks-empty">
            <h2>{t("social.savedLooks.emptyTitle", "NO SAVED LOOKS YET")}</h2>
            <p>
              {t(
                "social.savedLooks.emptyDescription",
                "Save looks from Social Feed and they will appear here."
              )}
            </p>
            <button type="button" className="shop-look-btn" onClick={() => changePage("socials")}>
              {t("social.savedLooks.backToFeed", "GO TO SOCIAL FEED")}
            </button>
          </div>
        )}

        {savedLooks.map((post) => {
          const localizedPost = localizePost(post, language);
          const isSaved = savedLookIds.includes(post.id);

          return (
            <div key={post.id} className="social-post">
              <div className="post-header">
                <div className="user-avatar"></div>
                <span className="post-user-handle">@{post.user}</span>
              </div>
              <img
                src={localizedPost.img}
                alt={`${t("social.postAlt", "Post by")} ${post.user}`}
                className="post-img"
              />
              <div className="post-actions">
                <button
                  type="button"
                  className={`icon-action-btn ${likedPostIds.includes(post.id) ? "active" : ""}`}
                  aria-label={t("social.actions.like", "LIKE POST")}
                  aria-pressed={likedPostIds.includes(post.id)}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart
                    size={16}
                    fill={likedPostIds.includes(post.id) ? "currentColor" : "none"}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  {post.likes}
                </button>
                <button type="button" className="icon-action-btn" aria-label={t("social.actions.comment", "COMMENT")}>
                  <MessageCircle size={16} aria-hidden="true" />
                  {t("social.actions.comment", "COMMENT")}
                </button>
                <button type="button" className="shop-look-btn" aria-label={t("social.actions.shopLook", "SHOP THIS LOOK")}>
                  <ShoppingCart size={16} aria-hidden="true" />
                  {t("social.actions.shopLook", "SHOP THIS LOOK")}
                </button>
                <button
                  type="button"
                  className={`save-look-btn ${isSaved ? "active" : ""}`}
                  aria-label={t("social.actions.unsaveLook", "REMOVE FROM SAVED LOOKS")}
                  aria-pressed={isSaved}
                  onClick={() => onToggleSavedLook?.(post.id)}
                >
                  <Bookmark size={16} fill="currentColor" aria-hidden="true" />
                  {t("social.actions.saved", "SAVED")}
                </button>
              </div>
              <div className="social-post-caption">
                <strong>{post.user}</strong> {localizedPost.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedLooksPage;
