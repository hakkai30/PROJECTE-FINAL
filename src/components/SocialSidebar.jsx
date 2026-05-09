import { ChevronRight, ChevronLeft, ShoppingCart, Newspaper, LayoutGrid, Bookmark, User } from "lucide-react";

// Barra lateral de navegación para la parte social.
const SocialSidebar = ({ isSidebarOpen, setIsSidebarOpen, changePage, onGoToMyProfile }) => {
  return (
    <aside className={`social-side-nav ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
      <button
        type="button"
        className="side-nav-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Contraer barra" : "Expandir barra"}
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <nav className="side-nav-content">
        <button type="button" className="side-nav-item" onClick={() => changePage("shop")} title="TIENDA">
          <ShoppingCart size={20} />
          {isSidebarOpen && <span>TIENDA</span>}
        </button>

        <button type="button" className="side-nav-item" onClick={() => changePage("socials")} title="FEED SOCIAL">
          <LayoutGrid size={20} />
          {isSidebarOpen && <span>FEED SOCIAL</span>}
        </button>

        <button type="button" className="side-nav-item" onClick={() => changePage("news")} title="NOTICIAS MODA">
          <Newspaper size={20} />
          {isSidebarOpen && <span>NOTICIAS MODA</span>}
        </button>

        <button type="button" className="side-nav-item" onClick={() => changePage("saved-looks")} title="LOOKS GUARDADOS">
          <Bookmark size={20} />
          {isSidebarOpen && <span>LOOKS GUARDADOS</span>}
        </button>

        <div className="side-nav-spacer" style={{ flex: 1 }}></div>

        <button type="button" className="side-nav-item" onClick={() => onGoToMyProfile ? onGoToMyProfile() : changePage("user-profile")} title="PERFIL">
          <User size={20} />
          {isSidebarOpen && <span>PERFIL</span>}
        </button>
      </nav>
    </aside>
  );
};

export default SocialSidebar;
