export const WindowOverlay = ({ label, offsetClass }) => (
  <div className={`window-frame ${offsetClass}`}>
    <div className="window-header">
      <span className="window-label">{label}</span>
      <button className="window-close">X</button>
    </div>
    <div className="window-body">
      <span className="window-content-x">X</span>
    </div>
  </div>
);

export const GlobalHeader = ({ changePage, cartCount }) => (
  <header className="main-header">
    <button className="burger-menu-btn" onClick={() => changePage("landing")}>
      MENU
    </button>
    <div className="logo-center-header" onClick={() => changePage("shop")}>
      ROB THE FAB
    </div>
    <div className="header-actions">
      <button>SEARCH</button>
      <button onClick={() => changePage("cart")}>BAG ({cartCount})</button>
    </div>
  </header>
);

export const GlobalFooter = () => (
  <footer className="main-app-footer">
    <div className="footer-column">
      <h3>GUIA DE COMPRA</h3>
      <ul>
        <li>Cancel-lacio i Devolucio</li>
        <li>Metodes de Pagament</li>
        <li>Informacio d'Enviament</li>
        <li>FAQs</li>
        <li>Contacte</li>
      </ul>
    </div>
    <div className="footer-column">
      <h3>MEMBRES</h3>
      <ul>
        <li>El meu compte</li>
        <li>Estat de la Comanda</li>
        <li>Punts de Recompensa</li>
        <li>Registre de Membre</li>
      </ul>
    </div>
    <div className="footer-column">
      <h3>SOBRE NOSALTRES</h3>
      <ul>
        <li>La historia de ROB THE FAB</li>
        <li>Carreres</li>
        <li>Sostenibilitat</li>
      </ul>
    </div>
  </footer>
);
