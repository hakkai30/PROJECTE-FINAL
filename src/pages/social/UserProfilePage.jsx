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
  const [userProducts, setUserProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [likedProductIds, setLikedProductIds] = useState([]);

  useEffect(() => {
    loadUserProducts();
  }, [currentUser?.email]);

  const loadUserProducts = async () => {
    if (!currentUser?.email) {
      setUserProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const products = await userProductService.getUserProductsByEmail(
        currentUser.email
      );
      setUserProducts(products);
    } catch (err) {
      setError(err.message || "Could not load your products.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    setIsUploading(true);
    setUploadError("");

    try {
      const newProduct = await userProductService.createUserProduct(productData);

      if (newProduct) {
        setUserProducts((prev) => [newProduct, ...prev]);
        setShowUploadForm(false);
      }
    } catch (err) {
      setUploadError(err.message || "Could not upload product.");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm(t("profile.confirmDelete", "Are you sure you want to delete this product?"))) {
      return;
    }

    try {
      await userProductService.deleteUserProduct(productId);
      setUserProducts((prev) => prev.filter((prod) => prod.id !== productId));
    } catch (err) {
      setError(err.message || "Could not delete product.");
    }
  };

  const handleToggleLike = async (productId) => {
    const isLiked = likedProductIds.includes(productId);
    const direction = isLiked ? "down" : "up";

    setLikedProductIds((prev) =>
      isLiked
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    setUserProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const nextLikes = isLiked
          ? Math.max(0, Number(prod.likes || 0) - 1)
          : Number(prod.likes || 0) + 1;
        return { ...prod, likes: nextLikes };
      })
    );

    try {
      const updatedProduct = await userProductService.toggleUserProductLike(
        productId,
        { direction }
      );
      if (updatedProduct) {
        setUserProducts((prev) =>
          prev.map((prod) =>
            prod.id === productId ? updatedProduct : prod
          )
        );
      }
    } catch (err) {
      // Revert on error
      setLikedProductIds((prev) =>
        isLiked ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      setUserProducts((prev) =>
        prev.map((prod) => {
          if (prod.id !== productId) return prod;
          const revertedLikes = isLiked
            ? Number(prod.likes || 0) + 1
            : Math.max(0, Number(prod.likes || 0) - 1);
          return { ...prod, likes: revertedLikes };
        })
      );
    }
  };

  const isCurrentUserProfile = currentUser?.email && currentUser?.name;

  if (showUploadForm) {
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
        <UploadProductForm
          currentUser={currentUser}
          onSubmit={handleCreateProduct}
          isLoading={isUploading}
          error={uploadError}
          onCancel={() => setShowUploadForm(false)}
          t={t}
        />
        <GlobalFooter t={t} />
      </div>
    );
  }

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

          <button
            className="btn-primary"
            onClick={() => setShowUploadForm(true)}
            disabled={!isCurrentUserProfile}
          >
            <Plus size={18} aria-hidden="true" />
            {t("profile.uploadNewItem", "UPLOAD NEW ITEM")}
          </button>
        </section>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Products Section */}
        <section className="user-products-section">
          <h2>{t("profile.yourItems", "YOUR ITEMS")} ({userProducts.length})</h2>

          {isLoading ? (
            <div className="loading-state">
              <p>{t("profile.loading", "Loading your products...")}</p>
            </div>
          ) : userProducts.length === 0 ? (
            <div className="empty-state">
              <p>{t("profile.noItems", "You haven't uploaded any items yet.")}</p>
              <button
                className="btn-secondary"
                onClick={() => setShowUploadForm(true)}
              >
                {t("profile.startSelling", "START SELLING")}
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {userProducts.map((product) => (
                <div key={product.id} className="user-product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">{product.description}</p>

                    <div className="product-meta">
                      <span className="product-gender">{product.gender}</span>
                      <span className="product-sizes">
                        {product.sizes.join(", ")}
                      </span>
                    </div>

                    <div className="product-footer">
                      <div className="product-price-likes">
                        <span className="product-price">{product.price.toFixed(2)}€</span>
                        <button
                          className={`like-btn ${
                            likedProductIds.includes(product.id) ? "liked" : ""
                          }`}
                          onClick={() => handleToggleLike(product.id)}
                          aria-label={t("profile.toggleLike", "Toggle like")}
                        >
                          <Heart size={18} />
                          <span>{product.likes || 0}</span>
                        </button>
                      </div>

                      {isCurrentUserProfile && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          aria-label={t("profile.deleteProduct", "Delete product")}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {isCurrentUserProfile && userProducts.length > 0 && (
          <section className="stats-section">
            <div className="stat">
              <span className="stat-label">{t("profile.totalItems", "Total Items")}</span>
              <span className="stat-value">{userProducts.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">{t("profile.totalLikes", "Total Likes")}</span>
              <span className="stat-value">
                {userProducts.reduce((sum, p) => sum + (p.likes || 0), 0)}
              </span>
            </div>
          </section>
        )}
      </main>

      <GlobalFooter t={t} />
    </div>
  );
};

export default UserProfilePage;
