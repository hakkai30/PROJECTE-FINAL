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
import SavedLooksPage from "./pages/SavedLooksPage";
import MessagesPage from "./pages/MessagesPage";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import NewsPage from "./pages/NewsPage";
import { ChatbotWidget } from "./components/Layout";
import { MOCK_PRODUCTS } from "./data/mockData";
import { authService } from "./services/authService";
import { postService } from "./services/postService";
import { socialService } from "./services/socialService";
import { userProductService } from "./services/userProductService";
import { createTranslator, DEFAULT_LANGUAGE, localizePost } from "./data/i18n";

const AVATAR_STYLES = [
  { id: "midnight", label: "MIDNIGHT", from: "#111111", to: "#4a4a4a" },
  { id: "ember", label: "EMBER", from: "#9f1d14", to: "#ff8a3d" },
  { id: "ocean", label: "OCEAN", from: "#0c4a6e", to: "#38bdf8" },
  { id: "forest", label: "FOREST", from: "#14532d", to: "#7ddc8c" },
];

const getInitials = (value) => {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "RT";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const buildAvatar = (seed, style) => {
  const initials = getInitials(seed);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${style.from}" />
          <stop offset="100%" stop-color="${style.to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#g)" />
      <circle cx="80" cy="80" r="58" fill="rgba(255,255,255,0.08)" />
      <text x="80" y="94" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="700" letter-spacing="2" fill="#ffffff">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const detectAvatarStyleId = (seed, avatar) => {
  const normalizedAvatar = String(avatar || "").trim();
  if (!normalizedAvatar) return AVATAR_STYLES[0].id;

  const matchedStyle = AVATAR_STYLES.find((style) => buildAvatar(seed, style) === normalizedAvatar);
  return matchedStyle?.id || AVATAR_STYLES[0].id;
};

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
  "saved-looks",
  "messages",
  "user-profile",
  "news",
]);

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
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      // El usuario comienza en la página de autenticación
      const savedPage = localStorage.getItem("rtf_current_page");
      const currentUser = authService.loadCurrentUser();
      const isGuest = localStorage.getItem("rtf_is_guest") === "true";
      
      // Si no está autenticado y no es invitado, mostrar landing primero (a petición del usuario)
      if (!currentUser && !isGuest) {
        return "landing";
      }
      
      // Si tiene página guardada y es válida, ir allí
      if (savedPage && VALID_PAGES.has(savedPage)) {
        return savedPage;
      }
      
      return "landing";
    } catch {
      return "landing";
    }
  });
  
  const [isGuest, setIsGuest] = useState(() => {
    try {
      return localStorage.getItem("rtf_is_guest") === "true";
    } catch {
      return false;
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
  const [savedLookIds, setSavedLookIds] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_saved_look_ids");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map((id) => String(id)) : [];
    } catch {
      return [];
    }
  });
  const [socialPosts, setSocialPosts] = useState([]);
  const [isLoadingSocialPosts, setIsLoadingSocialPosts] = useState(true);
  const [socialFeedError, setSocialFeedError] = useState("");
  const [isCreatingSocialPost, setIsCreatingSocialPost] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [isLoadingUserProducts, setIsLoadingUserProducts] = useState(true);
  const [pendingContact, setPendingContact] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [followedHandles, setFollowedHandles] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_followed_handles");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map((handle) => String(handle).trim().toLowerCase()).filter(Boolean) : [];
    } catch {
      return [];
    }
  });
  const [likedPostIds, setLikedPostIds] = useState(() => {
    try {
      const saved = localStorage.getItem("rtf_liked_post_ids");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map((id) => String(id)) : [];
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
  const [profileDraftBio, setProfileDraftBio] = useState("");
  const [profileDraftAvatar, setProfileDraftAvatar] = useState("");
  const [profileAvatarStyle, setProfileAvatarStyle] = useState(AVATAR_STYLES[0].id);
  const [profileEditError, setProfileEditError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [pendingProtectedPage, setPendingProtectedPage] = useState("shop");
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

  const toggleSavedLook = (postId) => {
    const normalizedId = String(postId);
    setSavedLookIds((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((id) => id !== normalizedId)
        : [...prev, normalizedId]
    );
  };

  const normalizeHandle = (value) => String(value || "").trim().replace(/^@/, "");

  const getProfileStats = (handle) => {
    const cleanHandle = normalizeHandle(handle);
    const loweredHandle = cleanHandle.toLowerCase();
    const authoredPosts = socialPosts.filter((post) => String(post.user || "").trim().toLowerCase() === loweredHandle);
    const uniqueCommenters = new Set();

    authoredPosts.forEach((post) => {
      (post.comments || []).forEach((comment) => {
        const commenterHandle = String(comment?.user || "").trim().toLowerCase();
        if (commenterHandle && commenterHandle !== loweredHandle) {
          uniqueCommenters.add(commenterHandle);
        }
      });
    });

    const engagementScore = authoredPosts.reduce((score, post) => score + Number(post.likes || 0), 0);
    const followsFromCurrentUser = followedHandles.includes(loweredHandle) ? 1 : 0;
    const followersCount = Math.max(
      0,
      Math.round(engagementScore / 20) + uniqueCommenters.size * 3 + authoredPosts.length * 2 + followsFromCurrentUser
    );
    const followingCount =
      currentUser?.name?.trim().toLowerCase() === loweredHandle
        ? followedHandles.length
        : Math.max(2, authoredPosts.length + Math.min(15, uniqueCommenters.size * 2));

    return {
      authoredPosts,
      followersCount,
      followingCount,
      isFollowing: followedHandles.includes(loweredHandle),
    };
  };

  const loadSocialPosts = async () => {
    setIsLoadingSocialPosts(true);
    setSocialFeedError("");

    try {
      const posts = await postService.getFeedPosts();
      setSocialPosts(posts);
    } catch (error) {
      setSocialFeedError(error.message || "Could not load posts.");
    } finally {
      setIsLoadingSocialPosts(false);
    }
  };

  const loadUserProducts = async () => {
    setIsLoadingUserProducts(true);

    try {
      const products = await userProductService.getAllUserProducts();
      setUserProducts(products);
    } catch (error) {
      console.error("Could not load user products:", error);
    } finally {
      setIsLoadingUserProducts(false);
    }
  };

  const createSocialPost = async ({ text, imageFile }) => {
    if (isCreatingSocialPost) return;
    if (!text?.trim()) return;

    setIsCreatingSocialPost(true);
    setSocialFeedError("");

    try {
      const post = await postService.createPost({
        text,
        imageFile,
        user: currentUser?.email || "USER",
      });

      if (post) {
        setSocialPosts((prev) => [post, ...prev]);
      }
    } catch (error) {
      setSocialFeedError(error.message || "Could not create post.");
      throw error;
    } finally {
      setIsCreatingSocialPost(false);
    }
  };

  const toggleSocialLike = async (postId) => {
    const normalizedId = String(postId);
    const isLiked = likedPostIds.includes(normalizedId);
    const direction = isLiked ? "down" : "up";

    setSocialFeedError("");
    setLikedPostIds((prev) =>
      isLiked ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId]
    );

    setSocialPosts((prev) =>
      prev.map((post) => {
        if (String(post.id) !== normalizedId) return post;
        const nextLikes = isLiked ? Math.max(0, Number(post.likes || 0) - 1) : Number(post.likes || 0) + 1;
        return { ...post, likes: nextLikes };
      })
    );

    try {
      const updatedPost = await postService.toggleLikePost(normalizedId, { direction });
      if (!updatedPost) return;

      setSocialPosts((prev) =>
        prev.map((post) =>
          String(post.id) === normalizedId ? updatedPost : post
        )
      );
    } catch (error) {
      setSocialFeedError(error.message || "Could not update like.");
      setLikedPostIds((prev) =>
        isLiked ? [...prev, normalizedId] : prev.filter((id) => id !== normalizedId)
      );
      setSocialPosts((prev) =>
        prev.map((post) => {
          if (String(post.id) !== normalizedId) return post;
          const rollbackLikes = isLiked ? Number(post.likes || 0) + 1 : Math.max(0, Number(post.likes || 0) - 1);
          return { ...post, likes: rollbackLikes };
        })
      );
    }
  };

  const addSocialComment = async (postId, text) => {
    const normalizedText = String(text || "").trim();
    if (!normalizedText) return;

    const normalizedId = String(postId);
    setSocialFeedError("");

    try {
      const result = await postService.addCommentToPost(normalizedId, {
        text: normalizedText,
        user: currentUser?.name || "USER",
      });

      if (result?.post) {
        setSocialPosts((prev) =>
          prev.map((post) =>
            String(post.id) === normalizedId ? result.post : post
          )
        );
      }
    } catch (error) {
      setSocialFeedError(error.message || "Could not add comment.");
      throw error;
    }
  };

  const deleteSocialComment = async (postId, commentId) => {
    const normalizedId = String(postId);
    const normalizedCommentId = String(commentId);
    if (!normalizedCommentId) return;

    setSocialFeedError("");

    try {
      const updatedPost = await postService.deleteCommentFromPost(normalizedId, normalizedCommentId);

      if (updatedPost) {
        setSocialPosts((prev) =>
          prev.map((post) =>
            String(post.id) === normalizedId ? updatedPost : post
          )
        );
      }
    } catch (error) {
      setSocialFeedError(error.message || "Could not delete comment.");
      throw error;
    }
  };

  const openDirectChatWithPostAuthor = (post) => {
    const handle = String(post?.user || "").trim();
    if (!handle) return;

    setPendingContact({
      id: `user:${handle.toLowerCase()}`,
      handle,
      name: `@${handle}`,
    });
    setPendingProtectedPage("messages");
    setCurrentPage("messages");
  };

  const openProfile = (profile) => {
    const handle = normalizeHandle(profile?.user || profile?.handle || profile?.name || "");
    if (!handle) return;

    const { authoredPosts, followersCount, followingCount, isFollowing } = getProfileStats(handle);
    const isCurrentUser = currentUser?.name?.trim().toLowerCase() === handle.toLowerCase();
    const avatarLabel = String(handle || "USER").slice(0, 2).toUpperCase();

    const selected = {
      handle,
      name: profile?.name || `@${handle}`,
      bio: profile?.bio || (isCurrentUser ? currentUser?.bio || "" : `Creative profile on ROB_THE_FAB.`),
      avatar: profile?.avatar || (isCurrentUser ? currentUser?.avatar || "" : ""),
      email: profile?.email || (isCurrentUser ? currentUser?.email || "" : ""),
      postCount: authoredPosts.length,
      posts: authoredPosts.slice(0, 6),
      followersCount,
      followingCount,
      isFollowing,
      initials: avatarLabel,
      isCurrentUser,
    };

    setSelectedProfile(selected);
    setProfileDraftBio(selected.bio || "");
    setProfileDraftAvatar(selected.avatar || "");
    setProfileAvatarStyle(detectAvatarStyleId(selected.name || selected.handle, selected.avatar));
    setProfileEditError("");

    socialService
      .getProfile(handle)
      .then((remoteProfile) => {
        if (!remoteProfile) return;

        setSelectedProfile((prev) => {
          if (!prev || normalizeHandle(prev.handle) !== normalizeHandle(handle)) return prev;

          const merged = {
            ...prev,
            ...remoteProfile,
            handle: normalizeHandle(remoteProfile.handle || prev.handle),
            posts: Array.isArray(remoteProfile.posts) ? remoteProfile.posts.slice(0, 6) : prev.posts,
            postCount:
              typeof remoteProfile.postCount === "number"
                ? remoteProfile.postCount
                : Array.isArray(remoteProfile.posts)
                ? remoteProfile.posts.length
                : prev.postCount,
            isCurrentUser:
              typeof remoteProfile.isCurrentUser === "boolean"
                ? remoteProfile.isCurrentUser
                : prev.isCurrentUser,
            initials: String(remoteProfile.handle || prev.handle || "USER").slice(0, 2).toUpperCase(),
          };

          if (merged.isCurrentUser) {
            setProfileDraftBio(merged.bio || "");
            setProfileDraftAvatar(merged.avatar || "");
            setProfileAvatarStyle(detectAvatarStyleId(merged.name || merged.handle, merged.avatar));
          }

          return merged;
        });
      })
      .catch(() => {
        // Keep local fallback profile when remote profile lookup is unavailable.
      });
  };

  const toggleFollowProfile = async (handle) => {
    const cleanHandle = normalizeHandle(handle);
    if (!cleanHandle) return;

    const loweredHandle = cleanHandle.toLowerCase();
    if (currentUser?.name?.trim().toLowerCase() === loweredHandle) return;

    const currentlyFollowing = followedHandles.includes(loweredHandle);

    try {
      if (currentlyFollowing) {
        await socialService.unfollowProfile(loweredHandle);
      } else {
        await socialService.followProfile(loweredHandle);
      }
    } catch {
      // Fall back to local social graph behavior when API follow state is unavailable.
    }

    setFollowedHandles((prev) => {
      const isAlreadyFollowing = prev.includes(loweredHandle);
      const nextHandles = isAlreadyFollowing
        ? prev.filter((item) => item !== loweredHandle)
        : [...prev, loweredHandle];

      localStorage.setItem("rtf_followed_handles", JSON.stringify(nextHandles));

      return nextHandles;
    });

    setSelectedProfile((prev) => {
      if (!prev || prev.handle.toLowerCase() !== loweredHandle) return prev;
      const nextIsFollowing = !prev.isFollowing;
      return {
        ...prev,
        isFollowing: nextIsFollowing,
        followersCount: Math.max(0, Number(prev.followersCount || 0) + (nextIsFollowing ? 1 : -1)),
      };
    });
  };

  const closeProfile = () => {
    setSelectedProfile(null);
    setProfileEditError("");
  };

  const saveOwnProfile = async () => {
    if (!selectedProfile?.isCurrentUser || isSavingProfile) return;

    setProfileEditError("");
    setIsSavingProfile(true);

    try {
      const payload = {
        bio: String(profileDraftBio || "").trim(),
        avatar: String(profileDraftAvatar || "").trim(),
      };

      const result = await authService.updateProfile(payload);
      if (!result.ok) {
        setProfileEditError(result.error || t("profile.updateError", "Could not update profile."));
        return;
      }

      setCurrentUser(result.user);
      setSelectedProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          bio: result.user.bio || "",
          avatar: result.user.avatar || "",
          email: result.user.email || prev.email,
        };
      });
    } catch {
      setProfileEditError(t("profile.updateError", "Could not update profile."));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const applyGeneratedProfileAvatar = (styleId) => {
    if (!selectedProfile?.isCurrentUser) return;

    const selectedStyle = AVATAR_STYLES.find((style) => style.id === styleId) || AVATAR_STYLES[0];
    const avatarSeed = selectedProfile.name || selectedProfile.handle || currentUser?.name || "USER";
    const generatedAvatar = buildAvatar(avatarSeed, selectedStyle);

    setProfileAvatarStyle(selectedStyle.id);
    setProfileDraftAvatar(generatedAvatar);
  };

  const clearPendingContact = () => setPendingContact(null);

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
      : "shop";
    setPendingProtectedPage("shop");
    setCurrentPage(targetPage);
  };

  const handleRegister = async ({ name, email, password, bio, avatar }) => {
    const result = await authService.register({ name, email, password, bio, avatar });
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

    setCurrentUser(result.user);
    setIsGuest(false);
    setCurrentPage("shop");
    return result;
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsGuest(false);
    localStorage.removeItem("rtf_is_guest");
    setPendingProtectedPage("shop");
    setCurrentPage("auth");
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem("rtf_is_guest", "true");
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
    localStorage.setItem("rtf_saved_look_ids", JSON.stringify(savedLookIds));
  }, [savedLookIds]);

  useEffect(() => {
    localStorage.setItem("rtf_liked_post_ids", JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  useEffect(() => {
    localStorage.setItem("rtf_followed_handles", JSON.stringify(followedHandles));
  }, [followedHandles]);

  useEffect(() => {
    localStorage.setItem("rtf_cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("rtf_current_page", currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (isGuest) {
      localStorage.setItem("rtf_is_guest", "true");
    } else {
      localStorage.removeItem("rtf_is_guest");
    }
  }, [isGuest]);

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
  const savedLooks = savedLookIds
    .slice()
    .reverse()
    .map((id) => socialPosts.find((post) => String(post.id) === id))
    .filter(Boolean);

  useEffect(() => {
    loadSocialPosts();
  }, []);

  useEffect(() => {
    loadUserProducts();
  }, []);

  // Restaurar sesión de Supabase al cargar la app (solo al inicio)
  useEffect(() => {
    authService.restoreSession().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (currentPage === "product-detail" && !selectedProduct) {
      setCurrentPage("shop");
    }
  }, [currentPage, selectedProduct]);

  useEffect(() => {
    if (PROTECTED_PAGES.has(currentPage) && (!currentUser || isGuest)) {
      setPendingProtectedPage(currentPage);
      setCurrentPage("auth");
    }
  }, [currentPage, currentUser, isGuest]);

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
          currentUser={currentUser}
          userProducts={userProducts}
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
          currentUser={currentUser}
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
          currentUser={currentUser}
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
          currentUser={currentUser}
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
          currentUser={currentUser}
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
          currentUser={currentUser}
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
      {currentPage === "news" && (
        <NewsPage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          wishlistCount={wishlistCount}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}
      {currentPage === "auth" && (
        <AuthPage
          changePage={setCurrentPage}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onContinueAsGuest={handleContinueAsGuest}
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
          posts={socialPosts}
          likedPostIds={likedPostIds}
          onToggleLikePost={toggleSocialLike}
          onAddComment={addSocialComment}
          onDeleteComment={deleteSocialComment}
          onCreatePost={createSocialPost}
          onOpenProfile={openProfile}
          onMessageAuthor={openDirectChatWithPostAuthor}
          isLoadingPosts={isLoadingSocialPosts}
          isPosting={isCreatingSocialPost}
          feedError={socialFeedError}
          savedLookIds={savedLookIds}
          onToggleSavedLook={toggleSavedLook}
          language={language}
          t={t}
        />
      )}
      {currentPage === "saved-looks" && (
        <SavedLooksPage
          changePage={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
          savedLooks={savedLooks}
          likedPostIds={likedPostIds}
          onToggleLikePost={toggleSocialLike}
          onAddComment={addSocialComment}
          onDeleteComment={deleteSocialComment}
          onOpenProfile={openProfile}
          onMessageAuthor={openDirectChatWithPostAuthor}
          feedError={socialFeedError}
          savedLookIds={savedLookIds}
          onToggleSavedLook={toggleSavedLook}
          language={language}
          t={t}
        />
      )}
      {currentPage === "messages" && (
        <MessagesPage
          changePage={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenProfile={openProfile}
          pendingContact={pendingContact}
          onClearPendingContact={clearPendingContact}
          language={language}
          t={t}
        />
      )}
      {currentPage === "user-profile" && currentUser && (
        <UserProfilePage
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          wishlistCount={wishlistCount}
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          t={t}
        />
      )}

      {selectedProfile && (
        <div className="profile-modal-overlay" role="presentation" onClick={closeProfile}>
          <div className="profile-modal" role="dialog" aria-modal="true" aria-label={selectedProfile.name} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="profile-modal-close" onClick={closeProfile}>
              {t("profile.close", "CLOSE")}
            </button>
            <p className="profile-modal-kicker">{t("profile.kicker", "SOCIAL PROFILE")}</p>
            <div className="profile-modal-avatar" aria-hidden="true">
              {selectedProfile.avatar ? (
                <img src={selectedProfile.avatar} alt="" />
              ) : (
                <span>{selectedProfile.initials}</span>
              )}
            </div>
            <h2 className="profile-modal-title">{selectedProfile.name}</h2>
            <p className="profile-modal-handle">@{selectedProfile.handle}</p>
            {selectedProfile.isCurrentUser ? (
              <div className="profile-modal-editor">
                <div className="profile-avatar-picker">
                  <span className="profile-avatar-picker-label">
                    {t("profile.fields.avatarStyle", "AVATAR STYLE")}
                  </span>
                  <div className="profile-avatar-options" role="radiogroup" aria-label={t("profile.fields.avatarStyle", "AVATAR STYLE")}>
                    {AVATAR_STYLES.map((style) => {
                      const previewSrc = buildAvatar(selectedProfile.name || selectedProfile.handle, style);
                      const isActive = profileAvatarStyle === style.id;

                      return (
                        <button
                          key={style.id}
                          type="button"
                          className={`profile-avatar-option${isActive ? " active" : ""}`}
                          onClick={() => applyGeneratedProfileAvatar(style.id)}
                          aria-pressed={isActive}
                          disabled={isSavingProfile}
                        >
                          <img src={previewSrc} alt="" />
                          <span>{style.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label>
                  {t("profile.fields.bio", "BIO")}
                  <textarea
                    value={profileDraftBio}
                    onChange={(event) => setProfileDraftBio(event.target.value)}
                    rows="3"
                    placeholder={t("profile.bioPlaceholder", "Tell the community who you are")}
                    disabled={isSavingProfile}
                  />
                </label>
                <label>
                  {t("profile.fields.avatar", "AVATAR URL")}
                  <input
                    type="url"
                    value={profileDraftAvatar}
                    onChange={(event) => {
                      setProfileDraftAvatar(event.target.value);
                    }}
                    placeholder={t("profile.avatarPlaceholder", "https://...")}
                    disabled={isSavingProfile}
                  />
                </label>
                {profileEditError && <p className="profile-modal-error">{profileEditError}</p>}
              </div>
            ) : (
              <p className="profile-modal-bio">{selectedProfile.bio}</p>
            )}
            <div className="profile-modal-metrics">
              <div className="profile-modal-metric">
                <span className="profile-modal-metric-label">{t("profile.stats.posts", "POSTS")}</span>
                <span className="profile-modal-metric-value">{selectedProfile.postCount}</span>
              </div>
              <div className="profile-modal-metric">
                <span className="profile-modal-metric-label">{t("profile.stats.followers", "FOLLOWERS")}</span>
                <span className="profile-modal-metric-value">{selectedProfile.followersCount}</span>
              </div>
              <div className="profile-modal-metric">
                <span className="profile-modal-metric-label">{t("profile.stats.following", "FOLLOWING")}</span>
                <span className="profile-modal-metric-value">{selectedProfile.followingCount}</span>
              </div>
            </div>
            <div className="profile-modal-stats">
              <span>{t("profile.stats.status", "STATUS")}: {t("messages.statuses.online", "ONLINE")}</span>
              {selectedProfile.email && <span>{t("profile.stats.email", "EMAIL")}: {selectedProfile.email}</span>}
            </div>
            <div className="profile-modal-actions">
              {selectedProfile.isCurrentUser && (
                <button
                  type="button"
                  className="shop-look-btn"
                  onClick={saveOwnProfile}
                  disabled={isSavingProfile}
                >
                  {isSavingProfile
                    ? t("profile.saving", "SAVING...")
                    : t("profile.save", "SAVE PROFILE")}
                </button>
              )}
              <button
                type="button"
                className={`shop-look-btn ${selectedProfile.isFollowing ? "active" : ""}`}
                onClick={() => toggleFollowProfile(selectedProfile.handle)}
                disabled={selectedProfile.isCurrentUser}
              >
                {selectedProfile.isCurrentUser
                  ? t("profile.you", "THIS IS YOU")
                  : selectedProfile.isFollowing
                  ? t("profile.unfollow", "UNFOLLOW")
                  : t("profile.follow", "FOLLOW")}
              </button>
              <button
                type="button"
                className="save-look-btn active"
                onClick={() => { openDirectChatWithPostAuthor({ user: selectedProfile.handle }); closeProfile(); }}
                disabled={selectedProfile.isCurrentUser}
              >
                {t("profile.message", "MESSAGE")}
              </button>
              <button type="button" className="save-look-btn" onClick={closeProfile}>
                {t("profile.done", "DONE")}
              </button>
            </div>
            <div className="profile-modal-posts">
              <h3>{t("profile.postsTitle", "LATEST POSTS")}</h3>
              {selectedProfile.posts?.length ? (
                <div className="profile-modal-post-grid">
                  {selectedProfile.posts.map((post) => {
                    const previewPost = localizePost(post, language);

                    return (
                      <button
                        key={previewPost.id}
                        type="button"
                        className="profile-modal-post"
                        onClick={() => {
                          closeProfile();
                          setCurrentPage("socials");
                        }}
                      >
                        <img src={previewPost.img} alt={previewPost.desc} />
                        <span>{previewPost.desc}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="profile-modal-empty">{t("profile.noPosts", "No posts yet.")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {currentPage !== "landing" &&
        currentPage !== "socials" &&
        currentPage !== "messages" &&
        currentPage !== "auth" && (
        <ChatbotWidget
          t={t}
          currentPage={currentPage}
          changePage={setCurrentPage}
          cartCount={cartItems.length}
          wishlistCount={wishlistCount}
          products={MOCK_PRODUCTS}
          socialPosts={socialPosts}
          savedLookCount={savedLookIds.length}
          isSocialLoading={isLoadingSocialPosts}
          isAuthenticated={Boolean(currentUser)}
        />
      )}

      {cartToast && <div className="app-toast">{cartToast}</div>}
    </div>
  );
};

export default App;
