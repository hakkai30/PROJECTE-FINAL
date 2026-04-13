import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/CategoryPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import SocialFeedPage from "./pages/SocialFeedPage";
import { ChatbotWidget } from "./components/Layout";

const App = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    alert(`Afegit: ${product.name}`);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      {currentPage === "landing" && <LandingPage changePage={setCurrentPage} />}
      {currentPage === "shop" && (
        <CategoryPage changePage={setCurrentPage} cartCount={cartItems.length} />
      )}
      {currentPage === "products" && (
        <ProductsPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          addToCart={addToCart}
        />
      )}
      {currentPage === "cart" && (
        <CartPage
          changePage={setCurrentPage}
          cartItems={cartItems}
          cartCount={cartItems.length}
          removeFromCart={removeFromCart}
        />
      )}
      {currentPage === "socials" && <SocialFeedPage changePage={setCurrentPage} />}

      {currentPage !== "landing" && <ChatbotWidget />}
    </div>
  );
};

export default App;
