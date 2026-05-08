import React from "react";
import { Heart, MessageCircle, ShoppingBag, Bookmark } from "lucide-react";
import { localizePost } from "../data/i18n";

// Componente individual para cada post de la red social.
const SocialPost = ({
  post,
  language,
  t,
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
  const localizedPost = localizePost(post, language);

  return (
    <div className="social-post">
      <div className="post-header">
        <div className="user-avatar"></div>
        <button
          type="button"
          className="post-user-handle post-user-handle-btn"
          onClick={() => onOpenProfile?.(post)}
        >
          @{post.user}
        </button>
      </div>

      <img
        src={localizedPost.img}
        alt={`${t("social.postAlt", "Post by")} ${post.user}`}
        className="post-img"
        loading="lazy"
      />

      <div className="post-actions">
        <button
          type="button"
          className={`icon-action-btn ${isLiked ? "active" : ""}`}
          onClick={() => onToggleLike(post.id)}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.2} />
          {post.likes}
        </button>

        <button
          type="button"
          className="icon-action-btn"
          onClick={() => onToggleComments(post.id)}
        >
          <MessageCircle size={16} />
          {t("social.actions.comment", "COMMENT")} ({commentsCount})
        </button>


        <button type="button" className="shop-look-btn">
          <ShoppingBag size={16} />
          {t("social.actions.shopLook", "SHOP LOOK")}
        </button>

        <button
          type="button"
          className={`save-look-btn ${isSaved ? "active" : ""}`}
          onClick={() => onToggleSave(post.id)}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? t("social.actions.saved", "SAVED") : t("social.actions.saveLook", "SAVE")}
        </button>
      </div>

      <div className="social-post-caption">
        <strong>{post.user}</strong> {localizedPost.desc}
      </div>

      {isCommentsOpen && (
        <div className="social-comments-panel">
          <div className="social-comments-list">
            {commentsCount === 0 && (
              <p className="social-comments-empty">
                {t("social.comments.empty", "No hay comentarios todavía.")}
              </p>
            )}

            {Array.isArray(post.comments) && post.comments.map((comment, idx) => (
              <div key={comment.id || idx} className="social-comment-item">
                <div className="social-comment-meta">
                  <span className="social-comment-user">@{comment.users?.name || "USER"}</span>
                  <span className="social-comment-time">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="social-comment-text">{comment.text}</p>
                {canDeleteComment(comment) && (
                  <button
                    type="button"
                    className="social-comment-delete"
                    onClick={() => onDeleteComment(post.id, comment.id)}
                  >
                    {t("social.comments.delete", "ELIMINAR")}
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
              placeholder={t("social.feed.commentPrompt", "Escribe un comentario...")}
            />
            <button
              type="submit"
              className="social-comment-submit"
              disabled={isSubmittingComment || !commentDraft.trim()}
            >
              {isSubmittingComment ? "..." : t("social.comments.send", "ENVIAR")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SocialPost;
