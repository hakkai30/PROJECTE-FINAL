import { useState } from "react";
import { X, Search, Menu, ShoppingBag, Heart, Palette } from "lucide-react";
import SearchOverlay from "./SearchOverlay";

// Cabecera global: menú lateral, buscador, y accesos rápidos a carrito y wishlist.
const Header = ({
  changePage,
  cartCount = 0,
  cartToast = "",
  wishlistCount = 0,
  currentUser = null,
  onLogout = null,
  onOpenProductDetail = null,
  language = "ca",
  t,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="main-header">
        <div className="header-left-controls">
          <button
            className="burger-menu-btn header-icon-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label={t("header.menu", "MENÚ")}
            title={t("header.menu", "MENÚ")}
          >
            <Menu size={18} />
          </button>

          {/* Menú lateral (Sidebar) */}
          {isMenuOpen && (
            <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}>
              <div
                className="sidebar-menu"
                role="dialog"
                aria-modal="true"
                aria-label={t("nav.sidebar", "Menú principal")}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
              >
                <div className="sidebar-intro">
                  <p className="sidebar-kicker">{t("nav.explore", "EXPLORAR")}</p>
                  <p className="sidebar-note">
                    {t("nav.sidebarNote", "Navega por el catálogo, feed social y ajustes.")}
                  </p>
                </div>

                <div className="sidebar-header">
                  <button type="button" onClick={() => setIsMenuOpen(false)}>
                    <X size={16} /> {t("header.close", "CERRAR")}
                  </button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}>
                    <Search size={16} /> {t("header.search", "BUSCAR")}
                  </button>
                </div>

                <div className="sidebar-nav-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("landing"); }}>{t("nav.home", "INICIO")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("men"); }}>{t("nav.men", "MEN")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("women"); }}>{t("nav.women", "WOMEN")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("kids"); }}>{t("nav.kids", "KIDS")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("bags"); }}>{t("nav.bags", "BAGS")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("accessories"); }}>{t("nav.accessories", "ACCESSORIES")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("home"); }}>{t("nav.homeDecor", "HOME")}</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("news"); }}>{t("nav.news", "NOTICIAS MODA")}</button>
                </div>

                <div className="sidebar-nav-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("socials"); }}>{t("nav.socials", "SOCIAL FEED")}</button>
                </div>

                <div className="sidebar-nav-group bottom-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("wishlist"); }}>
                    {t("nav.wishlist", "WISHLIST")} [ {wishlistCount} ]
                  </button>
                  {currentUser ? (
                    <>
                      <button type="button" onClick={() => { setIsMenuOpen(false); changePage("user-profile"); }}>
                        {t("nav.profile", "MI PERFIL")}
                      </button>
                      <button
                        type="button"
                        className="sidebar-logout-btn"
                        onClick={() => { setIsMenuOpen(false); if (onLogout) onLogout(); }}
                      >
                        {t("nav.logout", "CERRAR SESIÓN")}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="sidebar-login-btn"
                      onClick={() => { setIsMenuOpen(false); changePage("auth"); }}
                    >
                      {t("auth.submit.loginRegister", "INICIA SESIÓN / REGISTRAR-SE")}
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
            aria-label={t("header.search", "BUSCAR")}
            title={t("header.search", "BUSCAR")}
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
            className={`header-icon-btn ${cartToast ? "cart-icon-animate" : ""}`}
            onClick={() => changePage("cart")}
            aria-label={`${t("header.bag", "BOLSA")} (${cartCount})`}
            title={`${t("header.bag", "BOLSA")} (${cartCount})`}
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

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenProductDetail={onOpenProductDetail}
        changePage={changePage}
        language={language}
        t={t}
      />
    </>
  );
};

export default Header;
