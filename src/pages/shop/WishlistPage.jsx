import { GlobalFooter, GlobalHeader } from "../../components/Layout";

const WishlistPage = ({
  changePage,
  cartCount,
  wishlistCount,
  wishlistItems,
  onToggleWishlist,
  addToCart,
  onOpenProductDetail,
  theme,
  onToggleTheme,
  currentUser,
  onLogout,
}) => {
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
      />

      <div className="cart-container">
        <h2 className="cart-title">WISHLIST ({wishlistCount})</h2>

        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", fontSize: "1.3rem" }}>
            Todavía no tienes favoritos guardados.
            <br />
            <br />
            <button className="toolbar-btn" onClick={() => changePage("shop")}>
              DESCUBRE PRODUCTOS
            </button>
          </div>
        ) : (
          <div>
            {wishlistItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="cart-item-img"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <p className="item-brand">{item.brand}</p>
                    <button className="item-name item-name-btn" onClick={() => onOpenProductDetail(item)}>
                      {item.name}
                    </button>
                    <p className="item-meta">Categoría: {item.category.toUpperCase()}</p>
                    <button className="remove-btn" onClick={() => onToggleWishlist(item)}>
                      Quitar de favoritos
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "900", fontSize: "1.5rem" }}>
                    {item.price.toFixed(2)}€
                  </div>
                  <button
                    className="toolbar-btn"
                    style={{ marginTop: "0.8rem", marginRight: "0.6rem" }}
                    onClick={() => onOpenProductDetail(item)}
                  >
                    DETALLES
                  </button>
                  <button
                    className="add-btn"
                    style={{ marginTop: "0.8rem" }}
                    onClick={() => addToCart(item)}
                  >
                    + ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GlobalFooter />
    </div>
  );
};

export default WishlistPage;
