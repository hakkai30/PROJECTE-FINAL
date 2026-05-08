import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import LandingPage from "./pages/shop/LandingPage";
import CategoryPage from "./pages/shop/CategoryPage";
import ProductsPage from "./pages/shop/ProductsPage";
import CartPage from "./pages/shop/CartPage";
import WishlistPage from "./pages/shop/WishlistPage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";
import SocialFeedPage from "./pages/social/SocialFeedPage";
import SavedLooksPage from "./pages/social/SavedLooksPage";
import AuthPage from "./pages/shop/AuthPage";
import UserProfilePage from "./pages/social/UserProfilePage";
import NewsPage from "./pages/social/NewsPage";
import Chatbot from "./components/Chatbot";
import { authService } from "./services/authService";
import { postService } from "./services/postService";
import { socialService } from "./services/socialService";
import { productService } from "./services/productService";
import { supabase } from "./config/supabase";

const PROTECTED_PAGES = new Set(["socials", "saved-looks", "user-profile"]);

// Mapa de rutas: asocia cada pantalla lógica con su URL.
const ROUTE_MAP = {
  landing: "/", shop: "/shop", products: "/products",
  men: "/shop/men", women: "/shop/women", kids: "/shop/kids",
  bags: "/shop/bags", accessories: "/shop/accessories", home: "/shop/home",
  cart: "/cart", wishlist: "/wishlist",
  "product-detail": "/products", auth: "/auth",
  socials: "/social", "saved-looks": "/social/saved",
  "user-profile": "/profile", news: "/news",
};

// Convierte la URL del navegador en la pantalla lógica que usa la app.
const resolvePageFromPath = (path) => {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "landing";
  if (segments[0] === "shop") return segments[1] || "shop";
  if (segments[0] === "social") {
    if (segments[1] === "saved") return "saved-looks";
    return "socials";
  }
  if (segments[0] === "profile") return "user-profile";
  if (segments[0] === "product") return "product-detail";
  return segments[0];
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = resolvePageFromPath(location.pathname);

  const setCurrentPage = (page) => {
    const target = ROUTE_MAP[page] || "/";
    navigate(target);
  };

  // Función específica para ir a MI perfil (reseteando el visto)
  const goToMyProfile = () => {
    setViewedUser(null);
    navigate("/profile");
  };

  // Estado principal: se guarda en localStorage para persistir entre recargas.
  const [isGuest, setIsGuest] = useState(() => {
    try { return localStorage.getItem("rtf_is_guest") === "true"; } catch { return false; }
  });
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_cart_items");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });
  const [wishlistIds, setWishlistIds] = useState(() => {
    try { const saved = localStorage.getItem("rtf_wishlist_ids"); return saved ? JSON.parse(saved) : []; } catch { return []; }
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
  const [likedPostIds, setLikedPostIds] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_liked_post_ids");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map((id) => String(id)) : [];
    } catch { return []; }
  });
  const [selectedProductId, setSelectedProductId] = useState(() => {
    try { const saved = localStorage.getItem("rtf_selected_product_id"); return saved ? Number(saved) : null; } catch { return null; }
  });

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const theme = "light";
  const [cartToast, setCartToast] = useState("");
  const [currentUser, setCurrentUser] = useState(() => authService.loadCurrentUser());

  // Aplicar tema visual (claro/oscuro/auto).
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
  }, []);

  // Persistir carrito y wishlist en localStorage.
  useEffect(() => { localStorage.setItem("rtf_cart_items", JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem("rtf_wishlist_ids", JSON.stringify(wishlistIds)); }, [wishlistIds]);
  useEffect(() => { localStorage.setItem("rtf_saved_look_ids", JSON.stringify(savedLookIds)); }, [savedLookIds]);
  useEffect(() => { localStorage.setItem("rtf_liked_post_ids", JSON.stringify(likedPostIds)); }, [likedPostIds]);
  useEffect(() => { if (selectedProductId) localStorage.setItem("rtf_selected_product_id", selectedProductId); }, [selectedProductId]);

  // Carrito: añadir y eliminar productos.
  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setCartToast(`Añadido al carrito: ${product.name}`);
  };
  const removeFromCart = (indexToRemove) => {
    setCartItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Wishlist: alternar un producto como favorito.
  const toggleWishlist = (product) => {
    const productId = typeof product === "object" ? product.id : product;
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Guardar/quitar looks del feed social.
  const toggleSavedLook = async (postId) => {
    const normalizedId = String(postId);
    // Optimistic UI update
    setSavedLookIds((prev) => prev.includes(normalizedId) ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId]);
    try { 
      await socialService.toggleSavedLook(normalizedId); 
    } catch (err) { 
      console.error("Error guardando look:", err);
      // Revert if error
      setSavedLookIds((prev) => prev.includes(normalizedId) ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId]);
    }
  };

  // Abrir detalle de un producto.
  const openProductDetail = (product) => {
    setSelectedProductId(product.id);
    navigate(`/product/${product.id}`);
  };

  // Autenticación: login, registro y logout.
  const handleLogin = async ({ email, password }) => {
    try {
      const { user, error } = await authService.login({ email, password });
      if (error) return { ok: false, error };
      setCurrentUser(user);
      setIsGuest(false);
      localStorage.removeItem("rtf_is_guest");
      const savedIds = await socialService.getSavedLookIds(user.id);
      setSavedLookIds(savedIds);
      navigate("/shop");
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message }; }
  };

  const handleRegister = async ({ name, email, password, bio, avatar }) => {
    try {
      const { user, error } = await authService.register({ name, email, password, bio, avatar });
      if (error) return { ok: false, error };
      setCurrentUser(user);
      setIsGuest(false);
      localStorage.removeItem("rtf_is_guest");
      const savedIds = await socialService.getSavedLookIds(user.id);
      setSavedLookIds(savedIds);
      navigate("/shop");
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message }; }
  };

  const handleLogout = async () => {
    navigate("/auth");
    await authService.logout();
    setCurrentUser(null);
    setIsGuest(false);
    localStorage.removeItem("rtf_is_guest");
  };

  // Carga de productos desde Supabase.
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    const data = await productService.getProducts();
    setProducts(data);
    setIsLoadingProducts(false);
  };

  // Posts sociales: carga, creación, likes y comentarios.
  const loadSocialPosts = async (isMore = false) => {
    if (isLoadingSocialPosts || (!hasMorePosts && isMore)) return;
    setIsLoadingSocialPosts(true);
    try {
      const offset = isMore ? socialPosts.length : 0;
      const newPosts = await postService.getFeedPosts({ limit: 10, offset });
      setSocialPosts((prev) => isMore ? [...prev, ...newPosts] : newPosts);
      setHasMorePosts(newPosts.length === 10);
    } catch (err) { setSocialFeedError(err.message); }
    finally { setIsLoadingSocialPosts(false); }
  };

  const createSocialPost = async ({ text, imageFile }) => {
    if (isCreatingSocialPost) return;
    setIsCreatingSocialPost(true);
    try {
      const post = await postService.createPost({ text, imageFile, user: currentUser?.email || "USER" });
      if (post) setSocialPosts((prev) => [post, ...prev]);
    } catch (err) { setSocialFeedError(err.message); throw err; }
    finally { setIsCreatingSocialPost(false); }
  };

  const toggleSocialLike = async (postId) => {
    const normalizedId = String(postId);
    const isLiked = likedPostIds.includes(normalizedId);
    
    // 1. Actualizar lista de IDs con like
    setLikedPostIds((prev) => isLiked ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId]);
    
    // 2. Actualizar contador en socialPosts para feedback inmediato
    setSocialPosts((prev) => prev.map(p => {
      if (String(p.id) === normalizedId) {
        return { ...p, likes: isLiked ? (p.likes || 1) - 1 : (p.likes || 0) + 1 };
      }
      return p;
    }));

    try { await postService.toggleLikePost(normalizedId); } catch (err) { console.error(err); }
  };

  const addSocialComment = async (postId, text) => {
    try {
      const result = await postService.addCommentToPost(postId, { text, user: currentUser?.email || "USER" });
      if (result?.post) setSocialPosts((prev) => prev.map((p) => String(p.id) === String(postId) ? result.post : p));
    } catch (err) { throw err; }
  };

  const deleteSocialPost = async (postId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return;
    try {
      await postService.deletePost(postId);
      setSocialPosts((prev) => prev.filter((p) => String(p.id) !== String(postId)));
    } catch (err) { console.error("Error eliminando post:", err); }
  };

  const deleteSocialComment = async (postId, commentId) => {
    try {
      const updatedPost = await postService.deleteCommentFromPost(postId, commentId);
      if (updatedPost) setSocialPosts((prev) => prev.map((p) => String(p.id) === String(postId) ? updatedPost : p));
    } catch (err) { console.error("Error eliminando comentario:", err); }
  };

  const [viewedUser, setViewedUser] = useState(null);

  // Abrir el perfil de un usuario desde el feed social.
  const openProfile = async (profile) => {
    const handle = String(profile?.user || profile?.user_email || "").trim();
    if (!handle) return;
    
    setIsLoadingSocialPosts(true);
    try {
      const userData = await socialService.getProfile(handle);
      setViewedUser(userData);
      setCurrentPage("user-profile");
    } catch (err) {
      console.error("Error al cargar perfil:", err);
    } finally {
      setIsLoadingSocialPosts(false);
    }
  };

  const selectedProduct = products.find((p) => String(p.id) === String(selectedProductId));
  const wishlistItems = products.filter((p) => wishlistIds.includes(String(p.id)));

  // Restaurar sesión y pre-cargar datos al iniciar.
  useEffect(() => {
    const initApp = async () => {
      const user = await authService.restoreSession();
      if (user) {
        setCurrentUser(user);
        // Cargar favoritos de la DB
        const savedIds = await socialService.getSavedLookIds(user.id);
        if (savedIds.length > 0) setSavedLookIds(savedIds);
      }
      loadSocialPosts();
      loadProducts();
    };
    initApp();
  }, []);

  // Si se navega a /product/:id directamente, extraer el ID de la URL.
  useEffect(() => {
    if (location.pathname.startsWith("/product/") && !selectedProduct) {
      const idFromPath = Number(location.pathname.split("/")[2]);
      if (idFromPath) setSelectedProductId(idFromPath);
    }
  }, [location.pathname, selectedProduct]);

  // Proteger páginas que requieren login.
  useEffect(() => {
    // Si la página está protegida y NO hay un usuario real logueado, redirigir a Auth.
    // Los invitados (isGuest) tampoco pueden ver el contenido protegido (Social Feed, etc.)
    if (PROTECTED_PAGES.has(currentPage) && !currentUser) {
      navigate("/auth");
    }
  }, [currentPage, currentUser, navigate]);

  // Props comunes que se pasan a casi todas las páginas.
  const commonProps = {
    changePage: setCurrentPage,
    cartCount: cartItems.length,
    cartToast,
    wishlistCount: wishlistIds.length,
    theme,
    currentUser,
    products,
    onLogout: handleLogout,
    onGoToMyProfile: goToMyProfile,
  };

  return (
    <>
      <div key={location.pathname} className="page-transition-wrapper">
        <Routes>
          <Route path="/" element={<LandingPage {...commonProps} />} />
          <Route path="/shop" element={<CategoryPage {...commonProps} />} />
          <Route path="/products" element={<ProductsPage {...commonProps} products={products} addToCart={addToCart} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} onOpenProductDetail={openProductDetail} />} />
          <Route path="/shop/:cat" element={<ProductsPage {...commonProps} products={products} addToCart={addToCart} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} onOpenProductDetail={openProductDetail} />} />
          <Route path="/cart" element={<CartPage {...commonProps} cartItems={cartItems} onOpenProductDetail={openProductDetail} removeFromCart={removeFromCart} />} />
          <Route path="/wishlist" element={<WishlistPage {...commonProps} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} onOpenProductDetail={openProductDetail} />} />
          <Route path="/news" element={<NewsPage {...commonProps} />} />
          <Route path="/auth" element={
            <AuthPage
              onLogin={handleLogin}
              onRegister={handleRegister}
              onContinueAsGuest={() => {
                setIsGuest(true);
                localStorage.setItem("rtf_is_guest", "true");
                navigate("/shop");
              }}
            />
          } />
          <Route path="/product/:id" element={<ProductDetailPage {...commonProps} product={selectedProduct} addToCart={addToCart} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} />} />
          <Route path="/social" element={
            <SocialFeedPage {...commonProps} posts={socialPosts} isLoadingPosts={isLoadingSocialPosts} feedError={socialFeedError} activeView={socialFeedFilter} onViewChange={setSocialFeedFilter} savedLookIds={savedLookIds} likedPostIds={likedPostIds} onToggleSavedLook={toggleSavedLook} onToggleLikePost={toggleSocialLike} onAddComment={addSocialComment} onDeleteComment={deleteSocialComment} loadMorePosts={() => loadSocialPosts(true)} refreshPosts={() => loadSocialPosts(false)} onCreatePost={createSocialPost} onOpenProfile={openProfile} />
          } />
          <Route path="/social/saved" element={<SavedLooksPage {...commonProps} savedLooks={socialPosts} savedLookIds={savedLookIds} likedPostIds={likedPostIds} onToggleSavedLook={toggleSavedLook} onToggleLikePost={toggleSocialLike} onAddComment={addSocialComment} onDeleteComment={deleteSocialComment} />} />
          <Route path="/profile" element={
            <UserProfilePage {...commonProps} posts={socialPosts} viewedUser={viewedUser || currentUser} onDeletePost={deleteSocialPost} onDeleteComment={deleteSocialComment} onUpdateUser={setCurrentUser} />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {!location.pathname.includes("/auth") && (
          <Chatbot currentPage={currentPage} changePage={setCurrentPage} cartCount={cartItems.length} wishlistCount={wishlistIds.length} products={products} socialPosts={socialPosts} savedLookCount={savedLookIds.length} isAuthenticated={Boolean(currentUser)} />
        )}

        {cartToast && <div className="app-toast">{cartToast}</div>}
      </div>
    </>
  );
};

export default App;
