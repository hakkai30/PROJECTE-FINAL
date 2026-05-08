import React from "react";
import { Heart, MessageCircle, ShoppingBag, Bookmark } from "lucide-react";

// Componente individual para cada post de la red social.
const SocialPost = ({
  post,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onToggleComments,
  isCommentsOpen,
  onOpenProfile,
  commentsCount,
  commentDraft,
  onCommentChange,
  onCommentSubmit,
  isSubmittingComment,
  canDeleteComment,
  onDeleteComment,
  formatRelativeTime
}) => {
  return (
    <div className={`social-post ${!post.img ? "text-only-post" : ""}`}>
      <div className="post-header">
        <div className="user-avatar"></div>
        <button
          type="button"
          className="post-user-handle post-user-handle-btn"
          onClick={() => onOpenProfile?.(post)}
        >
          @{post.user || post.user_email?.split('@')[0] || "usuario"}
        </button>
      </div>

      {post.img && (
        <img src={post.img} alt={`Publicación de ${post.user || post.user_email || "usuario"}`} className="post-img" />
      )}

      <div className="post-actions">
        <button
          className={`icon-action-btn ${isLiked ? "active" : ""}`}
          onClick={() => onToggleLike(post.id)}
          aria-label="ME GUSTA"
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.2} />
          <span>{post.likes}</span>
        </button>

        <button
          className="icon-action-btn"
          onClick={() => onToggleComments(post.id)}
          aria-label="COMENTARIOS"
        >
          <MessageCircle size={16} />
          <span>COMENTARIOS ({commentsCount})</span>
        </button>

        <button
          type="button"
          className={`save-look-btn ${isSaved ? "active" : ""}`}
          onClick={() => onToggleSave(post.id)}
          aria-label="GUARDAR"
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
          <span>{isSaved ? "GUARDADO" : "GUARDAR"}</span>
        </button>
      </div>

      <div className="social-post-caption">
        <strong>{post.user || post.user_email?.split('@')[0]}</strong> {post.description}
      </div>

      {isCommentsOpen && (
        <div className="social-comments-panel">
          <div className="social-comments-list">
            {commentsCount === 0 && (
              <p className="social-comments-empty">
                No hay comentarios todavía.
              </p>
            )}

            {Array.isArray(post.comments) && post.comments.map((comment, idx) => (
              <div key={comment.id || idx} className="social-comment-item">
                <div className="social-comment-meta">
                  <span className="social-comment-user">@{comment.user || "USER"}</span>
                  <span className="social-comment-time">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="social-comment-text">{comment.text}</p>
                {canDeleteComment(comment) && (
                  <button
                    type="button"
                    className="social-comment-delete"
                    onClick={() => onDeleteComment(post.id, comment.id)}
                  >
                    ELIMINAR
                  </button>
                )}
              </div>
            ))}
          </div>

          <form className="social-comment-form" onSubmit={(e) => onCommentSubmit(e, post.id)}>
            <input
              type="text"
              className="social-comment-input"
              value={commentDraft}
              onChange={(e) => onCommentChange(post.id, e.target.value)}
              placeholder="Escribe un comentario..."
            />
            <button
              type="submit"
              className="social-comment-submit"
              disabled={isSubmittingComment || !commentDraft.trim()}
            >
              {isSubmittingComment ? "..." : "ENVIAR"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SocialPost;
