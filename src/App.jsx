import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/CategoryPage";
import ProductsPage from "./pages/ProductsPage";
import MenPage from "./pages/MenPage";
import WomenPage from "./pages/WomenPage";
import KidsPage from "./pages/KidsPage";
import BagsPage from "./pages/BagsPage";
import AccessoriesPage from "./pages/AccessoriesPage";
import HomeDecorPage from "./pages/HomeDecorPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SettingsPage from "./pages/SettingsPage";
import SocialFeedPage from "./pages/SocialFeedPage";
import MessagesPage from "./pages/MessagesPage";
import AuthPage from "./pages/AuthPage";
import { ChatbotWidget } from "./components/Layout";
import { MOCK_PRODUCTS } from "./data/mockData";
import { authService } from "./services/authService";
import { createTranslator, DEFAULT_LANGUAGE } from "./data/i18n";

const VALID_PAGES = new Set([
  "landing",
  "shop",
  "products",
  "men",
  "women",
  "kids",
  "bags",
  "accessories",
  "home",
  "cart",
  "wishlist",
  "settings",
  "product-detail",
  "auth",
  "socials",
  "messages",
]);

const PROTECTED_PAGES = new Set(["socials", "messages"]);

const VALID_THEMES = new Set(["auto", "light", "dark"]);
const VALID_LANGUAGES = new Set(["ca", "es", "en", "fr"]);

const normalizeTheme = (value) => {
  if (value === "editorial") return "light";
  if (value === "contrast") return "dark";
  return VALID_THEMES.has(value) ? value : "auto";
};

const normalizeLanguage = (value) => {
  return VALID_LANGUAGES.has(value) ? value : DEFAULT_LANGUAGE;
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const savedPage = localStorage.getItem("rtf_current_page");
      return savedPage && VALID_PAGES.has(savedPage) ? savedPage : "landing";
    } catch {
      return "landing";
    }
  });
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("rtf_cart_items");
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_wishlist_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedProductId, setSelectedProductId] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_selected_product_id");
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("rtf_theme");
      return normalizeTheme(savedTheme);
    } catch {
      return "auto";
    }
  });
  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem("rtf_language");
      return normalizeLanguage(savedLanguage);
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });
  const [cartToast, setCartToast] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
    return authService.loadCurrentUser();
  });
  const [pendingProtectedPage, setPendingProtectedPage] = useState("socials");
  const t = createTranslator(language);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    setCartToast(`${t("cart.toastAdded", "Added to cart:")} ${product.name}`);
  };

  useEffect(() => {
    if (!cartToast) return;

    const timeoutId = setTimeout(() => {
      setCartToast("");
    }, 2200);

    return () => clearTimeout(timeoutId);
  }, [cartToast]);

  const removeFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  const toggleWishlist = (product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const openProductDetail = (product) => {
    setSelectedProductId(product.id);
    setCurrentPage("product-detail");
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "auto") return "light";
      if (prev === "light") return "dark";
      return "auto";
    });
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(normalizeLanguage(nextLanguage));
  };

  const completeProtectedAccess = () => {
    const targetPage = PROTECTED_PAGES.has(pendingProtectedPage)
      ? pendingProtectedPage
      : "socials";
    setPendingProtectedPage("socials");
    setCurrentPage(targetPage);
  };

  const handleRegister = async ({ name, email, password }) => {
    const result = await authService.register({ name, email, password });
    if (!result.ok) return result;

    if (result.offlineFallback) {
      setCartToast(
        t(
          "auth.offlineNotice",
          "Servidor no disponible. Sesion iniciada en modo offline local."
        )
      );
    }

    setCurrentUser(result.user);
    completeProtectedAccess();
    return result;
  };

  const handleLogin = async ({ email, password }) => {
    const result = await authService.login({ email, password });
    if (!result.ok) return result;

    if (result.offlineFallback) {
      setCartToast(
        t(
          "auth.offlineNotice",
          "Servidor no disponible. Sesion iniciada en modo offline local."
        )
      );
    }

    setCurrentUser(result.user);
    completeProtectedAccess();
    return result;
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setPendingProtectedPage("socials");
    setCurrentPage("landing");
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("rtf_wishlist_ids", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem("rtf_cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("rtf_current_page", currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("rtf_theme", theme);
    const resolvedTheme = theme === "auto" ? systemTheme : theme;
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [theme, systemTheme]);

  useEffect(() => {
    localStorage.setItem("rtf_language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (selectedProductId == null) {
      localStorage.removeItem("rtf_selected_product_id");
      return;
    }
    localStorage.setItem("rtf_selected_product_id", String(selectedProductId));
  }, [selectedProductId]);

  const wishlistCount = wishlistIds.length;
  const wishlistItems = wishlistIds
    .slice()
    .reverse()
    .map((id) => MOCK_PRODUCTS.find((product) => product.id === id))
    .filter(Boolean);
  const selectedProduct =
    MOCK_PRODUCTS.find((product) => product.id === selectedProductId) || null;

  useEffect(() => {
    if (currentPage === "product-detail" && !selectedProduct) {
      setCurrentPage("shop");
    }
  }, [currentPage, selectedProduct]);

  useEffect(() => {
    if (PROTECTED_PAGES.has(currentPage) && !currentUser) {
      setPendingProtectedPage(currentPage);
      setCurrentPage("auth");
    }
  }, [currentPage, currentUser]);

  return (
    <div>
      {currentPage === "landing" && (
        <LandingPage changePage={setCurrentPage} language={language} t={t} />
      )}
      {currentPage === "shop" && (
        <CategoryPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          wishlistCount={wishlistCount}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "products" && (
        <ProductsPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          addToCart={addToCart}
          wishlistCount={wishlistCount}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "men" && (
        <MenPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          addToCart={addToCart}
          wishlistCount={wishlistCount}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "women" && (
        <WomenPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          addToCart={addToCart}
          wishlistCount={wishlistCount}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "kids" && (
        <KidsPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          addToCart={addToCart}
          wishlistCount={wishlistCount}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "bags" && (
        <BagsPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          addToCart={addToCart}
          wishlistCount={wishlistCount}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "accessories" && (
        <AccessoriesPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          addToCart={addToCart}
          wishlistCount={wishlistCount}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "home" && (
        <HomeDecorPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          addToCart={addToCart}
          wishlistCount={wishlistCount}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "cart" && (
        <CartPage
          changePage={setCurrentPage}
          cartItems={cartItems}
          cartCount={cartItems.length}
          wishlistCount={wishlistCount}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          removeFromCart={removeFromCart}
          language={language}
          t={t}
        />
      )}
      {currentPage === "wishlist" && (
        <WishlistPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          wishlistCount={wishlistCount}
          wishlistItems={wishlistItems}
          onToggleWishlist={toggleWishlist}
          addToCart={addToCart}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "settings" && (
        <SettingsPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          wishlistCount={wishlistCount}
          theme={theme}
          setTheme={setTheme}
          onToggleTheme={toggleTheme}
          language={language}
          setLanguage={changeLanguage}
          t={t}
        />
      )}
      {currentPage === "auth" && (
        <AuthPage
          changePage={setCurrentPage}
          onLogin={handleLogin}
          onRegister={handleRegister}
          pendingPage={pendingProtectedPage}
          language={language}
          setLanguage={changeLanguage}
          t={t}
        />
      )}
      {currentPage === "product-detail" && selectedProduct && (
        <ProductDetailPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          wishlistCount={wishlistCount}
          product={selectedProduct}
          addToCart={addToCart}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onOpenProductDetail={openProductDetail}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "socials" && (
        <SocialFeedPage
          changePage={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
          language={language}
          t={t}
        />
      )}
      {currentPage === "messages" && (
        <MessagesPage
          changePage={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
          language={language}
          t={t}
        />
      )}

      {currentPage !== "landing" &&
        currentPage !== "socials" &&
        currentPage !== "messages" &&
        currentPage !== "auth" && (
        <ChatbotWidget t={t} />
      )}

      {cartToast && <div className="app-toast">{cartToast}</div>}
    </div>
  );
};

export default App;
