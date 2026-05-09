import { useState } from "react";
import { X, Search, Menu, ShoppingBag, Heart } from "lucide-react";
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
  products = [],
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
            aria-label="MENÚ"
            title="MENÚ"
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
                aria-label="Menú principal"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
              >
                <div className="sidebar-intro">
                  <p className="sidebar-kicker">EXPLORAR</p>
                  <p className="sidebar-note">
                    Navega por el catálogo, feed social y noticias.
                  </p>
                </div>

                <div className="sidebar-header">
                  <button type="button" onClick={() => setIsMenuOpen(false)}>
                    <X size={16} /> CERRAR
                  </button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}>
                    <Search size={16} /> BUSCAR
                  </button>
                </div>

                <div className="sidebar-nav-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("landing"); }}>INICIO</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("men"); }}>HOMBRE</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("women"); }}>MUJER</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("kids"); }}>NIÑOS</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("bags"); }}>BOLSOS</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("accessories"); }}>ACCESORIOS</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("home"); }}>HOGAR</button>
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("news"); }}>NOTICIAS MODA</button>
                </div>

                <div className="sidebar-nav-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("socials"); }}>FEED SOCIAL</button>
                </div>

                <div className="sidebar-nav-group bottom-group">
                  <button type="button" onClick={() => { setIsMenuOpen(false); changePage("wishlist"); }}>
                    FAVORITOS [ {wishlistCount} ]
                  </button>
                  {currentUser ? (
                    <>
                      <button type="button" onClick={() => { setIsMenuOpen(false); changePage("user-profile"); }}>
                        MI PERFIL
                      </button>
                      <button
                        type="button"
                        className="sidebar-logout-btn"
                        onClick={() => { setIsMenuOpen(false); if (onLogout) onLogout(); }}
                      >
                        CERRAR SESIÓN
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="sidebar-login-btn"
                      onClick={() => { setIsMenuOpen(false); changePage("auth"); }}
                    >
                      INICIAR SESIÓN / REGISTRO
                    </button>
                  )}
                  <button type="button" disabled title="Próximamente">
                    ESPAÑA / EUR
                  </button>
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
            aria-label="BUSCAR"
            title="BUSCAR"
          >
            <Search size={18} />
          </button>

          <button
            className="header-icon-btn"
            onClick={() => changePage("wishlist")}
            aria-label={`FAVORITOS (${wishlistCount})`}
            title={`FAVORITOS (${wishlistCount})`}
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
            aria-label={`BOLSA (${cartCount})`}
            title={`BOLSA (${cartCount})`}
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
        products={products}
      />
    </>
  );
};

export default Header;
