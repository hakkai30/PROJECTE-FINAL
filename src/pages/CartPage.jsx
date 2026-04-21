import { GlobalFooter, GlobalHeader } from "../components/Layout";
import { localizeProduct } from "../data/i18n";

const CartPage = ({
  changePage,
  cartItems,
  cartCount,
  wishlistCount,
  removeFromCart,
  onOpenProductDetail,
  theme,
  onToggleTheme,
  language,
  t,
}) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

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
        <h2 className="cart-title">{t("cart.title", "YOUR BAG")} ({cartCount})</h2>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", fontSize: "1.5rem" }}>
            {t("cart.empty", "Your bag is empty.")} <br />
            <br />
            <button
              className="toolbar-btn"
              onClick={() => changePage("products")}
            >
              {t("cart.continue", "CONTINUE SHOPPING")}
            </button>
          </div>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              (() => {
                const localizedItem = localizeProduct(item, language);
                return (
              <div key={`${item.id}-${index}`} className="cart-item">
                <div className="cart-item-details">
                  <img
                    src={localizedItem.img}
                    alt={localizedItem.name}
                    className="cart-item-img"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <p className="item-brand">{localizedItem.brand}</p>
                    <h3 className="item-name">{localizedItem.name}</h3>
                    <p className="item-meta">{t("cart.size", "Size")}: M | {t("cart.quantity", "Qty.")}: 1</p>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(index)}
                    >
                      {t("cart.remove", "Remove")}
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: "900", fontSize: "1.5rem" }}>
                  {item.price.toFixed(2)}€
                </div>
              </div>
                );
              })()
            ))}

            <div className="cart-total-section">
              <h2>{t("cart.total", "TOTAL")}: {total.toFixed(2)}€</h2>
              <p style={{ color: "#666", marginBottom: "2rem" }}>
                {t("cart.taxNotice", "Taxes included. Shipping costs calculated at checkout.")}
              </p>
              <button className="checkout-btn">{t("cart.checkout", "PROCEED TO CHECKOUT")}</button>
            </div>
          </div>
        )}
      </div>
      <GlobalFooter t={t} />
    </div>
  );
};

export default CartPage;
