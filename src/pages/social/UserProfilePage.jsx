import React, { useState } from "react";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { GlobalFooter, GlobalHeader, SocialSidebar } from "../../components/Layout";

const UserProfilePage = ({
  changePage,
  cartCount,
  wishlistCount,
  currentUser,
  theme,
  onToggleTheme,
  posts = [],
  onDeletePost,
  language,
  t,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userPosts = posts.filter(post => post.user_email === currentUser?.email);

  return (
    <div className="category-page">
      <GlobalHeader {...{ changePage, cartCount, wishlistCount, theme, language, setLanguage, t, currentUser }} />
      <div className="social-layout">
        <SocialSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} changePage={changePage} t={t} />
        <main className="user-profile-container">
          <section className="profile-header">
            <div className="profile-avatar">
              {currentUser?.avatar ? <img src={currentUser.avatar} alt="" /> : <div className="avatar-placeholder">{(currentUser?.name || "U")[0]}</div>}
            </div>
            <div className="profile-info">
              <h1>{currentUser?.name || "El meu Perfil"}</h1>
              <p className="profile-email">{currentUser?.email}</p>
              {currentUser?.bio && <p className="profile-bio">{currentUser.bio}</p>}
            </div>
          </section>

          <section className="user-posts-section">
            <h2 className="section-title">{t("profile.yourPosts", "LES MEVES PUBLICACIONS")} ({userPosts.length})</h2>
            <div className="profile-posts-grid">
              {userPosts.length === 0 ? (
                <p className="empty-state">{t("profile.noPosts", "Encara no has publicat res.")}</p>
              ) : (
                userPosts.map(post => (
                  <div key={post.id} className="profile-post-card">
                    <img src={post.img} alt="" />
                    <div className="post-overlay">
                      <div className="post-stats">
                        <span><Heart size={14} fill="currentColor" /> {post.likes || 0}</span>
                      </div>
                      <button className="delete-post-btn" onClick={() => onDeletePost?.(post.id)}>
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
