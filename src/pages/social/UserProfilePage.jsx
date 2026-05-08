import React, { useState, useRef } from "react";
import { Heart, Trash2, Camera, Check, X } from "lucide-react";
import { GlobalFooter, GlobalHeader, SocialSidebar } from "../../components/Layout";
import { authService } from "../../services/authService";

const UserProfilePage = ({
  changePage,
  cartCount,
  wishlistCount,
  currentUser,
  theme,
  posts = [],
  onDeletePost,
  onUpdateUser,
  viewedUser, // Usuario que estamos visualizando
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(viewedUser?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const isOwnProfile = currentUser?.email === viewedUser?.email;
  const userPosts = posts.filter(post => post.user_email === viewedUser?.email);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewAvatar(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const result = await authService.updateProfile({
        bio: editBio,
        avatar: currentUser?.avatar,
        avatarFile: previewAvatar
      });
      if (result.ok) {
        onUpdateUser?.(result.user);
        setIsEditing(false);
        setPreviewAvatar(null);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="category-page">
      <GlobalHeader {...{ changePage, cartCount, wishlistCount, theme, currentUser }} />
      <div className="social-layout">
        <SocialSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} changePage={changePage} />
        <main className="user-profile-container">
          <section className="profile-header">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {previewAvatar ? (
                  <img src={URL.createObjectURL(previewAvatar)} alt="Vista previa" />
                ) : (
                  viewedUser?.avatar ? <img src={viewedUser.avatar} alt="" /> : <div className="avatar-placeholder">{(viewedUser?.name || "U")[0]}</div>
                )}
              </div>
              {isOwnProfile && isEditing && (
                <button 
                  className="edit-avatar-overlay" 
                  onClick={() => fileInputRef.current.click()}
                  disabled={isSaving}
                >
                  <Camera size={20} />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
            </div>
            
            <div className="profile-info">
              <div className="profile-title-row">
                <h1>{viewedUser?.name || "Perfil"}</h1>
                {isOwnProfile && (
                  !isEditing ? (
                    <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>EDITAR PERFIL</button>
                  ) : (
                    <div className="edit-actions">
                      <button className="save-profile-btn" onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? "GUARDANDO..." : <Check size={18} />}
                      </button>
                      <button className="cancel-edit-btn" onClick={() => { setIsEditing(false); setPreviewAvatar(null); }} disabled={isSaving}>
                        <X size={18} />
                      </button>
                    </div>
                  )
                )}
              </div>
              <p className="profile-email">{viewedUser?.email}</p>
              
              {isEditing ? (
                <textarea 
                  className="edit-bio-input" 
                  value={editBio} 
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Escribe algo sobre ti..."
                />
              ) : (
                viewedUser?.bio && <p className="profile-bio">{viewedUser.bio}</p>
              )}
            </div>
          </section>

          <section className="user-posts-section">
            <h2 className="section-title">PUBLICACIONES ({userPosts.length})</h2>
            <div className="profile-posts-grid">
              {userPosts.length === 0 ? (
                <p className="empty-state">No hay publicaciones todavía.</p>
              ) : (
                userPosts.map(post => (
                  <div key={post.id} className="profile-post-card">
                    {post.img ? (
                      <img src={post.img} alt="" />
                    ) : (
                      <div className="profile-post-text-fallback">
                        <p>{post.description}</p>
                      </div>
                    )}
                    <div className="post-overlay">
                      <div className="post-stats">
                        <span><Heart size={14} fill="currentColor" /> {post.likes || 0}</span>
                      </div>
                      {isOwnProfile && (
                        <button className="delete-post-btn" onClick={() => onDeletePost?.(post.id)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default UserProfilePage;
