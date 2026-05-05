import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import LandingPage from "./pages/shop/LandingPage";
import CategoryPage from "./pages/shop/CategoryPage";
import ProductsPage from "./pages/shop/ProductsPage";
const MenPage = lazy(() => import("./pages/shop/MenPage"));
const WomenPage = lazy(() => import("./pages/shop/WomenPage"));
const KidsPage = lazy(() => import("./pages/shop/KidsPage"));
const BagsPage = lazy(() => import("./pages/shop/BagsPage"));
const AccessoriesPage = lazy(() => import("./pages/shop/AccessoriesPage"));
const HomeDecorPage = lazy(() => import("./pages/shop/HomeDecorPage"));
const CartPage = lazy(() => import("./pages/shop/CartPage"));
const WishlistPage = lazy(() => import("./pages/shop/WishlistPage"));
const ProductDetailPage = lazy(() => import("./pages/shop/ProductDetailPage"));
const SettingsPage = lazy(() => import("./pages/shop/SettingsPage"));
const SocialFeedPage = lazy(() => import("./pages/social/SocialFeedPage"));
const SavedLooksPage = lazy(() => import("./pages/social/SavedLooksPage"));
const MessagesPage = lazy(() => import("./pages/social/MessagesPage"));
const AuthPage = lazy(() => import("./pages/shop/AuthPage"));
const UserProfilePage = lazy(() => import("./pages/social/UserProfilePage"));
const NewsPage = lazy(() => import("./pages/social/NewsPage"));
import { ChatbotWidget } from "./components/Layout";
import { MOCK_PRODUCTS } from "./data/mockData";
import { authService } from "./services/authService";
import { postService } from "./services/postService";
import { socialService } from "./services/socialService";
import { userProductService } from "./services/userProductService";
import { notificationService } from "./services/notificationService";
import { createTranslator, DEFAULT_LANGUAGE, localizePost } from "./data/i18n";
import { supabase } from "./services/supabase";

const AVATAR_STYLES = [
  { id: "midnight", label: "MIDNIGHT", from: "#111111", to: "#4a4a4a" },
  { id: "ember", label: "EMBER", from: "#9f1d14", to: "#ff8a3d" },
  { id: "ocean", label: "OCEAN", from: "#0c4a6e", to: "#38bdf8" },
  { id: "forest", label: "FOREST", from: "#14532d", to: "#7ddc8c" },
];

const getInitials = (value) => {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "RT";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
};

const buildAvatar = (seed, style) => {
  const initials = getInitials(seed);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-hidden="true"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${style.from}" /><stop offset="100%" stop-color="${style.to}" /></linearGradient></defs><rect width="160" height="160" rx="80" fill="url(#g)" /><circle cx="80" cy="80" r="58" fill="rgba(255,255,255,0.08)" /><text x="80" y="94" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="700" letter-spacing="2" fill="#ffffff">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const detectAvatarStyleId = (seed, avatar) => {
  const normalizedAvatar = String(avatar || "").trim();
  if (!normalizedAvatar) return AVATAR_STYLES[0].id;
  const matchedStyle = AVATAR_STYLES.find((style) => buildAvatar(seed, style) === normalizedAvatar);
  return matchedStyle?.id || AVATAR_STYLES[0].id;
};

const PROTECTED_PAGES = new Set(["socials", "saved-looks", "messages", "user-profile"]);
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
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromPath = (path) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "landing";
    if (segments[0] === "shop") {
      if (segments[1]) return segments[1];
      return "shop";
    }
    if (segments[0] === "social") {
      if (segments[1] === "saved") return "saved-looks";
      if (segments[1] === "messages") return "messages";
      return "socials";
    }
    if (segments[0] === "profile") return "user-profile";
    if (segments[0] === "product") return "product-detail";
    return segments[0];
  };

  const currentPage = getPageFromPath(location.pathname);

  const setCurrentPage = (page) => {
    const routeMap = {
      landing: "/",
      shop: "/shop",
      products: "/products",
      men: "/shop/men",
      women: "/shop/women",
      kids: "/shop/kids",
      bags: "/shop/bags",
      accessories: "/shop/accessories",
      home: "/shop/home",
      cart: "/cart",
      wishlist: "/wishlist",
      settings: "/settings",
      "product-detail": "/products",
      auth: "/auth",
      socials: "/social",
      "saved-looks": "/social/saved",
      messages: "/social/messages",
      "user-profile": "/profile",
      news: "/news",
    };
    const target = routeMap[page] || "/";
    navigate(target);
  };

  const [isGuest, setIsGuest] = useState(() => {
    try { return localStorage.getItem("rtf_is_guest") === "true"; } catch { return false; }
  });
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("rtf_cart_items");
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_wishlist_ids");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [savedLookIds, setSavedLookIds] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_saved_look_ids");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map((id) => String(id)) : [];
    } catch { return []; }
  });
  const [socialPosts, setSocialPosts] = useState([]);
  const [isLoadingSocialPosts, setIsLoadingSocialPosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [socialFeedFilter, setSocialFeedFilter] = useState("all");
  const [socialFeedError, setSocialFeedError] = useState("");
  const [isCreatingSocialPost, setIsCreatingSocialPost] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [pendingContact, setPendingContact] = useState(null);
  const [followedHandles, setFollowedHandles] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_followed_handles");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map((h) => String(h).trim().toLowerCase()).filter(Boolean) : [];
    } catch { return []; }
  });
  const [likedPostIds, setLikedPostIds] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_liked_post_ids");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map((id) => String(id)) : [];
    } catch { return []; }
  });
  const [selectedProductId, setSelectedProductId] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_selected_product_id");
      return saved ? Number(saved) : null;
    } catch { return null; }
  });
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("rtf_theme");
      return normalizeTheme(savedTheme);
    } catch { return "auto"; }
  });
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem("rtf_language");
      return normalizeLanguage(savedLanguage);
    } catch { return DEFAULT_LANGUAGE; }
  });
  const [cartToast, setCartToast] = useState("");
  const [currentUser, setCurrentUser] = useState(() => authService.loadCurrentUser());
  const [pendingProtectedPage, setPendingProtectedPage] = useState("shop");
  const t = createTranslator(language);

  const syncUserAppData = async (updates) => {
    if (!currentUser?.id) return;
    try {
      await supabase.from('users').update(updates).eq('id', currentUser.id);
    } catch (e) { console.warn("Could not sync app data:", e); }
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const next = [...prev, product];
      if (currentUser?.id) syncUserAppData({ cart_items: next });
      return next;
    });
    setCartToast(`${t("cart.toastAdded", "Added to cart:")} ${product.name}`);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems((prev) => {
      const next = prev.filter((_, index) => index !== indexToRemove);
      if (currentUser?.id) syncUserAppData({ cart_items: next });
      return next;
    });
  };

  const toggleWishlist = (product) => {
    const productId = typeof product === 'object' ? product.id : product;
    setWishlistIds((prev) => {
      const isWishlisted = prev.includes(productId);
      const next = isWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (currentUser?.id) syncUserAppData({ wishlist_ids: next });
      return next;
    });
  };

  const toggleSavedLook = async (postId) => {
    const normalizedId = String(postId);
    setSavedLookIds((prev) => prev.includes(normalizedId) ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId]);
    try { await socialService.toggleSavedLook(normalizedId); } catch (err) { console.error("Error persisting saved look:", err); }
  };

  const openProductDetail = (product) => {
    setSelectedProductId(product.id);
    navigate(`/product/${product.id}`);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "auto") return "light";
      if (prev === "light") return "dark";
      return "auto";
    });
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsGuest(false);
    localStorage.removeItem("rtf_is_guest");
    navigate("/auth");
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
      setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
    } catch (e) { console.error("Could not mark as read", e); }
  };

  const selectedProduct = MOCK_PRODUCTS.find(p => p.id === selectedProductId);
  const wishlistItems = MOCK_PRODUCTS.filter(p => wishlistIds.includes(p.id));

  // Auto-restore Supabase session
  useEffect(() => {
    authService.restoreSession().then((user) => { if (user) setCurrentUser(user); });
  }, []);

  // Redirect if product-detail but no product
  useEffect(() => {
    if (location.pathname.startsWith("/product/") && !selectedProduct) {
      const idFromPath = Number(location.pathname.split("/")[2]);
      if (idFromPath) setSelectedProductId(idFromPath);
    }
  }, [location.pathname, selectedProduct]);

  useEffect(() => {
    if (PROTECTED_PAGES.has(currentPage) && (!currentUser || isGuest)) {
      setPendingProtectedPage(currentPage);
      navigate("/auth");
    }
  }, [currentPage, currentUser, isGuest]);

  return (
    <Suspense fallback={<div className="loading">Cargando...</div>}>
      <div key={location.pathname} className="page-transition-wrapper">
        <Routes>
          <Route path="/" element={<LandingPage changePage={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} language={language} t={t} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} />} />
          <Route path="/shop" element={<CategoryPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/products" element={<ProductsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} addToCart={addToCart} wishlistCount={wishlistIds.length} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onOpenProductDetail={openProductDetail} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/shop/men" element={<ProductsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} addToCart={addToCart} wishlistCount={wishlistIds.length} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onOpenProductDetail={openProductDetail} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/shop/women" element={<ProductsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} addToCart={addToCart} wishlistCount={wishlistIds.length} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onOpenProductDetail={openProductDetail} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/shop/kids" element={<ProductsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} addToCart={addToCart} wishlistCount={wishlistIds.length} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onOpenProductDetail={openProductDetail} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/shop/bags" element={<ProductsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} addToCart={addToCart} wishlistCount={wishlistIds.length} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onOpenProductDetail={openProductDetail} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/shop/accessories" element={<ProductsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} addToCart={addToCart} wishlistCount={wishlistIds.length} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onOpenProductDetail={openProductDetail} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/shop/home" element={<ProductsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} addToCart={addToCart} wishlistCount={wishlistIds.length} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onOpenProductDetail={openProductDetail} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/cart" element={<CartPage changePage={setCurrentPage} cartItems={cartItems} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} onOpenProductDetail={openProductDetail} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onRemoveFromCart={removeFromCart} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/wishlist" element={<WishlistPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} onOpenProductDetail={openProductDetail} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/settings" element={<SettingsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} t={t} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/news" element={<NewsPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/auth" element={<AuthPage changePage={setCurrentPage} onLoginSuccess={(user) => { setCurrentUser(user); navigate("/shop"); }} onGuestAccess={() => { setIsGuest(true); localStorage.setItem("rtf_is_guest", "true"); navigate("/shop"); }} t={t} />} />
          <Route path="/product/:id" element={<ProductDetailPage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} product={selectedProduct} addToCart={addToCart} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/social" element={<SocialFeedPage changePage={setCurrentPage} onOpenProductDetail={openProductDetail} posts={socialPosts} isLoadingPosts={isLoadingSocialPosts} feedError={socialFeedError} activeView={socialFeedFilter} onViewChange={setSocialFeedFilter} savedLookIds={savedLookIds} onToggleSavedLook={toggleSavedLook} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/social/saved" element={<SavedLooksPage changePage={setCurrentPage} posts={socialPosts} savedLookIds={savedLookIds} onToggleSavedLook={toggleSavedLook} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/social/messages" element={<MessagesPage changePage={setCurrentPage} pendingContact={pendingContact} onClearPendingContact={clearPendingContact} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/profile" element={<UserProfilePage changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} language={language} onChangeLanguage={setLanguage} t={t} posts={socialPosts} notifications={notifications} unreadNotificationsCount={unreadNotificationsCount} onMarkNotificationRead={markNotificationAsRead} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {currentPage !== "landing" && currentPage !== "socials" && currentPage !== "messages" && currentPage !== "auth" && (
          <ChatbotWidget t={t} currentPage={currentPage} changePage={setCurrentPage} cartCount={cartItems.length} cartToast={cartToast} wishlistCount={wishlistIds.length} products={MOCK_PRODUCTS} socialPosts={socialPosts} savedLookCount={savedLookIds.length} isSocialLoading={isLoadingSocialPosts} isAuthenticated={Boolean(currentUser)} />
        )}

        {cartToast && <div className="app-toast">{cartToast}</div>}
      </div>
    </Suspense>
  );
};

export default App;
