import React, { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { GlobalFooter, GlobalHeader, SocialSidebar } from "../../components/Layout";
import SocialPost from "../../components/SocialPost";

const SocialFeedPage = ({
  changePage,
  currentUser,
  onLogout,
  posts = [],
  activeView = "all",
  onViewChange,
  likedPostIds = [],
  onToggleLikePost,
  onAddComment,
  onDeleteComment,
  onCreatePost,
  onOpenProfile,
  isLoadingPosts = false,
  isPosting = false,
  feedError = "",
  savedLookIds = [],
  onToggleSavedLook,
  hasMore = false,
  onLoadMore,
  cartCount = 0,
  wishlistCount = 0,
  theme,
  onToggleTheme,
  language = "ca",
  t,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localView, setLocalView] = useState("all");
  const [postText, setPostText] = useState("");
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [openCommentPostIds, setOpenCommentPostIds] = useState([]);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [submittingCommentIds, setSubmittingCommentIds] = useState([]);

  const formatRelativeTime = (isoDate) => {
    const timestamp = Date.parse(isoDate || "");
    if (isNaN(timestamp)) return "";
    const diffMs = Date.now() - timestamp;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 1) return t("social.comments.now", "ara");
    if (diffHours < 24) return `${diffHours}h`;
    return new Date(timestamp).toLocaleDateString();
  };

  const canDeleteComment = (comment) => {
    const currentName = currentUser?.name?.toLowerCase();
    const commentUser = comment?.users?.name?.toLowerCase();
    return currentName && currentName === commentUser;
  };

  const visiblePosts = localView === "saved"
    ? posts.filter((post) => savedLookIds.includes(String(post.id)))
    : posts;

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImageFile(file);
      setPostImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postText.trim() || isPosting) return;
    try {
      await onCreatePost({ text: postText, imageFile: postImageFile });
      setPostText("");
      setPostImageFile(null);
      setPostImagePreview("");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="category-page">
      <GlobalHeader {...{ changePage, cartCount, wishlistCount, currentUser, onLogout, theme, onToggleTheme, language, t }} />
      
      <div className="social-layout">
        <SocialSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} changePage={changePage} t={t} />
        
        <main className="social-feed">
          <header className="social-feed-header">
            <h1 className="social-feed-title">{t("social.feed.title", "SOCIAL FEED")}</h1>
            
            <form className="social-create-post-form" onSubmit={handleCreatePost}>
              <div className="social-input-group">
                <input
                  type="text"
                  className="threads-search-input"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={t("social.feed.postPlaceholder", "Escriu un post...")}
                />
                <input type="file" ref={fileInputRef} hidden onChange={handleImageSelect} accept="image/*" />
                <button type="button" className="social-add-img-btn" onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={16} />
                </button>
                <button type="submit" className="social-publish-btn" disabled={isPosting || !postText.trim()}>
                  {isPosting ? "..." : t("social.feed.publish", "PUBLICAR")}
                </button>
              </div>
              {postImagePreview && (
                <div className="social-preview-wrap">
                  <img src={postImagePreview} alt="Preview" />
                  <button type="button" onClick={() => { setPostImageFile(null); setPostImagePreview(""); }}><X size={12} /></button>
                </div>
              )}
            </form>

            <div className="social-feed-toolbar">
              <button className={`social-filter-chip ${localView === "all" ? "active" : ""}`} onClick={() => setLocalView("all")}>
                {t("social.feed.allLooks", "TOTS")}
              </button>
              <button className={`social-filter-chip ${localView === "saved" ? "active" : ""}`} onClick={() => setLocalView("saved")}>
                {t("social.sidebar.savedLooks", "DESATS")} ({savedLookIds.length})
              </button>
            </div>
          </header>

          {feedError && <div className="error-message">{feedError}</div>}

          <div className="posts-container">
            {visiblePosts.map((post) => (
              <SocialPost
                key={post.id}
                post={post}
                language={language}
                t={t}
                isLiked={likedPostIds.includes(String(post.id))}
                isSaved={savedLookIds.includes(String(post.id))}
                onToggleLike={onToggleLikePost}
                onToggleSave={onToggleSavedLook}
                onToggleComments={(id) => setOpenCommentPostIds(prev => prev.includes(String(id)) ? prev.filter(i => i !== String(id)) : [...prev, String(id)])}
                isCommentsOpen={openCommentPostIds.includes(String(post.id))}
                onOpenProfile={onOpenProfile}
                commentsCount={post.comments?.length || 0}
                commentDraft={commentDrafts[String(post.id)] || ""}
                onCommentChange={(id, val) => setCommentDrafts(prev => ({ ...prev, [String(id)]: val }))}
                onCommentSubmit={async (e, id) => {
                  e.preventDefault();
                  const draft = commentDrafts[String(id)];
                  if (!draft?.trim()) return;
                  setSubmittingCommentIds(prev => [...prev, String(id)]);
                  try {
                    await onAddComment(id, draft);
                    setCommentDrafts(prev => ({ ...prev, [String(id)]: "" }));
                  } finally {
                    setSubmittingCommentIds(prev => prev.filter(i => i !== String(id)));
                  }
                }}
                isSubmittingComment={submittingCommentIds.includes(String(post.id))}
                canDeleteComment={canDeleteComment}
                onDeleteComment={onDeleteComment}
                formatRelativeTime={formatRelativeTime}
              />
            ))}
          </div>

          {hasMore && (
            <button className="load-more-btn" onClick={onLoadMore} disabled={isLoadingPosts}>
              {isLoadingPosts ? "..." : t("social.feed.loadingMore", "CARREGAR MÉS")}
            </button>
          )}
        </main>
      </div>

      <GlobalFooter t={t} />
    </div>
  );
};

export default SocialFeedPage;
