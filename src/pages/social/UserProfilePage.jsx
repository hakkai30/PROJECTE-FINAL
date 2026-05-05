import { useState, useEffect } from "react";
import { Heart, Trash2, Plus } from "lucide-react";
import { GlobalFooter, GlobalHeader } from "../../components/Layout";
import UploadProductForm from "../../components/UploadProductForm";
import { userProductService } from "../../services/userProductService";

const UserProfilePage = ({
  changePage,
  cartCount,
  wishlistCount,
  currentUser,
  theme,
  onToggleTheme,
  language,
  t,
}) => {
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
      </main>

      <GlobalFooter t={t} />
    </div>
  );
};

export default UserProfilePage;
