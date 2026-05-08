import { GlobalFooter, GlobalHeader } from "../../components/Layout";
import { redirectToCheckout } from "../../services/stripe";

const CartPage = ({
  changePage,
  cartItems,
  cartCount,
  wishlistCount,
  removeFromCart,
  onOpenProductDetail,
  theme,
  onToggleTheme,
  currentUser,
  onLogout,
  products = [],
}) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    // No longer localizing items before sending to checkout
    await redirectToCheckout(cartItems);
  };

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
      <div className="cart-container">
        <h2 className="cart-title">TU BOLSA ({cartCount})</h2>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", fontSize: "1.5rem" }}>
            Tu bolsa está vacía. <br />
            <br />
            <button
              className="toolbar-btn"
              onClick={() => changePage("products")}
            >
              CONTINUAR COMPRANDO
            </button>
          </div>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <div className="cart-item-details">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="cart-item-img"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <p className="item-brand">{item.brand}</p>
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-meta">Talla: M | Cant.: 1</p>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: "900", fontSize: "1.5rem" }}>
                  {item.price.toFixed(2)}€
                </div>
              </div>
            ))}

            <div className="cart-total-section">
              <h2>TOTAL: {total.toFixed(2)}€</h2>
              <p style={{ color: "#666", marginBottom: "2rem" }}>
                Impuestos incluidos. Gastos de envío calculados al finalizar.
              </p>
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                IR AL PAGO
              </button>
            </div>
          </div>
        )}
      </div>
      <GlobalFooter />
    </div>
  );
};

export default CartPage;
