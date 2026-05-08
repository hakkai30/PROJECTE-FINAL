import { GlobalFooter, GlobalHeader } from "../../components/Layout";

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
  currentUser,
  onLogout,
  products = [],
}) => {
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="category-page">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenProductDetail={onOpenProductDetail}
        theme={theme}
        onToggleTheme={onToggleTheme}
        currentUser={currentUser}
        onLogout={onLogout}
        products={products}
      />

      <main className="product-detail-layout">
        <button className="product-back-btn" onClick={() => changePage(product.category)}>
          ← VOLVER A {product.category.toUpperCase()}
        </button>

        <div className="product-detail-grid">
          <img 
            src={product.img} 
            alt={product.name} 
            className="product-detail-img" 
            loading="lazy"
          />

          <section className="product-detail-info">
            <p className="product-brand">{product.brand}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-price">{product.price.toFixed(2)}€</p>

            <div className="product-detail-meta">
              <p>
                <strong>Categoría:</strong> {product.category.toUpperCase()}
              </p>
              <p>
                <strong>Color:</strong> {product.color.toUpperCase()}
              </p>
              <p>
                <strong>Tallas disponibles:</strong> {(product.sizes || []).join(", ")}
              </p>
            </div>

            <div className="product-detail-actions">
              <button className="add-btn" onClick={() => addToCart(product)}>
                + AÑADIR A LA BOLSA
              </button>
              <button
                className={`quick-view-wishlist ${isWishlisted ? "active" : ""}`}
                onClick={() => onToggleWishlist(product)}
              >
                {isWishlisted
                  ? "QUITAR DE FAVORITOS"
                  : "GUARDAR EN FAVORITOS"}
              </button>
            </div>
          </section>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default ProductDetailPage;
