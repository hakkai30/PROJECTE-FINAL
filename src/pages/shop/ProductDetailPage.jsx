import { GlobalFooter, GlobalHeader } from "../../components/Layout";
import { localizeProduct } from "../../data/i18n";

const ProductDetailPage = ({
  changePage,
  cartCount,
  wishlistCount,
  product,
  addToCart,
  wishlistIds,
  onToggleWishlist,
  onOpenProductDetail,
  theme,
  onToggleTheme,
  language,
  t,
}) => {
  const isWishlisted = wishlistIds.includes(product.id);
  const localizedProduct = localizeProduct(product, language);

  return (
    <div className="category-page">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenProductDetail={onOpenProductDetail}
        theme={theme}
        onToggleTheme={onToggleTheme}
        language={language}
        t={t}
      />

      <main className="product-detail-layout">
        <button className="product-back-btn" onClick={() => changePage(product.category)}>
          ← {t("detail.back", "BACK TO")} {product.category.toUpperCase()}
        </button>

        <div className="product-detail-grid">
          <img 
            src={localizedProduct.img} 
            alt={localizedProduct.name} 
            className="product-detail-img" 
            loading="lazy"
          />

          <section className="product-detail-info">
            <p className="product-brand">{localizedProduct.brand}</p>
            <h1>{localizedProduct.name}</h1>
            <p className="product-detail-price">{product.price.toFixed(2)}€</p>

            <div className="product-detail-meta">
              <p>
                <strong>{t("detail.category", "Category")}:</strong> {product.category.toUpperCase()}
              </p>
              <p>
                <strong>{t("detail.color", "Color")}:</strong> {product.color.toUpperCase()}
              </p>
              <p>
                <strong>{t("detail.sizes", "Available sizes")}:</strong> {(product.sizes || []).join(", ")}
              </p>
            </div>

            <div className="product-detail-actions">
              <button className="add-btn" onClick={() => addToCart(product)}>
                {t("detail.addToBag", "+ ADD TO BAG")}
              </button>
              <button
                className={`quick-view-wishlist ${isWishlisted ? "active" : ""}`}
                onClick={() => onToggleWishlist(product)}
              >
                {isWishlisted
                  ? t("detail.removeFromFavorites", "REMOVE FROM FAVORITES")
                  : t("detail.saveToFavorites", "SAVE TO FAVORITES")}
              </button>
            </div>
          </section>
        </div>
      </main>

      <GlobalFooter t={t} />
    </div>
  );
};

export default ProductDetailPage;
