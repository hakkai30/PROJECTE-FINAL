import { useEffect, useState } from "react";
import { Bookmark, Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { localizePost } from "../data/i18n";

const POSTS_API_URL = "http://localhost:3000/api/posts";

const SocialFeedPage = ({
  changePage,
  currentUser,
  onLogout,
  savedLookIds = [],
  onToggleSavedLook,
  language = "ca",
  t,
}) => {
  const [posts, setPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [activeView, setActiveView] = useState("all");
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [feedError, setFeedError] = useState("");
  const savedLooksCount = savedLookIds.length;
  const totalLikes = posts.reduce((acc, post) => acc + post.likes, 0);
  const visiblePosts =
    activeView === "saved"
      ? posts.filter((post) => savedLookIds.includes(post.id))
      : posts;

  const handleLike = (id) => {
    const isLiked = likedPostIds.includes(id);

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextLikes = isLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
        return { ...p, likes: nextLikes };
      })
    );

    setLikedPostIds((prev) =>
      isLiked ? prev.filter((postId) => postId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      setIsLoadingPosts(true);
      setFeedError("");

      try {
        const response = await fetch(POSTS_API_URL);
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body?.error || "Could not load posts.");
        }

        if (isMounted) {
          setPosts(Array.isArray(body?.posts) ? body.posts : []);
        }
      } catch (error) {
        if (isMounted) {
          setFeedError(error.message || "Could not load posts.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPosts(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (isPosting) return;
    if (!postText.trim()) return;

    setIsPosting(true);
    setFeedError("");

    try {
      const response = await fetch(POSTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: postText,
          imageUrl: postImage,
          user: currentUser?.name || "USER",
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error || "Could not create post.");
      }

      if (body?.post) {
        setPosts((prev) => [body.post, ...prev]);
      }

      setPostText("");
      setPostImage("");
    } catch (error) {
      setFeedError(error.message || "Could not create post.");
    } finally {
      setIsPosting(false);
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
            <h1 className="social-feed-title">{t("social.feed.title", "SOCIAL FEED")}</h1>
            <button
              type="button"
              className="social-feed-count-chip"
              onClick={() => changePage("saved-looks")}
            >
              {t("social.sidebar.savedLooks", "SAVED LOOKS")} [ {savedLooksCount} ]
            </button>
          </div>
          <form className="social-feed-toolbar" onSubmit={handleCreatePost}>
            <input
              type="text"
              className="threads-search-input"
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              placeholder={t("social.feed.postPlaceholder", "Write a new post...")}
              aria-label={t("social.feed.postPlaceholder", "Write a new post...")}
            />
            <input
              type="url"
              className="threads-search-input"
              value={postImage}
              onChange={(event) => setPostImage(event.target.value)}
              placeholder={t("social.feed.imagePlaceholder", "Optional image URL")}
              aria-label={t("social.feed.imagePlaceholder", "Optional image URL")}
            />
            <button type="submit" className="shop-look-btn" disabled={isPosting || !postText.trim()}>
              {isPosting ? t("social.feed.posting", "POSTING...") : t("social.feed.publish", "PUBLISH")}
            </button>
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
          const isSaved = savedLookIds.includes(post.id);
          const isLiked = likedPostIds.includes(post.id);
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
                  className={`icon-action-btn ${isLiked ? "active" : ""}`}
                  onClick={() => handleLike(post.id)}
                  aria-pressed={isLiked}
                  aria-label={t("social.actions.like", "LIKE POST")}
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.2} aria-hidden="true" />
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialFeedPage;
