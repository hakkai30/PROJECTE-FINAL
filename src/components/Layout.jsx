import { useEffect, useState } from "react";
import { X, Search, Menu, ShoppingBag, Heart, MessageSquare, Send, Palette } from "lucide-react";
import { MOCK_PRODUCTS } from "../data/mockData";
import { LANGUAGE_OPTIONS, getLanguageLabel } from "../data/i18n";
import { localizeProduct } from "../data/i18n";

export const WindowOverlay = ({ label, offsetClass }) => {
  const [isVisible, setIsVisible] = useState(true);
  const closeWindow = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div className={`window-frame ${offsetClass}`}>
      <div className="window-header">
        <span className="window-label">LOOK {label}</span>
        <div className="window-actions">
            <button type="button" className="window-action window-action-close" onClick={closeWindow} aria-label="Close window">
              ×
            </button>
        </div>
      </div>
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

export const GlobalHeader = ({
  changePage,
  cartCount,
  wishlistCount = 0,
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
              <div className="sidebar-menu" onClick={(e) => e.stopPropagation()}>
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
                </div>

                <div className="sidebar-nav-group">  
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("socials"); }}>{t("nav.socials", "SOCIAL FEED")}</button>
                </div>

                <div className="sidebar-nav-group bottom-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("wishlist"); }}>
                    {t("nav.wishlist", "WISHLIST")} [ {wishlistCount} ]
                  </button>
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
        <div className="search-fullscreen-overlay">
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
                    <img src={product.img} alt={localizeProduct(product, language).name} className="search-result-thumb" />
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

// COMPONENTE DEL AGENTE DE IA
export const ChatbotWidget = ({ t = (_key, fallback) => fallback || "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: t("chatbot.greeting", "Hello!") }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Aquí conectarías con tu API de OpenAI (Backend)
    // De momento, simulamos una respuesta
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { sender: "ai", text: "Com a assistent d'IA, necessito connectar-me al backend per buscar al catàleg, però estic dissenyat per ajudar-te només amb qüestions de moda d'aquesta web." }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <button className="chatbot-floating-bubble" onClick={() => setIsOpen(true)}>
        <MessageSquare size={28} />
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="online-dot"></span>
              <span className="chatbot-title-text">{t("chatbot.title", "ROB AI STYLIST")}</span>
              <span className="chatbot-subtitle">{t("chatbot.subtitle", "STYLE ASSISTANT")}</span>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label={t("chatbot.close", "CLOSE CHATBOT")} title={t("chatbot.close", "CLOSE CHATBOT")}>
              <X size={18} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble ai typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <input 
              type="text" 
              placeholder={t("chatbot.placeholder", "Ask about collections, shipping...")} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button type="button" onClick={handleSend} aria-label={t("chatbot.send", "SEND MESSAGE")} title={t("chatbot.send", "SEND MESSAGE")}><Send size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
};