import { GlobalFooter, GlobalHeader } from "../components/Layout";
import { localizeProduct } from "../data/i18n";

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
  language,
  t,
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
        language={language}
        t={t}
      />

      <div className="cart-container">
        <h2 className="cart-title">{t("wishlist.title", "WISHLIST")} ({wishlistCount})</h2>

        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", fontSize: "1.3rem" }}>
            {t("wishlist.empty", "You do not have any saved favorites yet.")}
            <br />
            <br />
            <button className="toolbar-btn" onClick={() => changePage("shop")}>
              {t("wishlist.discover", "DISCOVER PRODUCTS")}
            </button>
          </div>
        ) : (
          <div>
            {wishlistItems.map((item) => (
              (() => {
                const localizedItem = localizeProduct(item, language);
                return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <img
                    src={localizedItem.img}
                    alt={localizedItem.name}
                    className="cart-item-img"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <p className="item-brand">{localizedItem.brand}</p>
                    <button className="item-name item-name-btn" onClick={() => onOpenProductDetail(item)}>
                      {localizedItem.name}
                    </button>
                    <p className="item-meta">{t("wishlist.category", "Category")}: {item.category.toUpperCase()}</p>
                    <button className="remove-btn" onClick={() => onToggleWishlist(item)}>
                      {t("wishlist.remove", "Remove from favorites")}
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
                    {t("wishlist.detail", "DETAIL")}
                  </button>
                  <button
                    className="add-btn"
                    style={{ marginTop: "0.8rem" }}
                    onClick={() => addToCart(item)}
                  >
                    {t("wishlist.addToBag", "+ ADD")}
                  </button>
                </div>
              </div>
                );
              })()
            ))}
          </div>
        )}
      </div>

      <GlobalFooter t={t} />
    </div>
  );
};

export default WishlistPage;
