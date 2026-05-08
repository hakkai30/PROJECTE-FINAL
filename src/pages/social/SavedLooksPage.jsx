import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { GlobalFooter, GlobalHeader, SocialSidebar } from "../../components/Layout";

const SavedLooksPage = ({
  changePage,
  currentUser,
  onLogout,
  savedLooks = [],
  likedPostIds = [],
  onToggleLikePost,
  onAddComment,
  onDeleteComment,
  onDeletePost,
  onMessageAuthor,
  onOpenProfile,
  feedError = "",
  savedLookIds = [],
  onToggleSavedLook,
  cartCount = 0,
  wishlistCount = 0,
  theme,
  onToggleTheme,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    if (diffMinutes < 1) return "ahora";
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
    <div className="category-page">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        currentUser={currentUser}
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      <div className="social-layout">
        <SocialSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          changePage={changePage} 
        />
        <div className="social-feed">
        <div className="social-feed-header">
          <div className="social-feed-title-row">
            <h1 className="social-feed-title">LOOKS GUARDADOS</h1>
            <button
              type="button"
              className="social-feed-count-chip"
              onClick={() => changePage("socials")}
            >
              SOCIAL FEED
            </button>
          </div>
          <p className="social-feed-subtitle">
            Tus looks guardados de la comunidad social.
          </p>
          <div className="social-feed-toolbar">
            <span className="social-feed-stat">
              GUARDADOS: {savedLooksCount}
            </span>
            <span className="social-feed-stat">LIKES: {totalLikes}</span>
          </div>
        </div>

        {feedError && (
          <div className="saved-looks-empty">
            <h2>ERROR EN EL FEED</h2>
            <p>{feedError}</p>
          </div>
        )}

        {/* Filtrar solo los posts cuyos IDs están en la lista de guardados */}
        {(() => {
          const visibleSavedLooks = savedLooks.filter((post) =>
            savedLookIds.includes(String(post.id))
          );

          if (visibleSavedLooks.length === 0) {
            return (
              <div className="saved-looks-empty">
                <h2>AÚN NO HAS GUARDADO LOOKS</h2>
                <p>Guarda looks desde Social Feed y aparecerán aquí.</p>
                <button
                  type="button"
                  className="shop-look-btn"
                  onClick={() => changePage("socials")}
                >
                  IR A SOCIAL FEED
                </button>
              </div>
            );
          }

          return visibleSavedLooks.map((post) => {
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
                  aria-label="VER PERFIL"
                >
                  @{post.user || post.user_email?.split('@')[0] || "usuario"}
                </button>

                {currentUser?.email === post.user_email && (
                  <button
                    type="button"
                    className="social-comment-delete"
                    style={{ marginLeft: 'auto', marginRight: '1rem', border: '1px solid var(--border-color)', padding: '2px 8px' }}
                    onClick={() => onDeletePost?.(post.id)}
                  >
                    ELIMINAR
                  </button>
                )}
              </div>
              {post.img && (
                <img
                  src={post.img}
                  alt={`Publicación de ${post.user || post.user_email || "usuario"}`}
                  className="post-img"
                />
              )}
              <div className="social-post-caption">
                <strong>{post.user || post.user_email?.split('@')[0] || "usuario"}</strong> {post.description}
              </div>

              <div className="post-actions">
                <button
                  type="button"
                  className={`icon-action-btn ${isLiked ? "active" : ""}`}
                  aria-label="ME GUSTA"
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
                  aria-label="COMENTA"
                  aria-expanded={isCommentsOpen}
                  onClick={() => toggleCommentsPanel(post.id)}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  COMENTA ({commentsCount})
                </button>
                <button
                  type="button"
                  className="icon-action-btn"
                  aria-label="ENVIAR MENSAJE"
                  onClick={() => onMessageAuthor?.(post)}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  MENSAJE
                </button>
                <button
                  type="button"
                  className={`save-look-btn ${isSaved ? "active" : ""}`}
                  aria-label="QUITAR DE GUARDADOS"
                  aria-pressed={isSaved}
                  onClick={() => onToggleSavedLook?.(post.id)}
                >
                  <Bookmark size={16} fill="currentColor" aria-hidden="true" />
                  GUARDADO
                </button>
              </div>

              {isCommentsOpen && (
                <div className="social-comments-panel">
                  <div className="social-comments-list" aria-live="polite">
                    {commentsCount === 0 && (
                      <p className="social-comments-empty">
                        No hay comentarios todavía.
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
                            aria-label="VER PERFIL"
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
                            ELIMINAR
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
                      placeholder="Escribe tu comentario"
                      aria-label="Escribe tu comentario"
                    />
                    <button
                      type="submit"
                      className="social-comment-submit"
                      disabled={isSubmittingComment || !commentDraft.trim()}
                    >
                      {isSubmittingComment
                        ? "ENVIANDO..."
                        : "ENVIAR"}
                    </button>
                  </form>
                </div>
              )}
            </div>
            );
          });
        })()}
      </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default SavedLooksPage;
