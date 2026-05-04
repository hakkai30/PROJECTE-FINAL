import { Bookmark, Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { localizePost } from "../../data/i18n";

const SavedLooksPage = ({
  changePage,
  currentUser,
  onLogout,
  savedLooks = [],
  likedPostIds = [],
  onToggleLikePost,
  onAddComment,
  onDeleteComment,
  onMessageAuthor,
  onOpenProfile,
  feedError = "",
  savedLookIds = [],
  onToggleSavedLook,
  language = "ca",
  t,
}) => {
  const [openCommentPostIds, setOpenCommentPostIds] = useState([]);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [submittingCommentIds, setSubmittingCommentIds] = useState([]);
  const savedLooksCount = savedLookIds.length;
  const totalLikes = savedLooks.reduce((acc, post) => acc + post.likes, 0);

  const formatRelativeTime = (isoDate) => {
    const timestamp = Date.parse(isoDate || "");
    if (Number.isNaN(timestamp)) return "";

    const diffMs = Date.now() - timestamp;
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

    if (diffMinutes < 1) return t("social.comments.now", "just now");
    if (diffMinutes < 60) return `${diffMinutes}m`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) return `${diffWeeks}w`;

    return new Date(timestamp).toLocaleDateString();
  };

  const canDeleteComment = (comment) => {
    const currentName = String(currentUser?.name || "").trim().toLowerCase();
    const commentUser = String(comment?.user || "").trim().toLowerCase();
    return Boolean(currentName) && currentName === commentUser;
  };

  const toggleCommentsPanel = (postId) => {
    const normalizedId = String(postId);
    setOpenCommentPostIds((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((id) => id !== normalizedId)
        : [...prev, normalizedId]
    );
  };

  const updateCommentDraft = (postId, value) => {
    const normalizedId = String(postId);
    setCommentDrafts((prev) => ({
      ...prev,
      [normalizedId]: value,
    }));
  };

  const handleSubmitComment = async (event, postId) => {
    event.preventDefault();
    const normalizedId = String(postId);
    const draft = String(commentDrafts[normalizedId] || "").trim();
    if (!draft) return;
    if (submittingCommentIds.includes(normalizedId)) return;

    setSubmittingCommentIds((prev) => [...prev, normalizedId]);

    try {
      await onAddComment?.(postId, draft);
      setCommentDrafts((prev) => ({
        ...prev,
        [normalizedId]: "",
      }));
    } catch {
      // Error is handled in shared parent state.
    } finally {
      setSubmittingCommentIds((prev) => prev.filter((id) => id !== normalizedId));
    }
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
        <button
          type="button"
          className="sidebar-user-chip sidebar-user-chip-btn"
          onClick={() => onOpenProfile?.({
            user: currentUser?.name,
            name: currentUser?.name ? `@${currentUser.name}` : "@USER",
            bio: currentUser?.bio || "",
            avatar: currentUser?.avatar || "",
            email: currentUser?.email || "",
          })}
        >
          @{currentUser?.name || "USER"}
        </button>
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

        {feedError && (
          <div className="saved-looks-empty">
            <h2>{t("social.feed.errorTitle", "FEED ERROR")}</h2>
            <p>{feedError}</p>
          </div>
        )}

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
          const isSaved = savedLookIds.includes(String(post.id));
          const isLiked = likedPostIds.includes(String(post.id));
          const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
          const normalizedPostId = String(post.id);
          const isCommentsOpen = openCommentPostIds.includes(normalizedPostId);
          const commentDraft = commentDrafts[normalizedPostId] || "";
          const isSubmittingComment = submittingCommentIds.includes(normalizedPostId);

          return (
            <div key={post.id} className="social-post">
              <div className="post-header">
                <div className="user-avatar"></div>
                <button
                  type="button"
                  className="post-user-handle post-user-handle-btn"
                  onClick={() => onOpenProfile?.(post)}
                  aria-label={t("social.actions.viewProfile", "VIEW PROFILE")}
                >
                  @{post.user}
                </button>
              </div>
              <img
                src={localizedPost.img}
                alt={`${t("social.postAlt", "Post by")} ${post.user}`}
                className="post-img"
              />
              <div className="post-actions">
                <button
                  type="button"
                  className={`icon-action-btn ${isLiked ? "active" : ""}`}
                  aria-label={t("social.actions.like", "LIKE POST")}
                  aria-pressed={isLiked}
                  onClick={() => onToggleLikePost?.(post.id)}
                >
                  <Heart
                    size={16}
                    fill={isLiked ? "currentColor" : "none"}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  {post.likes}
                </button>
                <button
                  type="button"
                  className="icon-action-btn"
                  aria-label={t("social.actions.comment", "COMMENT")}
                  aria-expanded={isCommentsOpen}
                  onClick={() => toggleCommentsPanel(post.id)}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  {t("social.actions.comment", "COMMENT")} ({commentsCount})
                </button>
                <button
                  type="button"
                  className="icon-action-btn"
                  aria-label={t("social.actions.messageAuthor", "MESSAGE AUTHOR")}
                  onClick={() => onMessageAuthor?.(post)}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  {t("social.actions.messageAuthor", "MESSAGE")}
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

              {isCommentsOpen && (
                <div className="social-comments-panel">
                  <div className="social-comments-list" aria-live="polite">
                    {commentsCount === 0 && (
                      <p className="social-comments-empty">
                        {t("social.comments.empty", "No comments yet. Be the first one.")}
                      </p>
                    )}

                    {Array.isArray(post.comments) && post.comments.map((comment) => (
                      <div
                        key={comment.id || `${normalizedPostId}-${comment.user}-${comment.text}`}
                        className="social-comment-item"
                      >
                        <div className="social-comment-meta">
                          <button
                            type="button"
                            className="social-comment-user social-comment-user-btn"
                            onClick={() => onOpenProfile?.({ user: comment.user })}
                            aria-label={t("social.actions.viewProfile", "VIEW PROFILE")}
                          >
                            @{comment.user || "USER"}
                          </button>
                          <span className="social-comment-time">{formatRelativeTime(comment.createdAt)}</span>
                        </div>
                        <p className="social-comment-text">{comment.text}</p>

                        {canDeleteComment(comment) && (
                          <button
                            type="button"
                            className="social-comment-delete"
                            onClick={async () => {
                              try {
                                await onDeleteComment?.(post.id, comment.id);
                              } catch {
                                // Error is handled in shared parent state.
                              }
                            }}
                          >
                            {t("social.comments.delete", "DELETE")}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <form className="social-comment-form" onSubmit={(event) => handleSubmitComment(event, post.id)}>
                    <input
                      type="text"
                      className="social-comment-input"
                      value={commentDraft}
                      onChange={(event) => updateCommentDraft(post.id, event.target.value)}
                      placeholder={t("social.feed.commentPrompt", "Write your comment")}
                      aria-label={t("social.feed.commentPrompt", "Write your comment")}
                    />
                    <button
                      type="submit"
                      className="social-comment-submit"
                      disabled={isSubmittingComment || !commentDraft.trim()}
                    >
                      {isSubmittingComment
                        ? t("social.comments.sending", "SENDING...")
                        : t("social.comments.send", "SEND")}
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedLooksPage;
