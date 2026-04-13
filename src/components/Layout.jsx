import { useState } from "react";
import { X, Search, Menu, ShoppingBag, MessageSquare, Send } from "lucide-react";

export const WindowOverlay = ({ label, offsetClass }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;

  return (
    <div className={`window-frame ${offsetClass}`}>
      <div className="window-header">
        <span className="window-label">{label}</span>
        <button className="window-close" onClick={() => setIsVisible(false)}><X size={12}/></button>
      </div>
      <div className="window-body">
        <span className="window-content-x">X</span>
      </div>
    </div>
  );
};

export const GlobalHeader = ({ changePage, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="main-header">
        <div style={{ position: "relative" }}>
          <button 
            className="burger-menu-btn" 
            onClick={() => setIsMenuOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Menu size={16} /> MENU
          </button>
          
          {/* Menú lateral (Sidebar) */}
          {isMenuOpen && (
            <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}>
              <div className="sidebar-menu" onClick={(e) => e.stopPropagation()}>
                
                <div className="sidebar-header">
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X size={16} /> CLOSE
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}>
                    <Search size={16} /> SEARCH
                  </button>
                </div>

                <div className="sidebar-nav-group">
                  <button onClick={() => { setIsMenuOpen(false); changePage("products"); }}>WOMEN</button>
                  <button onClick={() => { setIsMenuOpen(false); changePage("products"); }}>MEN</button>
                  <button onClick={() => { setIsMenuOpen(false); changePage("products"); }}>KIDS</button>
                  <button onClick={() => { setIsMenuOpen(false); changePage("products"); }}>BAGS</button>
                  <button onClick={() => { setIsMenuOpen(false); changePage("products"); }}>ACCESSORIES</button>
                  <button onClick={() => { setIsMenuOpen(false); changePage("products"); }}>HOME</button>
                  <button onClick={() => { setIsMenuOpen(false); changePage("products"); }}>ECO-AWARE</button>
                </div>

                <div className="sidebar-nav-group">
                  <button>RUNWAY SHOWS</button>
                  <button>PRODUCT GUIDE</button>
                  <button>INTERVIEWS</button>
                  <button>LAMYLAND</button>
                  <button>FURNITURE</button>
                  <button>EXHIBITIONS</button>
                  <button>STORES</button>
                </div>

                <div className="sidebar-nav-group bottom-group">
                  <button>WISHLIST [ 0 ]</button>
                  <button>SPAIN / EUR</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="logo-center-header" onClick={() => changePage("shop")}>
          ROB THE FAB
        </div>
        
        <div className="header-actions">
          <button onClick={() => setIsSearchOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={16} /> SEARCH
          </button>
          <button onClick={() => changePage("cart")} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingBag size={16} /> BAG ({cartCount})
          </button>
        </div>
      </header>

      {/* OVERLAY DE BÚSQUEDA A PANTALLA COMPLETA */}
      {isSearchOpen && (
        <div className="search-fullscreen-overlay">
          <button className="close-search-btn" onClick={() => setIsSearchOpen(false)}>
            <X size={32} />
          </button>
          <div className="search-content">
            <input type="text" placeholder="TYPE TO SEARCH..." autoFocus />
            <div className="search-suggestions">
              <p>POPULAR SEARCHES</p>
              <div className="suggestion-tags">
                <button>Oversized Jackets</button>
                <button>Silver Chains</button>
                <button>SS24 Collection</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const GlobalFooter = () => (
  <footer className="main-app-footer">
    <div className="footer-column">
      <h3>GUIA DE COMPRA</h3>
      <ul>
        <li>Cancel·lació i Devolució</li>
        <li>Mètodes de Pagament</li>
        <li>Informació d'Enviament</li>
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
        <li>La història de ROB THE FAB</li>
        <li>Carreres</li>
        <li>Sostenibilitat</li>
      </ul>
    </div>
  </footer>
);

// COMPONENTE DEL AGENTE DE IA
export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hola! Sóc l'assistent IA de ROB THE FAB. Et puc ajudar a trobar peces, guiar-te amb les talles o recomanar-te outfits sencers. Què busques avui?" }
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
              ROB AI STYLIST
            </div>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
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
              placeholder="Pregunta sobre col·leccions, enviaments..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}><Send size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
};