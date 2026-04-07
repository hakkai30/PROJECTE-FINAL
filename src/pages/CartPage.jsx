import { GlobalFooter, GlobalHeader } from "../components/Layout";

const CartPage = ({ changePage, cartItems, cartCount, removeFromCart }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="category-page">
      <GlobalHeader changePage={changePage} cartCount={cartCount} />
      <div className="cart-container">
        <h2 className="cart-title">LA TEVA BOSSA ({cartCount})</h2>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", fontSize: "1.5rem" }}>
            La teva bossa esta buida. <br />
            <br />
            <button
              className="toolbar-btn"
              onClick={() => changePage("products")}
            >
              CONTINUA COMPRANT
            </button>
          </div>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
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
                    <p className="item-meta">Talla: M | Qtat: 1</p>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(index)}
                    >
                      Elimina
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
                Impostos inclosos. Despeses d'enviament calculades al final.
              </p>
              <button className="checkout-btn">PASSA AL PAGAMENT</button>
            </div>
          </div>
        )}
      </div>
      <GlobalFooter />
    </div>
  );
};

export default CartPage;
