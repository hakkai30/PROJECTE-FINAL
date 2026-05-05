import { useRef, useState } from "react";
import { Bookmark, Heart, ImagePlus, MessageCircle, ShoppingCart, X } from "lucide-react";
import { localizePost } from "../../data/i18n";

const SocialFeedPage = ({
  changePage,
  currentUser,
  onLogout,
  posts = [],
  likedPostIds = [],
  onToggleLikePost,
  onAddComment,
  onDeleteComment,
  onDeletePost,
  onCreatePost,
  onOpenProfile,
  isLoadingPosts = false,
  isPosting = false,
  feedError = "",
  savedLookIds = [],
  onToggleSavedLook,
  onMessageAuthor,
  language = "ca",
  t,
}) => {
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

  const [activeView, setActiveView] = useState("all");
  const [postText, setPostText] = useState("");
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [openCommentPostIds, setOpenCommentPostIds] = useState([]);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [submittingCommentIds, setSubmittingCommentIds] = useState([]);
  const savedLooksCount = savedLookIds.length;
  const totalLikes = posts.reduce((acc, post) => acc + post.likes, 0);
  const visiblePosts =
    activeView === "saved"
      ? posts.filter((post) => savedLookIds.includes(String(post.id)))
      : posts;

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPostImageFile(file);
    setPostImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setPostImageFile(null);
    setPostImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (isPosting) return;
    if (!postText.trim()) return;

    try {
      await onCreatePost?.({
        text: postText,
        imageFile: postImageFile,
      });

      setPostText("");
      clearImage();
    } catch {
      // Error is handled in shared parent state.
    }
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
        <button type="button" className="sidebar-link sidebar-link-active" onClick={() => changePage("socials")}>
          {t("social.sidebar.brand", "ROB_THE_FAB")}
        </button>
        <button type="button" className="sidebar-link" onClick={() => changePage("messages")}>
          {t("social.sidebar.messages", "MESSAGES")}
        </button>
        <button type="button" className="sidebar-link" onClick={() => changePage("saved-looks")}>
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
            <h1 className="social-feed-title">{t("social.feed.title", "SOCIAL FEED")}</h1>
            <button
              type="button"
              className="social-feed-count-chip"
              onClick={() => changePage("saved-looks")}
            >
              {t("social.sidebar.savedLooks", "SAVED LOOKS")} [ {savedLooksCount} ]
            </button>
          </div>
          <form className="social-feed-toolbar social-create-post-form" onSubmit={handleCreatePost}>
            <div className="social-input-group">
              <input
                type="text"
                className="threads-search-input"
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                placeholder={t("social.feed.postPlaceholder", "Write a new post...")}
                aria-label={t("social.feed.postPlaceholder", "Write a new post...")}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
                id="post-image-upload"
              />
              <button
                type="button"
                className="social-add-img-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={16} />
                <span>{postImageFile ? postImageFile.name.slice(0, 10) + "..." : t("social.feed.addImage", "ADD IMAGE")}</span>
              </button>
              <button type="submit" className="social-publish-btn" disabled={isPosting || !postText.trim()}>
                {isPosting ? t("social.feed.posting", "...") : t("social.feed.publish", "PUBLISH")}
              </button>
            </div>
            {postImagePreview && (
              <div className="social-preview-wrap">
                <img src={postImagePreview} alt="Preview" />
                <button type="button" onClick={clearImage}><X size={12} /></button>
              </div>
            )}
          </form>
          <p className="social-feed-subtitle">
            {t(
              "social.feed.subtitle",
              "Discover community looks and save your favorites for later."
            )}
          </p>
          <div className="social-feed-toolbar">
            <button
              type="button"
              className={`social-filter-chip ${activeView === "all" ? "active" : ""}`}
              onClick={() => setActiveView("all")}
            >
              {t("social.feed.allLooks", "ALL LOOKS")}
            </button>
            <button
              type="button"
              className={`social-filter-chip ${activeView === "saved" ? "active" : ""}`}
              onClick={() => setActiveView("saved")}
            >
              {t("social.feed.savedOnly", "SAVED ONLY")}
            </button>
            <span className="social-feed-stat">
              {t("social.feed.statsPosts", "POSTS")}: {visiblePosts.length}
            </span>
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

        {isLoadingPosts && (
          <div className="saved-looks-empty">
            <h2>{t("social.feed.loading", "LOADING POSTS...")}</h2>
          </div>
        )}

        {!isLoadingPosts && visiblePosts.length === 0 && (
          <div className="saved-looks-empty">
            <h2>{t("social.feed.noSavedInFeed", "NO SAVED LOOKS IN FEED")}</h2>
            <p>
              {t(
                "social.savedLooks.emptyDescription",
                "Save looks from Social Feed and they will appear here."
              )}
            </p>
            <button type="button" className="shop-look-btn" onClick={() => setActiveView("all")}>
              {t("social.feed.clearFilter", "SHOW ALL LOOKS")}
            </button>
          </div>
        )}

        {visiblePosts.map((post) => {
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

                {currentUser?.email === post.user_email && (
                  <button
                    type="button"
                    className="social-comment-delete"
                    style={{ marginLeft: 'auto', marginRight: '1rem', border: '1px solid var(--border-color)', padding: '2px 8px' }}
                    onClick={() => onDeletePost?.(post.id)}
                  >
                    {t("social.feed.deletePost", "DELETE POST")}
                  </button>
                )}
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
                  onClick={() => onToggleLikePost?.(post.id)}
                  aria-pressed={isLiked}
                  aria-label={t("social.actions.like", "LIKE POST")}
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.2} aria-hidden="true" />
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
                  aria-pressed={isSaved}
                  aria-label={
                    isSaved
                      ? t("social.actions.unsaveLook", "REMOVE FROM SAVED LOOKS")
                      : t("social.actions.saveLook", "SAVE LOOK")
                  }
                  onClick={() => onToggleSavedLook?.(post.id)}
                >
                  <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
                  {isSaved
                    ? t("social.actions.saved", "SAVED")
                    : t("social.actions.saveLook", "SAVE LOOK")}
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

export default SocialFeedPage;
