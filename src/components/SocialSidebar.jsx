import { ChevronRight, ChevronLeft, ShoppingCart, Newspaper, LayoutGrid, Bookmark, User } from "lucide-react";

// Barra lateral de navegación para la parte social.
const SocialSidebar = ({ isSidebarOpen, setIsSidebarOpen, changePage, t }) => {
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
        <button type="button" className="side-nav-item" onClick={() => changePage("shop")} title={t("nav.shop", "SHOP")}>
          <ShoppingCart size={20} />
          {isSidebarOpen && <span>{t("nav.shop", "SHOP")}</span>}
        </button>

        <button type="button" className="side-nav-item" onClick={() => changePage("socials")} title={t("nav.socials", "SOCIAL FEED")}>
          <LayoutGrid size={20} />
          {isSidebarOpen && <span>{t("nav.socials", "SOCIAL FEED")}</span>}
        </button>

        <button type="button" className="side-nav-item" onClick={() => changePage("news")} title={t("nav.news", "FASHION NEWS")}>
          <Newspaper size={20} />
          {isSidebarOpen && <span>{t("nav.news", "FASHION NEWS")}</span>}
        </button>

        <button type="button" className="side-nav-item" onClick={() => changePage("saved-looks")} title={t("nav.saved", "SAVED LOOKS")}>
          <Bookmark size={20} />
          {isSidebarOpen && <span>{t("nav.saved", "SAVED LOOKS")}</span>}
        </button>

        <div className="side-nav-spacer" style={{ flex: 1 }}></div>

        <button type="button" className="side-nav-item" onClick={() => changePage("user-profile")} title={t("nav.profile", "PROFILE")}>
          <User size={20} />
          {isSidebarOpen && <span>{t("nav.profile", "PROFILE")}</span>}
        </button>
      </nav>
    </aside>
  );
};

export default SocialSidebar;
