import { useState, useEffect, useRef, useMemo } from "react";
import { X, Send } from "lucide-react";

// Chatbot simplificado de una sola sesión para resolver dudas sobre la tienda.
// Usa un sistema de palabras clave para responder sobre productos, carrito, wishlist y la red social.

const CATEGORY_ALIASES = {
  men: ["hombre", "men", "masculino", "caballero"],
  women: ["mujer", "women", "femenino", "dama"],
  kids: ["kids", "ninos", "nino", "infantil", "junior"],
  bags: ["bolso", "bolsos", "bag", "bags", "bandolera", "tote"],
  accessories: ["accesorio", "accesorios", "accessories", "cinturon", "cadena"],
  home: ["home", "hogar", "casa", "decoracion"],
};

const OFF_SCOPE_TERMS = [
  "tiempo", "clima", "deporte", "politica", "historia", "programacion",
  "codigo", "musica", "cine", "medicina", "finanzas", "bitcoin",
  "noticias", "receta", "futbol", "basket", "travel", "horoscopo",
];

const normalize = (text = "") =>
  String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").trim();

const hasAny = (text, terms) => terms.some((term) => text.includes(term));

const Chatbot = ({
  changePage,
  cartCount = 0,
  wishlistCount = 0,
  products = [],
  socialPosts = [],
  savedLookCount = 0,
  isAuthenticated = false,
}) => {
  const greeting = "¡Hola! Soy el asistente de ROB THE FAB. Puedo ayudarte con productos, pedidos, carrito, wishlist y más. ¿Qué necesitas?";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "ai", text: greeting }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const messagesRef = useRef(null);

  // Scroll automático cuando llega un mensaje nuevo.
  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Estadísticas del catálogo calculadas una vez.
  const stats = useMemo(() => {
    const prices = products.map((p) => p.price || 0);
    const sorted = [...products].sort((a, b) => a.price - b.price);
    const brands = [...new Set(products.map((p) => p.brand))];

    return {
      total: products.length,
      avgPrice: prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : "0.00",
      cheapest: sorted[0] || null,
      expensive: sorted[sorted.length - 1] || null,
      brands,
    };
  }, [products]);

  // Busca la mejor respuesta según palabras clave en la pregunta del usuario.
  const resolveAnswer = (question) => {
    const q = normalize(question);

    // Fuera de alcance
    if (OFF_SCOPE_TERMS.some((term) => q.includes(term))) {
      return { text: "Solo puedo ayudarte con temas relacionados con esta tienda de moda.", suggestion: null };
    }

    // Productos por categoría
    const matchedCategory = Object.entries(CATEGORY_ALIASES).find(([, aliases]) =>
      aliases.some((alias) => q.includes(alias))
    );
    if (matchedCategory && hasAny(q, ["cuantos", "cuantas", "cantidad", "hay", "stock", "productos"])) {
      const [cat] = matchedCategory;
      const count = products.filter((p) => p.category === cat).length;
      return { text: `Hay ${count} productos en la sección ${cat.toUpperCase()}.`, suggestion: { label: cat.toUpperCase(), page: cat } };
    }

    // Total de productos
    if (hasAny(q, ["cuantos productos", "total productos", "catalogo"])) {
      return { text: `Ahora mismo hay ${stats.total} productos en el catálogo.`, suggestion: { label: "TIENDA", page: "shop" } };
    }

    // Precio medio
    if (hasAny(q, ["precio medio", "ticket medio", "promedio"])) {
      return { text: `El precio medio del catálogo es ${stats.avgPrice}€.`, suggestion: null };
    }

    // Producto más caro
    if (hasAny(q, ["mas caro", "precio mas alto"])) {
      if (!stats.expensive) return { text: "No hay productos disponibles.", suggestion: null };
      return { text: `El producto más caro es ${stats.expensive.name} (${stats.expensive.price.toFixed(2)}€).`, suggestion: null };
    }

    // Producto más barato
    if (hasAny(q, ["mas barato", "precio mas bajo"])) {
      if (!stats.cheapest) return { text: "No hay productos disponibles.", suggestion: null };
      return { text: `El producto más barato es ${stats.cheapest.name} (${stats.cheapest.price.toFixed(2)}€).`, suggestion: null };
    }

    // Marcas
    if (hasAny(q, ["marcas", "brands", "que marcas"])) {
      return { text: `Las marcas disponibles son: ${stats.brands.join(", ")}.`, suggestion: null };
    }

    // Carrito
    if (hasAny(q, ["carrito", "bolsa", "cart", "bag"])) {
      return { text: `Tienes ${cartCount} productos en la bolsa.`, suggestion: { label: "BOLSA", page: "cart" } };
    }

    // Wishlist
    if (hasAny(q, ["wishlist", "favoritos", "deseados"])) {
      return { text: `Tienes ${wishlistCount} productos en tu wishlist.`, suggestion: { label: "WISHLIST", page: "wishlist" } };
    }

    // Social
    if (hasAny(q, ["social", "feed", "publicaciones", "posts"])) {
      return { text: `Hay ${socialPosts.length} publicaciones en el Social Feed. Tienes ${savedLookCount} looks guardados.`, suggestion: { label: "SOCIAL", page: "socials" } };
    }

    // Login
    if (hasAny(q, ["login", "sesion", "cuenta", "registr"])) {
      const msg = isAuthenticated
        ? "Ya tienes sesión activa. Puedes acceder a Social Feed y tu Perfil."
        : "Necesitas iniciar sesión para acceder al Social Feed y tu Perfil.";
      return { text: msg, suggestion: { label: "ENTRAR", page: "auth" } };
    }

    // Ajustes (ahora solo tema)
    if (hasAny(q, ["tema", "dark", "light", "oscuro", "claro"])) {
      return { text: "Puedes cambiar el tema visual en el icono de la cabecera.", suggestion: null };
    }

    // Buscar
    if (hasAny(q, ["buscar", "search", "encontrar"])) {
      return { text: "Usa el icono de búsqueda en la cabecera para buscar por nombre, marca o categoría.", suggestion: null };
    }

    // Envío
    if (hasAny(q, ["envio", "shipping", "impuestos"])) {
      return { text: "Impuestos incluidos. Gastos de envío calculados al finalizar la compra.", suggestion: { label: "BOLSA", page: "cart" } };
    }

    // Ayuda general
    if (hasAny(q, ["ayuda", "help", "que puedes"])) {
      return { text: "Puedo responder sobre: productos, precios, marcas, carrito, wishlist, social feed y envíos.", suggestion: null };
    }

    // Respuesta por defecto
    return {
      text: "Solo puedo ayudarte con temas relacionados con esta tienda de moda. Prueba a preguntar sobre productos, carrito o la red social.",
      suggestion: null,
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setSuggestion(null);
    setIsTyping(true);

    // Simula un pequeño retardo para que parezca que "piensa".
    setTimeout(() => {
      const answer = resolveAnswer(userMessage);
      setMessages((prev) => [...prev, { sender: "ai", text: answer.text }]);
      setSuggestion(answer.suggestion);
      setIsTyping(false);
    }, 400);
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-floating-bubble"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="¿NECESITAS AYUDA?"
      >
        <span>CHAT</span>
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-title-text">ROB AI STYLIST</span>
              <span className="chatbot-subtitle">
                ASISTENTE DE MODA
                <span className="chatbot-cursor" aria-hidden="true">|</span>
              </span>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
              <X size={18} />
            </button>
          </div>

          <div ref={messagesRef} className="chatbot-messages" aria-live="polite">
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

          {suggestion?.label && (
            <div className="chatbot-suggestion-strip">
              <button
                type="button"
                onClick={() => {
                  changePage(suggestion.page);
                  setMessages((prev) => [...prev, { sender: "ai", text: `Abriendo: ${suggestion.label}` }]);
                  setSuggestion(null);
                }}
              >
                Abrir: {suggestion.label}
              </button>
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Pregunta sobre productos, carrito, envíos..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button type="button" onClick={handleSend} aria-label="Enviar mensaje">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
