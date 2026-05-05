import { useEffect, useMemo, useRef, useState } from "react";
import FocusTrap from "focus-trap-react";
import { X, Search, Menu, ShoppingBag, Heart, Send, Palette, History, Plus, Newspaper, User, ChevronRight, ChevronLeft, MessageSquare, Bookmark, ShoppingCart } from "lucide-react";
import { MOCK_PRODUCTS } from "../data/mockData";
import { LANGUAGE_OPTIONS, getLanguageLabel } from "../data/i18n";
import { localizeProduct } from "../data/i18n";
import OptimizedImage from "./OptimizedImage";

export const WindowOverlay = ({ label, offsetClass, article }) => {
  const [isVisible, setIsVisible] = useState(true);
  const closeWindow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`window-frame ${offsetClass}`} style={{ pointerEvents: "auto" }}>
      <div className="window-header">
        <span className="window-label">{article ? "NEWS" : `LOOK ${label}`}</span>
        <div className="window-actions">
            <button type="button" className="window-action window-action-close" onClick={closeWindow} aria-label="Close window">
              ×
            </button>
        </div>
      </div>
        {article ? (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="window-body" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", cursor: "pointer" }}>
          <div className="window-url">{article.source.name.substring(0, 20)}</div>
          <div className="window-preview" style={{ padding: 0, gap: 0, overflow: "hidden" }}>
            <OptimizedImage src={article.image || "https://via.placeholder.com/150?w=400&q=80"} alt={article.title || "Noticia"} loading="lazy" decoding="async" width={400} height={80} sizes="(max-width:400px) 100vw, 400px" style={{ width: "100%", height: "80px", objectFit: "cover" }} />
            <div style={{ padding: "4px", fontSize: "0.55rem", fontWeight: "bold", color: "#333" }}>
              {article.title.length > 50 ? article.title.substring(0, 50) + "..." : article.title}
            </div>
          </div>
          <div className="window-status">
            <span className="window-status-dot" />
            BREAKING
          </div>
        </a>
      ) : (
        <div className="window-body">
          <div className="window-url">robthefab.local/look/{label.toLowerCase()}</div>
          <div className="window-preview">
            <div className="window-preview-hero" />
            <div className="window-preview-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="window-status">
            <span className="window-status-dot" />
            LIVE
          </div>
        </div>
      )}
    </div>
  );
};

export const LanguageSwitcher = ({ language, onChangeLanguage, t }) => {
  return (
    <div className="language-switcher" aria-label={t("language.label", "Language")}>
      <span>{t("language.label", "Language")}</span>
      <select value={language} onChange={(event) => onChangeLanguage(event.target.value)}>
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {getLanguageLabel(option.code)}
          </option>
        ))}
      </select>
    </div>
  );
};

export const SocialSidebar = ({ isSidebarOpen, setIsSidebarOpen, changePage, t }) => {
  return (
    <aside className={`social-side-nav ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
      <button 
        type="button" 
        className="side-nav-toggle" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <nav className="side-nav-content">
        <button 
          type="button" 
          className="side-nav-item" 
          onClick={() => changePage("shop")}
          title={t("nav.shop", "SHOP")}
        >
          <ShoppingCart size={20} />
          {isSidebarOpen && <span>{t("nav.shop", "SHOP")}</span>}
        </button>

        <button 
          type="button" 
          className="side-nav-item" 
          onClick={() => changePage("news")}
          title={t("nav.news", "FASHION NEWS")}
        >
          <Newspaper size={20} />
          {isSidebarOpen && <span>{t("nav.news", "FASHION NEWS")}</span>}
        </button>
        
        <button 
          type="button" 
          className="side-nav-item" 
          onClick={() => changePage("messages")}
          title={t("social.sidebar.messages", "MESSAGES")}
        >
          <MessageSquare size={20} />
          {isSidebarOpen && <span>{t("social.sidebar.messages", "MESSAGES")}</span>}
        </button>

        <button 
          type="button" 
          className="side-nav-item" 
          onClick={() => changePage("saved-looks")}
          title={t("social.sidebar.savedLooks", "SAVED LOOKS")}
        >
          <Bookmark size={20} />
          {isSidebarOpen && <span>{t("social.sidebar.savedLooks", "SAVED LOOKS")}</span>}
        </button>

        <button 
          type="button" 
          className="side-nav-item" 
          onClick={() => changePage("user-profile")}
          title={t("nav.profile", "MY PROFILE")}
        >
          <User size={20} />
          {isSidebarOpen && <span>{t("nav.profile", "MY PROFILE")}</span>}
        </button>
      </nav>
    </aside>
  );
};

export const GlobalHeader = ({
  changePage,
  cartCount,
  wishlistCount = 0,
  currentUser = null,
  onLogout = null,
  onOpenProductDetail = null,
  language = "ca",
  t,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeResultIndex, setActiveResultIndex] = useState(-1);

  const normalizedTerm = searchTerm.trim().toLowerCase();
  const searchResults = normalizedTerm
    ? MOCK_PRODUCTS.filter(
        (product) =>
          localizeProduct(product, language).name.toLowerCase().includes(normalizedTerm) ||
          product.brand.toLowerCase().includes(normalizedTerm) ||
          product.category.toLowerCase().includes(normalizedTerm)
      ).slice(0, 6)
    : [];

  const quickSearches = ["Jaqueta", "Bandolera", "Cadena", "Home"];

  useEffect(() => {
    setActiveResultIndex(-1);
  }, [searchTerm, isSearchOpen]);

  const handleResultOpen = (product) => {
    if (onOpenProductDetail) {
      onOpenProductDetail(product);
    } else {
      changePage(product.category);
    }
    setIsSearchOpen(false);
    setSearchTerm("");
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="main-header">
        <div className="header-left-controls">
          <button 
            className="burger-menu-btn header-icon-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label={t("header.menu", "MENU")}
            title={t("header.menu", "MENU")}
          >
            <Menu size={18} />
          </button>
          
          {/* Menú lateral (Sidebar) */}
          {isMenuOpen && (
            <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}>
              <FocusTrap active={isMenuOpen} focusTrapOptions={{ clickOutsideDeactivates: true }}>
                <div className="sidebar-menu" role="dialog" aria-modal="true" aria-label={t("nav.sidebar", "Main menu")} onClick={(e) => e.stopPropagation()} tabIndex={-1}>
                <div className="sidebar-intro">
                  <p className="sidebar-kicker">{t("nav.explore", "EXPLORE")}</p>
                  <p className="sidebar-note">
                    {t("nav.sidebarNote", "Move through the catalog, social feed, and account settings.")}
                  </p>
                </div>

                <div className="sidebar-header">
                  <button type="button" onClick={() => setIsMenuOpen(false)}>
                    <X size={16} /> {t("header.close", "CLOSE")}
                  </button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}>
                    <Search size={16} /> {t("header.search", "SEARCH")}
                  </button>
                </div>

                <div className="sidebar-nav-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("landing"); }}>{t("nav.home", "HOME")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("men"); }}>{t("nav.men", "MEN")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("women"); }}>{t("nav.women", "WOMEN")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("kids"); }}>{t("nav.kids", "KIDS")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("bags"); }}>{t("nav.bags", "BAGS")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("accessories"); }}>{t("nav.accessories", "ACCESSORIES")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("home"); }}>{t("nav.homeDecor", "HOME")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("news"); }}>{t("nav.news", "FASHION NEWS")}</button>
                </div>

                <div className="sidebar-nav-group">  
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("socials"); }}>{t("nav.socials", "SOCIAL FEED")}</button>
                  {currentUser && (
                    <button type="button" onClick={() => { setIsMenuOpen(false); changePage("user-profile"); }}>{t("nav.myStore", "MY STORE / SELL")}</button>
                  )}
                </div>

                <div className="sidebar-nav-group bottom-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("wishlist"); }}>
                    {t("nav.wishlist", "WISHLIST")} [ {wishlistCount} ]
                  </button>
                  {currentUser ? (
                    <>
                      <button type="button" onClick={() => { setIsMenuOpen(false); changePage("user-profile"); }}>
                        {t("nav.profile", "MY PROFILE")}
                      </button>
                      <button 
                        type="button" 
                        className="sidebar-logout-btn" 
                        onClick={() => { 
                          setIsMenuOpen(false); 
                          if (onLogout) onLogout(); 
                        }}
                      >
                        {t("nav.logout", "LOG OUT")}
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      className="sidebar-login-btn"
                      onClick={() => { setIsMenuOpen(false); changePage("auth"); }}
                    >
                      {t("auth.submit.loginRegister", "INICIA SESSIÓ / REGISTRAR-SE")}
                    </button>
                  )}
                  <button
                    type="button"
                    className="settings-menu-btn"
                    onClick={() => { setIsMenuOpen(false); changePage("settings"); }}
                  >
                    <Palette size={14} /> {t("nav.settings", "SETTINGS")}
                  </button>
                  <button type="button">{t("header.currency", "SPAIN / EUR")}</button>
                </div>
                </div>
              </FocusTrap>
            </div>
          )}
        </div>

        <div className="logo-center-header" onClick={() => changePage("shop")} role="button" tabIndex={0}>
          <span className="logo-center-title">ROB THE FAB</span>
          <span className="logo-center-subtitle">CURATED LOOKS</span>
        </div>
        
        <div className="header-actions">
          <button
            className="header-icon-btn"
            onClick={() => setIsSearchOpen(true)}
            aria-label={t("header.search", "SEARCH")}
            title={t("header.search", "SEARCH")}
          >
            <Search size={18} />
          </button>
          <button
            className="header-icon-btn"
            onClick={() => changePage("wishlist")}
            aria-label={`${t("nav.wishlist", "WISHLIST")} (${wishlistCount})`}
            title={`${t("nav.wishlist", "WISHLIST")} (${wishlistCount})`}
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="header-icon-badge" aria-hidden="true">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </button>
          <button
            className="header-icon-btn"
            onClick={() => changePage("cart")}
            aria-label={`${t("header.bag", "BAG")} (${cartCount})`}
            title={`${t("header.bag", "BAG")} (${cartCount})`}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="header-icon-badge" aria-hidden="true">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* OVERLAY DE BÚSQUEDA A PANTALLA COMPLETA */}
      {isSearchOpen && (
        <div className="search-fullscreen-overlay" role="dialog" aria-modal="true" aria-label={t("header.search", "SEARCH")}>
          <FocusTrap active={isSearchOpen} focusTrapOptions={{ clickOutsideDeactivates: true }}>
          <button
            className="close-search-btn"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchTerm("");
            }}
          >
            <X size={32} />
          </button>
          <div className="search-content">
            <input
              type="text"
              placeholder={t("header.typeToSearch", "TYPE TO SEARCH...")}
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && searchResults.length > 0) {
                  e.preventDefault();
                  setActiveResultIndex((prev) =>
                    prev < searchResults.length - 1 ? prev + 1 : 0
                  );
                }

                if (e.key === "ArrowUp" && searchResults.length > 0) {
                  e.preventDefault();
                  setActiveResultIndex((prev) =>
                    prev <= 0 ? searchResults.length - 1 : prev - 1
                  );
                }

                if (e.key === "Enter" && searchResults.length > 0) {
                  const indexToOpen = activeResultIndex >= 0 ? activeResultIndex : 0;
                  handleResultOpen(searchResults[indexToOpen]);
                }
              }}
            />

            {!normalizedTerm && (
              <div className="search-suggestions">
                <p>{t("header.popularSearches", "POPULAR SEARCHES")}</p>
                <div className="suggestion-tags">
                  {quickSearches.map((term) => (
                    <button key={term} onClick={() => setSearchTerm(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {normalizedTerm && (
              <div className="search-results-list">
                {searchResults.map((product, index) => (
                  <button
                    key={product.id}
                    className={`search-result-item ${index === activeResultIndex ? "active" : ""}`}
                    onClick={() => handleResultOpen(product)}
                    onMouseEnter={() => setActiveResultIndex(index)}
                  >
                    <OptimizedImage src={product.img} alt={localizeProduct(product, language).name} className="search-result-thumb" loading="lazy" decoding="async" width={56} height={56} sizes="56px" />
                    <div className="search-result-texts">
                      <span>{localizeProduct(product, language).name}</span>
                      <small>
                        {product.brand} / {product.category.toUpperCase()} / {product.price.toFixed(2)}€
                      </small>
                    </div>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <p className="search-no-results">{t("header.noResults", "No results found for this search.")}</p>
                )}
              </div>
            )}
          </div>
          </FocusTrap>
        </div>
      )}
    </>
  );
};

export const GlobalFooter = ({ t }) => (
  <footer className="main-app-footer">
    <div className="footer-column">
      <h3>{t("footer.guideTitle", "SHOPPING GUIDE")}</h3>
      <ul>
        {t("footer.guide", []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    <div className="footer-column">
      <h3>{t("footer.membersTitle", "MEMBERS")}</h3>
      <ul>
        {t("footer.members", []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    <div className="footer-column">
      <h3>{t("footer.aboutTitle", "ABOUT US")}</h3>
      <ul>
        {t("footer.about", []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </footer>
);

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value = "") => {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2);
};

const OFF_SCOPE_TERMS = [
  "tiempo",
  "clima",
  "deporte",
  "politica",
  "historia",
  "programacion",
  "codigo",
  "musica",
  "cine",
  "medicina",
  "finanzas",
  "bitcoin",
  "noticias",
  "receta",
  "futbol",
  "basket",
  "cricket",
  "travel",
  "horoscopo",
];

const CATEGORY_LABEL_KEYS = {
  men: "nav.men",
  women: "nav.women",
  kids: "nav.kids",
  bags: "nav.bags",
  accessories: "nav.accessories",
  home: "nav.homeDecor",
};

const CATEGORY_ALIASES = {
  men: ["hombre", "men", "masculino", "caballero"],
  women: ["mujer", "women", "femenino", "dama"],
  kids: ["kids", "ninos", "nino", "infantil", "junior"],
  bags: ["bolso", "bolsos", "bag", "bags", "bandolera", "tote"],
  accessories: ["accesorio", "accesorios", "accessories", "cinturon", "cadena"],
  home: ["home", "hogar", "casa", "decoracion"],
};

const CHATBOT_SESSIONS_KEY = "rtf_chatbot_sessions";
const CHATBOT_ACTIVE_SESSION_KEY = "rtf_chatbot_active_session_id";
const MAX_CHAT_SESSIONS = 15;

const createSessionId = () => `rtf-chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createChatSession = (introMessage, title = "Nueva consulta") => {
  const timestamp = new Date().toISOString();

  return {
    id: createSessionId(),
    title,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: [{ sender: "ai", text: introMessage }],
    showTopicSelector: true,
    pendingSuggestion: null,
  };
};

const hasAny = (text, terms) => terms.some((term) => text.includes(term));

const asCurrency = (value) => `${Number(value || 0).toFixed(2)}EUR`;

const toSessionTitle = (question) => {
  const compact = String(question || "").replace(/\s+/g, " ").trim();
  if (!compact) return "Nueva consulta";
  return compact.length > 42 ? `${compact.slice(0, 42)}...` : compact;
};

export const ChatbotWidget = ({
  t = (_key, fallback) => fallback || "",
  currentPage = "shop",
  changePage,
  cartCount = 0,
  wishlistCount = 0,
  products = MOCK_PRODUCTS,
  socialPosts = [],
  savedLookCount = 0,
  isSocialLoading = false,
  isAuthenticated = false,
}) => {
  const introMessage = t(
    "chatbot.greeting",
    "Thank you for visiting ROB THE FAB. Please select the nature of your inquiry from the options below."
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState(() => {
    try {
      const raw = localStorage.getItem(CHATBOT_SESSIONS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [createChatSession(introMessage, "Consulta 1")];
      }

      return parsed
        .filter((session) => session && session.id)
        .map((session) => ({
          id: session.id,
          title: session.title || "Consulta",
          createdAt: session.createdAt || new Date().toISOString(),
          updatedAt: session.updatedAt || new Date().toISOString(),
          messages: Array.isArray(session.messages) && session.messages.length > 0
            ? session.messages
            : [{ sender: "ai", text: introMessage }],
          showTopicSelector: Boolean(session.showTopicSelector),
          pendingSuggestion: session.pendingSuggestion || null,
        }));
    } catch {
      return [createChatSession(introMessage, "Consulta 1")];
    }
  });
  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      return localStorage.getItem(CHATBOT_ACTIVE_SESSION_KEY) || "";
    } catch {
      return "";
    }
  });
  const messagesRef = useRef(null);

  const activeSession = useMemo(() => {
    if (!chatSessions.length) return null;
    return (
      chatSessions.find((session) => session.id === activeSessionId) ||
      chatSessions[0]
    );
  }, [activeSessionId, chatSessions]);

  const pendingSuggestion = activeSession?.pendingSuggestion || null;
  const messages = activeSession?.messages || [{ sender: "ai", text: introMessage }];
  const showTopicSelector = activeSession?.showTopicSelector ?? true;

  const scopeRefusal = t(
    "chatbot.outOfScope",
    "Informacion no disponible en los registros de archivo."
  );

  useEffect(() => {
    if (!chatSessions.length) return;
    if (activeSessionId) {
      const exists = chatSessions.some((session) => session.id === activeSessionId);
      if (exists) return;
    }

    setActiveSessionId(chatSessions[0].id);
  }, [activeSessionId, chatSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(CHATBOT_SESSIONS_KEY, JSON.stringify(chatSessions));
      if (activeSession?.id) {
        localStorage.setItem(CHATBOT_ACTIVE_SESSION_KEY, activeSession.id);
      }
    } catch {
      // Ignore storage errors; chat still works in-memory.
    }
  }, [activeSession?.id, chatSessions]);

  const updateSession = (sessionId, updater) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        const updated = updater(session);
        return {
          ...updated,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const startNewConversation = () => {
    const nextCount = chatSessions.length + 1;
    const nextSession = createChatSession(introMessage, `Consulta ${nextCount}`);

    setChatSessions((prev) => [nextSession, ...prev].slice(0, MAX_CHAT_SESSIONS));
    setActiveSessionId(nextSession.id);
    setIsHistoryOpen(false);
    setInput("");
    setIsTyping(false);
    setIsOpen(true);
  };

  const openChatbot = () => {
    setIsOpen(true);
    if (!chatSessions.length) {
      startNewConversation();
    }
  };

  const topicOptions = useMemo(
    () => [
      {
        id: "products",
        label: t("chatbot.topicProducts", "Products (Stock, Restocks, and Store Inventory)"),
        prompt: "Quiero informacion de productos y stock del catalogo",
      },
      {
        id: "orders",
        label: t("chatbot.topicOrders", "About Orders (Shipping, Order Details, etc.)"),
        prompt: "Necesito ayuda sobre pedidos, envio y carrito",
      },
      {
        id: "returns",
        label: t("chatbot.topicReturns", "Returns/Exchanges"),
        prompt: "Necesito informacion de devoluciones o cambios",
      },
      {
        id: "social",
        label: t("chatbot.topicSocial", "Social Feed"),
        prompt: "Quiero informacion de la red social, posts, likes y saved looks",
      },
      {
        id: "other",
        label: t("chatbot.topicOther", "Other"),
        prompt: "Tengo otra consulta sobre la funcionalidad de la web",
      },
      {
        id: "ask-ai",
        label: t("chatbot.topicAsk", "Ask the AI"),
        prompt: null,
      },
    ],
    [t]
  );

  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = String(product?.category || "").toLowerCase();
      if (!category) return acc;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const productStats = useMemo(() => {
    const byCategory = Object.keys(CATEGORY_ALIASES).reduce((acc, key) => {
      const list = products.filter((product) => String(product.category).toLowerCase() === key);
      const total = list.length;
      const avgPrice = total
        ? list.reduce((sum, product) => sum + Number(product.price || 0), 0) / total
        : 0;

      acc[key] = {
        total,
        avgPrice,
      };
      return acc;
    }, {});

    const allPrices = products.map((product) => Number(product.price || 0));
    const avgPriceGlobal =
      allPrices.length > 0
        ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
        : 0;

    const sortedByPrice = products
      .slice()
      .sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

    const brandMap = products.reduce((acc, product) => {
      const brand = String(product.brand || "Sin marca").trim();
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {});

    const colorSet = new Set(products.map((product) => String(product.color || "").toLowerCase()).filter(Boolean));
    const sizeSet = new Set(
      products.flatMap((product) =>
        Array.isArray(product.sizes)
          ? product.sizes.map((size) => String(size).toUpperCase())
          : []
      )
    );

    const oneSizeCount = products.filter((product) =>
      Array.isArray(product.sizes) && product.sizes.some((size) => String(size).toUpperCase() === "ONE SIZE")
    ).length;

    return {
      byCategory,
      avgPriceGlobal,
      cheapest: sortedByPrice[0] || null,
      mostExpensive: sortedByPrice[sortedByPrice.length - 1] || null,
      brandMap,
      brandNames: Object.keys(brandMap).sort(),
      colorCount: colorSet.size,
      sizeCount: sizeSet.size,
      oneSizeCount,
    };
  }, [products]);

  const socialStats = useMemo(() => {
    const likesTotal = socialPosts.reduce((sum, post) => sum + Number(post.likes || 0), 0);
    const avgLikes = socialPosts.length ? likesTotal / socialPosts.length : 0;
    const topPost = socialPosts
      .slice()
      .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))[0] || null;

    return {
      postsTotal: socialPosts.length,
      likesTotal,
      avgLikes,
      topPost,
    };
  }, [socialPosts]);

  const knowledgeBase = useMemo(() => {
    const categoryLabels = [
      t("nav.men", "Hombre"),
      t("nav.women", "Mujer"),
      t("nav.kids", "Ninos"),
      t("nav.bags", "Bolsos"),
      t("nav.accessories", "Accesorios"),
      t("nav.homeDecor", "Hogar"),
    ];

    return [
      {
        id: "nav-shop",
        title: "Navegacion y secciones",
        content: `${t("chatbot.response", "Puedo ayudarte con funcionalidades del sitio.")} ${t("chatbot.navInfo", "Para explorar catalogo, usa MENU y entra en las secciones principales.")} ${categoryLabels.join(", ")}.`,
        keywords: [
          "menu",
          "navegacion",
          "categorias",
          "secciones",
          "catalogo",
          "shop",
          "inicio",
          "hombre",
          "mujer",
          "ninos",
          "bolsos",
          "accesorios",
          "hogar",
          "donde",
        ],
        suggestion: { label: t("landing.shop", "SHOP"), page: "shop" },
      },
      {
        id: "search-products",
        title: "Busqueda y descubrimiento",
        content: t(
          "chatbot.searchInfo",
          "La busqueda permite localizar productos por nombre, marca o categoria. Tambien puedes usar sugerencias rapidas y abrir el detalle del articulo desde resultados."
        ),
        keywords: [
          "buscar",
          "busqueda",
          "search",
          "producto",
          "marca",
          "categoria",
          "resultado",
          "filtro",
          "encontrar",
          "detalle",
        ],
      },
      {
        id: "cart-checkout",
        title: "Carrito y pago",
        content: `${t(
          "chatbot.cartInfo",
          "Puedes anadir productos a la bolsa desde catalogo y detalle."
        )} ${t(
          "cart.taxNotice",
          "Impuestos incluidos. Gastos de envio calculados al final."
        )}`,
        keywords: [
          "carrito",
          "bolsa",
          "checkout",
          "pago",
          "comprar",
          "pedido",
          "total",
          "impuestos",
          "envio",
          "eliminar",
        ],
        suggestion: { label: t("header.bag", "BOLSA"), page: "cart" },
      },
      {
        id: "wishlist",
        title: "Wishlist",
        content: t(
          "chatbot.wishlistInfo",
          "La wishlist guarda tus favoritos. Puedes anadir o quitar productos y moverlos a la bolsa cuando quieras."
        ),
        keywords: [
          "wishlist",
          "favoritos",
          "guardar",
          "saved",
          "deseados",
          "like",
          "quitar",
        ],
        suggestion: { label: t("nav.wishlist", "WISHLIST"), page: "wishlist" },
      },
      {
        id: "account-social",
        title: "Cuenta y social",
        content: `${t(
          "chatbot.authInfo",
          "Las secciones Social Feed, Saved Looks y Messages requieren inicio de sesion. Si no hay sesion, la app redirige automaticamente al acceso."
        )} ${t("chatbot.socialCount", "Publicaciones activas en Social Feed")}: ${socialPosts.length}. ${t("chatbot.savedLooksCount", "Looks guardados")}: ${savedLookCount}.`,
        keywords: [
          "login",
          "registro",
          "cuenta",
          "social",
          "mensajes",
          "saved looks",
          "autenticacion",
          "sesion",
          "acceso",
          "post",
          "posts",
          "likes",
          "comentarios",
          "social feed",
          "saved looks",
        ],
        suggestion: { label: t("landing.socials", "SOCIALS"), page: "socials" },
      },
      {
        id: "settings",
        title: "Idioma y tema",
        content: t(
          "chatbot.settingsInfo",
          "En ajustes puedes cambiar idioma y tema visual (auto, claro u oscuro)."
        ),
        keywords: [
          "idioma",
          "lenguaje",
          "language",
          "tema",
          "dark",
          "light",
          "settings",
          "ajustes",
          "preferencias",
        ],
        suggestion: { label: t("nav.settings", "SETTINGS"), page: "settings" },
      },
    ];
  }, [socialPosts.length, savedLookCount, t]);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isTyping]);

  const findBestDocument = (question) => {
    const normalizedQuestion = normalizeText(question);
    const tokens = tokenize(question);

    if (
      OFF_SCOPE_TERMS.some(
        (term) => normalizedQuestion.includes(term) || tokens.includes(term)
      )
    ) {
      return null;
    }

    let bestScore = 0;
    let bestDoc = null;

    knowledgeBase.forEach((doc) => {
      const normalizedDoc = normalizeText(`${doc.title} ${doc.content}`);
      let score = 0;

      doc.keywords.forEach((keyword) => {
        const normalizedKeyword = normalizeText(keyword);
        if (!normalizedKeyword) return;

        if (normalizedQuestion.includes(normalizedKeyword)) {
          score += normalizedKeyword.includes(" ") ? 3 : 2;
        }
      });

      tokens.forEach((token) => {
        if (normalizedDoc.includes(token)) score += 1;
      });

      if (score > bestScore) {
        bestScore = score;
        bestDoc = doc;
      }
    });

    return bestScore >= 2 ? bestDoc : null;
  };

  const isCountIntent = (normalizedQuestion) => {
    const countHints = [
      "cuantas",
      "cuantos",
      "cantidad",
      "numero",
      "how many",
      "total",
      "cuanta",
    ];
    return countHints.some((hint) => normalizedQuestion.includes(hint));
  };

  const resolveCategoryFromQuestion = (normalizedQuestion) => {
    return Object.entries(CATEGORY_ALIASES).find(([, aliases]) =>
      aliases.some((alias) => normalizedQuestion.includes(alias))
    )?.[0];
  };

  const faqEntries = useMemo(() => {
    return [
      {
        id: "faq-total-products",
        match: (q) => hasAny(q, ["cuantos productos hay", "total de productos", "cuantas prendas hay en total"]),
        answer: () => `${t("chatbot.totalProducts", "Ahora mismo hay")} ${products.length} ${t("chatbot.totalProductsTail", "productos activos en el catalogo.")}`,
        suggestion: { label: t("landing.shop", "SHOP"), page: "shop" },
      },
      {
        id: "faq-price-avg-global",
        match: (q) => hasAny(q, ["precio medio", "ticket medio", "promedio de precios"]) && !resolveCategoryFromQuestion(q),
        answer: () => `${t("chatbot.avgPrice", "El precio medio global del catalogo es")} ${asCurrency(productStats.avgPriceGlobal)}.`,
      },
      {
        id: "faq-most-expensive",
        match: (q) => hasAny(q, ["mas caro", "producto mas caro", "precio mas alto"]),
        answer: () => {
          if (!productStats.mostExpensive) return scopeRefusal;
          return `${t("chatbot.expensive", "El producto mas caro ahora es")} ${productStats.mostExpensive.name} (${asCurrency(productStats.mostExpensive.price)}).`;
        },
      },
      {
        id: "faq-cheapest",
        match: (q) => hasAny(q, ["mas barato", "producto mas barato", "precio mas bajo"]),
        answer: () => {
          if (!productStats.cheapest) return scopeRefusal;
          return `${t("chatbot.cheapest", "El producto mas barato ahora es")} ${productStats.cheapest.name} (${asCurrency(productStats.cheapest.price)}).`;
        },
      },
      {
        id: "faq-brands-count",
        match: (q) => hasAny(q, ["cuantas marcas", "numero de marcas", "marcas hay"]),
        answer: () => `${t("chatbot.brandsCount", "Actualmente hay")} ${productStats.brandNames.length} ${t("chatbot.brandsCountTail", "marcas en el catalogo.")}`,
      },
      {
        id: "faq-brands-list",
        match: (q) => hasAny(q, ["que marcas hay", "lista de marcas", "marcas del catalogo"]),
        answer: () => `${t("chatbot.brandsList", "Las marcas activas son")}: ${productStats.brandNames.join(", ")}.`,
      },
      {
        id: "faq-colors-count",
        match: (q) => hasAny(q, ["cuantos colores", "cantidad de colores", "colores disponibles"]),
        answer: () => `${t("chatbot.colorsCount", "Hay")} ${productStats.colorCount} ${t("chatbot.colorsCountTail", "colores unicos en productos activos.")}`,
      },
      {
        id: "faq-sizes-count",
        match: (q) => hasAny(q, ["cuantas tallas", "cantidad de tallas", "tallas disponibles"]),
        answer: () => `${t("chatbot.sizesCount", "Hay")} ${productStats.sizeCount} ${t("chatbot.sizesCountTail", "tallas distintas en catalogo.")}`,
      },
      {
        id: "faq-one-size",
        match: (q) => hasAny(q, ["one size", "talla unica", "productos one size"]),
        answer: () => `${t("chatbot.oneSize", "Actualmente hay")} ${productStats.oneSizeCount} ${t("chatbot.oneSizeTail", "productos con talla unica.")}`,
      },
      {
        id: "faq-cart-count",
        match: (q) => hasAny(q, ["cuantos productos tengo en la bolsa", "cuantos hay en mi carrito", "mi bolsa"]),
        answer: () => `${t("chatbot.cartCount", "Ahora mismo tienes")} ${cartCount} ${t("chatbot.cartCountTail", "productos en la bolsa.")}`,
        suggestion: { label: t("header.bag", "BOLSA"), page: "cart" },
      },
      {
        id: "faq-wishlist-count",
        match: (q) => hasAny(q, ["cuantos favoritos", "cuantos tengo en wishlist", "favoritos guardados"]),
        answer: () => `${t("chatbot.wishlistCount", "Actualmente tienes")} ${wishlistCount} ${t("chatbot.wishlistCountTail", "productos en wishlist.")}`,
        suggestion: { label: t("nav.wishlist", "WISHLIST"), page: "wishlist" },
      },
      {
        id: "faq-social-posts",
        match: (q) => hasAny(q, ["cuantas publicaciones", "cuantos posts", "posts en social feed", "publicaciones en social feed"]),
        answer: () => {
          if (isSocialLoading) {
            return t(
              "chatbot.socialLoading",
              "El feed social se esta actualizando. Cuando termine la carga podre confirmar el total de publicaciones."
            );
          }
          return `${t("chatbot.socialPostsNow", "Ahora mismo hay")} ${socialStats.postsTotal} ${t("chatbot.socialPostsItems", "publicaciones en Social Feed")}.`;
        },
        suggestion: { label: t("landing.socials", "SOCIALS"), page: "socials" },
      },
      {
        id: "faq-social-likes",
        match: (q) => hasAny(q, ["likes totales", "total de likes", "cuantos likes hay"]),
        answer: () => `${t("chatbot.likesTotal", "El total de likes visibles en Social Feed es")} ${socialStats.likesTotal}.`,
        suggestion: { label: t("landing.socials", "SOCIALS"), page: "socials" },
      },
      {
        id: "faq-social-top-post",
        match: (q) => hasAny(q, ["post con mas likes", "publicacion mas popular", "post mas popular"]),
        answer: () => {
          if (!socialStats.topPost) return t("chatbot.noPosts", "No hay publicaciones disponibles ahora mismo.");
          return `${t("chatbot.topPost", "La publicacion con mas likes es de")} ${socialStats.topPost.user} (${Number(
            socialStats.topPost.likes || 0
          )} likes).`;
        },
        suggestion: { label: t("landing.socials", "SOCIALS"), page: "socials" },
      },
      {
        id: "faq-saved-looks",
        match: (q) => hasAny(q, ["cuantos looks guardados", "saved looks", "looks favoritos"]),
        answer: () => `${t("chatbot.savedLooks", "Ahora mismo tienes")} ${savedLookCount} ${t("chatbot.savedLooksTail", "looks guardados.")}`,
        suggestion: { label: t("nav.savedLooks", "SAVED LOOKS"), page: "saved-looks" },
      },
      {
        id: "faq-login-social",
        match: (q) => hasAny(q, ["hace falta login para social", "necesito iniciar sesion para social", "requiere cuenta social feed"]),
        answer: () =>
          isAuthenticated
            ? t("chatbot.loginRequiredNo", "Ya tienes sesion activa. Puedes entrar a Social Feed, Saved Looks y Messages.")
            : t("chatbot.loginRequiredYes", "Si. Social Feed, Saved Looks y Messages requieren iniciar sesion."),
        suggestion: { label: t("landing.socials", "SOCIALS"), page: "socials" },
      },
      {
        id: "faq-language",
        match: (q) => hasAny(q, ["cambiar idioma", "donde cambio idioma", "language"]),
        answer: () => t("chatbot.languageWhere", "Puedes cambiar el idioma en SETTINGS > Language."),
        suggestion: { label: t("nav.settings", "SETTINGS"), page: "settings" },
      },
      {
        id: "faq-theme",
        match: (q) => hasAny(q, ["cambiar tema", "modo oscuro", "modo claro", "theme"]),
        answer: () => t("chatbot.themeWhere", "Puedes cambiar tema en SETTINGS entre auto, claro y oscuro."),
        suggestion: { label: t("nav.settings", "SETTINGS"), page: "settings" },
      },
      {
        id: "faq-search",
        match: (q) => hasAny(q, ["como busco", "como buscar", "buscar producto", "search product"]),
        answer: () => t("chatbot.searchHow", "Usa SEARCH en la cabecera. Puedes buscar por nombre, marca o categoria."),
      },
      {
        id: "faq-shipping-tax",
        match: (q) => hasAny(q, ["envio", "shipping", "gastos de envio", "impuestos"]),
        answer: () => t("cart.taxNotice", "Impuestos incluidos. Gastos de envio calculados al final."),
        suggestion: { label: t("header.bag", "BOLSA"), page: "cart" },
      },
      {
        id: "faq-capabilities",
        match: (q) => hasAny(q, ["que puedes responder", "que preguntas puedes responder", "help", "ayuda chatbot"]),
        answer: () =>
          t(
            "chatbot.capabilities",
            "Puedo responder stock por seccion, totales de catalogo, precios medios, producto mas caro/barato, marcas, colores, tallas, estado de bolsa y wishlist, metricas de Social Feed, sesion y ajustes."
          ),
      },
    ];
  }, [
    cartCount,
    isAuthenticated,
    isSocialLoading,
    productStats,
    products.length,
    savedLookCount,
    socialStats,
    t,
    wishlistCount,
  ]);

  const resolveAnswer = (question) => {
    const normalizedQuestion = normalizeText(question);
    const categoryFromQuestion = resolveCategoryFromQuestion(normalizedQuestion);

    const categoryIntent =
      categoryFromQuestion &&
      isCountIntent(normalizedQuestion) &&
      (normalizedQuestion.includes("prenda") ||
        normalizedQuestion.includes("producto") ||
        normalizedQuestion.includes("articulo") ||
        normalizedQuestion.includes("stock") ||
        normalizedQuestion.includes("inventario") ||
        normalizedQuestion.includes("seccion"));

    if (categoryIntent) {
      const categoryLabel = t(
        CATEGORY_LABEL_KEYS[categoryFromQuestion] || "category.title",
        categoryFromQuestion.toUpperCase()
      );
      const categoryTotal = categoryCounts[categoryFromQuestion] || 0;

      const categoryAvg = productStats.byCategory[categoryFromQuestion]?.avgPrice || 0;

      return {
        text: `${t("chatbot.countAnswer", "Ahora mismo hay")} ${categoryTotal} ${t("chatbot.countItems", "prendas")} ${t("chatbot.countIn", "en la seccion")} ${categoryLabel}. ${t("chatbot.avgPriceSection", "Precio medio en esta seccion")}: ${asCurrency(categoryAvg)}.`,
        suggestion: { label: categoryLabel, page: categoryFromQuestion },
      };
    }

    const faqMatch = faqEntries.find((entry) => entry.match(normalizedQuestion));
    if (faqMatch) {
      return {
        text: faqMatch.answer(),
        suggestion: faqMatch.suggestion || null,
      };
    }

    const bestDoc = findBestDocument(question);

    if (!bestDoc) {
      return {
        text: scopeRefusal,
        suggestion: null,
      };
    }

    const contextLine = `${t("chatbot.context", "Contexto actual")}: ${String(
      currentPage
    ).toUpperCase()} | ${t("header.bag", "BOLSA")}: ${cartCount} | ${t(
      "nav.wishlist",
      "WISHLIST"
    )}: ${wishlistCount}.`;

    return {
      text: `${bestDoc.content} ${contextLine}`,
      suggestion: bestDoc.suggestion ?? null,
    };
  };

  const handleNavigateSuggestion = () => {
    if (!activeSession?.id || !pendingSuggestion?.page || !changePage) return;
    changePage(pendingSuggestion.page);

    updateSession(activeSession.id, (session) => ({
      ...session,
      messages: [
        ...session.messages,
        {
          sender: "ai",
          text: `${t("chatbot.jump", "Abriendo")}: ${pendingSuggestion.label}`,
        },
      ],
      pendingSuggestion: null,
    }));
  };

  const askWithAutomation = (userMessage) => {
    if (!activeSession?.id) return;

    setIsTyping(true);

    updateSession(activeSession.id, (session) => ({
      ...session,
      title:
        session.title.startsWith("Consulta") || session.title === "Nueva consulta"
          ? toSessionTitle(userMessage)
          : session.title,
      messages: [...session.messages, { sender: "user", text: userMessage }],
      pendingSuggestion: null,
      showTopicSelector: false,
    }));

    window.setTimeout(() => {
      const answer = resolveAnswer(userMessage);

      updateSession(activeSession.id, (session) => ({
        ...session,
        messages: [...session.messages, { sender: "ai", text: answer.text }],
        pendingSuggestion: answer.suggestion,
      }));

      setIsTyping(false);
    }, 420);
  };

  const handleTopicSelect = (topic) => {
    if (!activeSession?.id) return;

    if (topic.id === "ask-ai") {
      updateSession(activeSession.id, (session) => ({
        ...session,
        showTopicSelector: false,
        messages: [
          ...session.messages,
          {
            sender: "ai",
            text: t(
              "chatbot.askAny",
              "Perfecto. Escribe tu pregunta y respondere con datos de esta web y su red social."
            ),
          },
        ],
      }));
      return;
    }

    askWithAutomation(topic.prompt);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    askWithAutomation(userMessage);
  };

  const switchSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setIsHistoryOpen(false);
    setIsTyping(false);
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-floating-bubble"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            openChatbot();
          }
        }}
        aria-label={t("chatbot.trigger", "NECESITAS AYUDA?")}
      >
        <span>CHAT</span>
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-title-text">{t("chatbot.title", "ROB SUPPORT NODE")}</span>
              <span className="chatbot-subtitle">
                {t("chatbot.subtitle", "ARCHIVE-ONLY MODE")}
                <span className="chatbot-cursor" aria-hidden="true">
                  |
                </span>
              </span>
            </div>
            <div className="chatbot-header-tools">
              <button
                type="button"
                onClick={() => setIsHistoryOpen((prev) => !prev)}
                aria-label={t("chatbot.history", "HISTORIAL")}
                title={t("chatbot.history", "HISTORIAL")}
              >
                <History size={15} />
              </button>
              <button
                type="button"
                onClick={startNewConversation}
                aria-label={t("chatbot.newChat", "NUEVO CHAT")}
                title={t("chatbot.newChat", "NUEVO CHAT")}
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t("chatbot.close", "CLOSE CHATBOT")}
              title={t("chatbot.close", "CLOSE CHATBOT")}
            >
              <X size={18} />
            </button>
          </div>

          {isHistoryOpen && (
            <div className="chatbot-history-panel">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  className={`chatbot-history-item ${session.id === activeSession?.id ? "is-active" : ""}`}
                  onClick={() => switchSession(session.id)}
                >
                  <span className="chatbot-history-title">{session.title}</span>
                  <span className="chatbot-history-meta">
                    {new Date(session.updatedAt).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div ref={messagesRef} className="chatbot-messages" aria-live="polite">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {showTopicSelector && (
              <div className="chatbot-topic-grid" role="group" aria-label={t("chatbot.topicSelector", "Selecciona el tipo de consulta")}> 
                {topicOptions.map((topic, index) => (
                  <button
                    key={topic.id}
                    type="button"
                    className={`chatbot-topic-chip ${index < 2 ? "is-wide" : "is-compact"}`}
                    onClick={() => handleTopicSelect(topic)}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="chat-bubble ai typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            )}
          </div>

          {pendingSuggestion?.label && (
            <div className="chatbot-suggestion-strip">
              <button type="button" onClick={handleNavigateSuggestion}>
                {t("chatbot.goTo", "Abrir")}: {pendingSuggestion.label}
              </button>
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              placeholder={t(
                "chatbot.placeholder",
                "Consulta navegacion, cuenta, wishlist, carrito o ajustes..."
              )}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              type="button"
              onClick={handleSend}
              aria-label={t("chatbot.send", "SEND MESSAGE")}
              title={t("chatbot.send", "SEND MESSAGE")}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};