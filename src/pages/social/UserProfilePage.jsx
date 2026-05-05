import { useState, useEffect } from "react";
import { Heart, Trash2, Plus, MessageCircle, Bookmark, MessageSquare } from "lucide-react";
import { GlobalFooter, GlobalHeader, SocialSidebar } from "../../components/Layout";
import { localizePost } from "../../data/i18n";

const UserProfilePage = ({
  changePage,
  cartCount,
  wishlistCount,
  currentUser,
  theme,
  onToggleTheme,
  posts = [],
  likedPostIds = [],
  onToggleLikePost,
  onAddComment,
  onDeleteComment,
  onDeletePost,
  savedLookIds = [],
  onToggleSavedLook,
  language,
  t,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isCurrentUserProfile = currentUser?.email && currentUser?.name;

  // Upload form rendering removed

  return (
    <div className="category-page">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        theme={theme}
        onToggleTheme={onToggleTheme}
        language={language}
        t={t}
      />

      <div className="social-layout">
        <SocialSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          changePage={changePage} 
          t={t} 
        />
        <main className="user-profile-container">
        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-avatar">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} />
            ) : (
              <div className="avatar-placeholder">
                {(currentUser?.name || "U").slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-info">
            <h1>{currentUser?.name || "Your Profile"}</h1>
            <p className="profile-email">{currentUser?.email || ""}</p>
            {currentUser?.bio && <p className="profile-bio">{currentUser.bio}</p>}
          </div>

          {/* Upload item button removed */}
        </section>

        <section className="profile-actions">
           <button className="btn-secondary" onClick={() => changePage("shop")}>
             {t("profile.backToShop", "BACK TO SHOP")}
           </button>
           <button className="btn-primary" onClick={() => changePage("socials")}>
             {t("profile.viewFeed", "VIEW SOCIAL FEED")}
           </button>
        </section>

        {/* User Posts Feed */}
        <section className="user-posts-section">
          <h2 className="section-title">{t("profile.yourPosts", "YOUR POSTS")}</h2>
          
          <div className="profile-posts-grid">
            {posts.filter(post => post.user === currentUser.email || post.user === currentUser.name).length === 0 ? (
              <p className="empty-state">{t("profile.noPosts", "You haven't posted anything yet.")}</p>
            ) : (
              posts
                .filter(post => post.user === currentUser.email || post.user === currentUser.name)
                .map(post => (
                  <div key={post.id} className="profile-post-card">
                    <div className="post-media">
                      {post.image ? (
                        <img src={post.image} alt="" />
                      ) : (
                        <div className="post-text-placeholder">
                          <p>{post.text}</p>
                        </div>
                      )}
                    </div>
                    <div className="post-overlay">
                      <div className="post-stats">
                        <span><Heart size={16} fill="currentColor" /> {post.likes || 0}</span>
                        <span><MessageCircle size={16} fill="currentColor" /> {post.comments?.length || 0}</span>
                      </div>
                      <button 
                        className="delete-post-btn"
                        onClick={() => onDeletePost?.(post.id)}
                        title={t("social.comments.delete", "DELETE")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>
      </main>
      </div>

      <GlobalFooter t={t} />
    </div>
  );
};

export default UserProfilePage;
