export const LANGUAGE_OPTIONS = [
  { code: "ca", label: "Català" },
  { code: "es", label: "Castellano" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export const DEFAULT_LANGUAGE = "ca";

const TRANSLATIONS = {
  ca: {
    brand: "ROB THE FAB",
    language: { label: "Idioma", ca: "Català", es: "Castellano" },
    themeShort: { auto: "A", light: "L", dark: "D" },
    header: {
      menu: "MENÚ", close: "TANCAR", search: "CERCAR", theme: "TEMA",
      wishlist: "WISHLIST", bag: "BOSSA", currency: "ESPANYA / EUR",
      popularSearches: "CERQUES POPULARS", typeToSearch: "ESCRIU PER CERCAR...",
      noResults: "No hem trobat resultats per aquesta cerca.", help: "NECESSITES AJUDA?",
    },
    nav: {
      home: "INICI", men: "MEN", women: "WOMEN", kids: "KIDS", bags: "BAGS",
      accessories: "ACCESSORIES", homeDecor: "HOME", socials: "SOCIAL FEED",
      wishlist: "WISHLIST", profile: "EL MEU PERFIL", settings: "SETTINGS",
      logout: "TANCAR SESSIÓ", discover: "DESCOBREIX", savedLooks: "LOOKS DESATS",
      news: "NOTÍCIES MODA", explore: "EXPLORAR", myStore: "LA MEVA BOTIGA / VENDRE",
      sidebarNote: "Navega pel catàleg, feed social i ajustos.",
    },
    landing: { shop: "SHOP", socials: "SOCIALS", tagline: "Wear the Story. Share the Change." },
    footer: {
      guideTitle: "GUIA DE COMPRA",
      guide: ["Cancel·lació i Devolució", "Mètodes de Pagament", "Informació d'Enviament", "FAQs", "Contacte"],
      membersTitle: "MEMBRES",
      members: ["El meu compte", "Estat de la Comanda", "Punts de Recompensa", "Registre de Membre"],
      aboutTitle: "SOBRE NOSALTRES",
      about: ["La història de ROB THE FAB", "Carreres", "Sostenibilitat"],
    },
    category: {
      kicker: "COL·LECCIONS", title: "ROB THE FAB",
      categories: { men: "MENS", women: "WOMENS", kids: "KIDS", bags: "BAGS", accessories: "ACCESSORIES", home: "HOME" },
      help: "NECESSITES AJUDA?",
    },
    products: {
      collection: { newSeason: "NOVA TEMPORADA", readyToWear: "READY TO WEAR" },
      results: "RESULTATS", clearAll: "ESBORRAR TOT", filters: "FILTRES", sort: "ORDENAR",
      categories: "CATEGORIES", brand: "MARCA", colors: "COLORS", size: "TALLA",
      maxPrice: "PREU MÀXIM", all: "TOTS", allBrands: "TOTES LES MARQUES",
      allColors: "TOTS ELS COLORS", allSizes: "TOTES LES TALLAS",
      noProducts: "No hi ha productes disponibles en aquesta secció.",
      quickView: {
        close: "TANCAR", addToBag: "+ AFEGIR A LA BOSSA", addToWishlist: "AFEGIR A FAVORITS",
        removeFromWishlist: "TREURE DE FAVORITS", viewDetails: "VEURE DETALLS", color: "Color", sizes: "Talles",
      },
      sortOptions: { featured: "DESTACATS", priceAsc: "PREU ASC", priceDesc: "PREU DESC", newest: "NOU" },
      activeChips: { brand: "Marca", color: "Color", size: "Talla", max: "Màx." },
      bottomSheet: { reset: "REINICIAR", close: "TANCAR" },
      actions: { add: "+ ADD", detail: "DETAIL" },
      showCommunity: "Mostra articles de la comunitat",
    },
    detail: {
      back: "TORNAR A", category: "Categoria", color: "Color", sizes: "Talles disponibles",
      addToBag: "+ AFEGIR A LA BOSSA", saveToFavorites: "GUARDAR A FAVORITS", removeFromFavorites: "TREURE DE FAVORITS",
    },
    cart: {
      title: "LA TEVA BOSSA", empty: "La teva bossa està buida.", continue: "CONTINUA COMPRANT",
      size: "Talla", quantity: "Qtat.", remove: "Elimina", total: "TOTAL",
      taxNotice: "Impostos inclosos. Despeses d'enviament calculades al final.",
      checkout: "PASSA AL PAGAMENT", toastAdded: "Afegit al carret:",
    },
    checkout: {
      success: { title: "GRÀCIES!", message: "La teva comanda s'ha realitzat correctament.", button: "CONTINUA COMPRANT" },
      cancel: { title: "COMANDA CANCEL·LADA", message: "Alguna cosa ha anat malament o has cancel·lat el pagament.", button: "TORNAR A LA BOSSA" },
    },
    wishlist: {
      title: "WISHLIST", empty: "Encara no tens favorits guardats.", discover: "DESCOBREIX PRODUCTES",
      category: "Categoria", remove: "Treure de favorits", detail: "DETAIL", addToBag: "+ ADD",
    },
    social: {
      sidebar: { home: "INICI", shop: "SHOP", brand: "ROB_THE_FAB", messages: "MISSATGES", discover: "DESCOBREIX", savedLooks: "LOOKS DESATS", logout: "TANCAR SESSIÓ", settings: "SETTINGS" },
      feed: {
        title: "SOCIAL FEED", subtitle: "Descobreix looks de la comunitat i desa els teus preferits per després.",
        allLooks: "TOTS ELS LOOKS", savedOnly: "NOMÉS DESATS", following: "SEGUINT",
        statsPosts: "POSTS", statsSaved: "DESATS", noSavedInFeed: "NO HI HA LOOKS DESATS AL FEED",
        clearFilter: "MOSTRAR TOTS ELS LOOKS", postPlaceholder: "Escriu un nou post...",
        addImage: "AFEGIR IMATGE", publish: "PUBLICAR", posting: "...",
        commentPrompt: "Escriu el teu comentari", loadingMore: "CARREGANT MÉS...",
      },
      savedLooks: {
        title: "LOOKS DESATS", subtitle: "Els teus looks guardats de la comunitat social.",
        emptyTitle: "ENCARA NO HAS DESAT CAP LOOK", emptyDescription: "Desa looks des del Social Feed i apareixeran aquí.",
        backToFeed: "ANAR AL SOCIAL FEED",
      },
      actions: {
        like: "M'AGRADA", comment: "COMENTA", shopLook: "SHOP AQUEST LOOK",
        saveLook: "DESAR LOOK", saved: "DESAT", unsaveLook: "TREURE DE LOOKS DESATS",
        viewProfile: "VEURE PERFIL", messageAuthor: "MISSATGE",
      },
      postAlt: "Publicació de",
      comments: { empty: "Encara no hi ha comentaris.", now: "ara", delete: "ELIMINAR", sending: "ENVIANT...", send: "ENVIAR" },
      confirmDelete: "Estàs segur/a que vols eliminar aquesta publicació?",
    },
    messages: {
      title: "XATS", searchPlaceholder: "Buscar conversa...", noThreads: "No hi ha converses amb aquesta cerca.",
      statuses: { online: "ONLINE", offline: "OFFLINE", typing: "ESCRIVINT..." },
      messageState: { sent: "ENVIAT", delivered: "ENTREGAT", read: "LLEGIT" },
      send: "ENVIAR", placeholder: "Escriu un missatge...",
      topbar: { online: "ONLINE", offline: "OFFLINE" },
    },
    auth: {
      welcome: {
        title: "BENVINGUT A ROB_THE_FAB", subtitle: "Descobreix moda. Construeix el teu estil. Connecta amb la comunitat.",
        login: "INICIAR SESSIÓ", loginDesc: "Accedeix al teu compte",
        register: "CREAR COMPTE", registerDesc: "Uneix-te a la comunitat",
        guest: "EXPLORAR SENSE COMPTE", guestDesc: "Explora i compra sense registre",
        note: "Aquesta plataforma guarda les teves dades localment al teu navegador.",
      },
      kicker: { login: "ACCÉS A COMPTE", register: "CREAR COMPTE" },
      title: { login: "INICIA SESSIÓ A ROB_THE_FAB", register: "UNEIX-TE A ROB_THE_FAB" },
      description: {
        login: "Inicia sessió per accedir al teu perfil, feed social i articles guardats.",
        register: "Crea un compte per vendre articles, connectar amb la comunitat i guardar els teus favorits.",
      },
      fields: { name: "Nom d'usuari", email: "Correu", password: "Contrasenya", confirm: "Repetir contrasenya", bio: "Biografia", avatar: "Avatar" },
      placeholders: { name: "Ex: alex.rtf", email: "tu@correu.com", password: "Mínim 6 caràcters", confirm: "Torna-la a escriure", bio: "Explica a la comunitat qui ets" },
      errors: {
        required: "Omple el correu i la contrasenya.", nameRequired: "Introdueix un nom d'usuari.",
        passwordLength: "La contrasenya ha de tenir almenys 6 caràcters.", mismatch: "Les contrasenyes no coincideixen.",
        create: "No s'ha pogut crear el compte.", login: "No s'ha pogut iniciar sessió.",
      },
      submit: { login: "INICIAR SESSIÓ", register: "REGISTRAR-SE", loginRegister: "INICIA SESSIÓ / REGISTRAR-SE", validating: "VALIDANT..." },
      footnote: { login: "No tens compte?", register: "Ja tens compte?" },
      switch: { login: "Inicia sessió", register: "Crea un" },
      avatarHelp: "El teu avatar es genera a partir del teu nom d'usuari i l'estil que triïs.",
      back: "Enrere", bioPlaceholder: "Explica a la comunitat qui ets",
    },
    settings: {
      preferences: "PREFERÈNCIES", title: "SETTINGS", visualTheme: "Tema visual",
      visualDescription: "Tria l'estil que millor s'adapti a la teva experiència.",
      returnToShop: "TORNAR A SHOP", language: "Idioma",
      languageDescription: "Canvia el text de tota la interfície.", chooseLanguage: "TRIA IDIOMA", active: "ACTIU",
      themes: {
        auto: { title: "AUTO", subtitle: "Sincronitza amb l'aparença del sistema." },
        light: { title: "MODE CLAR", subtitle: "Superfícies lluminoses amb contrast editorial." },
        dark: { title: "MODE FOSC", subtitle: "Interfície fosca amb bona llegibilitat." },
      },
    },
    profile: {
      uploadNewItem: "PENJAR NOU ARTICLE", yourItems: "ELS MEUS ARTICLES",
      noItems: "Encara no has penjat cap article.", startSelling: "COMENÇA A VENDRE",
      loading: "Carregant els teus productes...", totalItems: "Total d'articles",
      totalLikes: "Total de m'agrada", confirmDelete: "Estàs segur/a que vols eliminar aquest producte?",
      toggleLike: "Alternar m'agrada", deleteProduct: "Eliminar producte", close: "TANCAR",
      kicker: "PERFIL SOCIAL", updateError: "No es pot actualitzar el perfil.",
    },
    uploadForm: {
      title: "VENDRE EL TEU ARTICLE", subtitle: "Comparteix les teves peces de moda amb la comunitat.",
      name: "Nom del producte", namePlaceholder: "Per exemple, Jaqueta Vintage de Cuir",
      description: "Descripció", descriptionPlaceholder: "Descriu el teu article, condició, marca, etc.",
      gender: "Gènere", genderMen: "Home", genderWomen: "Dona", genderKids: "Nens", genderUnisex: "Unisex",
      price: "Preu (€)", category: "Categoria", categoryClothing: "Roba", categoryAccessories: "Accessoris",
      categoryBags: "Bosses", categoryShoes: "Sabates", categoryHome: "Decoració de casa",
      imageUrl: "URL de la imatge", sizes: "Talles disponibles",
      cancel: "CANCEL·LAR", upload: "PENJAR ARTICLE", uploading: "PENJANT...",
      submitError: "No es pot penjar el producte.", priceInvalid: "El preu ha de ser un número positiu vàlid.",
      imageRequired: "La imatge del producte és obligatòria.", sizesRequired: "Si us plau, selecciona almenys una talla.",
    },
    chatbot: {
      title: "ROB AI STYLIST",
      greeting: "Hola! Sóc l'assistent de ROB THE FAB. Et puc ajudar amb productes, comandes i més. Què necessites?",
      placeholder: "Pregunta sobre productes, carret, enviaments...",
      trigger: "NECESSITES AJUDA?", outOfScope: "Només et puc ajudar amb temes de la botiga de moda.",
      goTo: "Obrir", subtitle: "ASSISTENT DE MODA",
    },
    notifications: { title: "NOTIFICACIONS", empty: "Encara no hi ha notificacions." },
  },
  es: {
    brand: "ROB THE FAB",
    language: { label: "Idioma", ca: "Catalán", es: "Castellano" },
    themeShort: { auto: "A", light: "L", dark: "D" },
    header: {
      menu: "MENÚ", close: "CERRAR", search: "BUSCAR", theme: "TEMA",
      wishlist: "WISHLIST", bag: "BOLSA", currency: "ESPAÑA / EUR",
      popularSearches: "BÚSQUEDAS POPULARES", typeToSearch: "ESCRIBE PARA BUSCAR...",
      noResults: "No hemos encontrado resultados para esta búsqueda.", help: "¿NECESITAS AYUDA?",
    },
    nav: {
      home: "INICIO", men: "HOMBRE", women: "MUJER", kids: "NIÑOS", bags: "BOLSOS",
      accessories: "ACCESORIOS", homeDecor: "HOGAR", news: "NOTICIAS MODA",
      socials: "SOCIAL FEED", wishlist: "WISHLIST", profile: "MI PERFIL",
      settings: "AJUSTES", logout: "CERRAR SESIÓN", discover: "DESCUBRE",
      savedLooks: "LOOKS GUARDADOS", explore: "EXPLORAR", myStore: "MI TIENDA / VENDER",
      sidebarNote: "Navega por el catálogo, feed social y ajustes.",
    },
    landing: { shop: "SHOP", socials: "SOCIALS", tagline: "Wear the Story. Share the Change." },
    footer: {
      guideTitle: "GUÍA DE COMPRA",
      guide: ["Cancelación y Devolución", "Métodos de Pago", "Información de Envío", "FAQs", "Contacto"],
      membersTitle: "MIEMBROS",
      members: ["Mi cuenta", "Estado del Pedido", "Puntos de Recompensa", "Registro de Miembro"],
      aboutTitle: "SOBRE NOSOTROS",
      about: ["La historia de ROB THE FAB", "Carreras", "Sostenibilidad"],
    },
    category: {
      kicker: "COLECCIONES", title: "ROB THE FAB",
      categories: { men: "HOMBRE", women: "MUJER", kids: "NIÑOS", bags: "BOLSOS", accessories: "ACCESORIOS", home: "HOGAR" },
      help: "¿NECESITAS AYUDA?",
    },
    products: {
      collection: { newSeason: "NUEVA TEMPORADA", readyToWear: "READY TO WEAR" },
      results: "RESULTADOS", clearAll: "BORRAR TODO", filters: "FILTROS", sort: "ORDENAR",
      categories: "CATEGORÍAS", brand: "MARCA", colors: "COLORES", size: "TALLA",
      maxPrice: "PRECIO MÁXIMO", all: "TODOS", allBrands: "TODAS LAS MARCAS",
      allColors: "TODOS LOS COLORES", allSizes: "TODAS LAS TALLAS",
      noProducts: "No hay productos disponibles en esta sección.",
      quickView: {
        close: "CERRAR", addToBag: "+ AÑADIR A LA BOLSA", addToWishlist: "AÑADIR A FAVORITOS",
        removeFromWishlist: "QUITAR DE FAVORITOS", viewDetails: "VER DETALLES", color: "Color", sizes: "Tallas",
      },
      sortOptions: { featured: "DESTACADOS", priceAsc: "PRECIO ASC", priceDesc: "PRECIO DESC", newest: "NUEVO" },
      activeChips: { brand: "Marca", color: "Color", size: "Talla", max: "Máx." },
      bottomSheet: { reset: "REINICIAR", close: "CERRAR" },
      actions: { add: "+ ADD", detail: "DETAIL" },
      showCommunity: "Mostrar artículos de la comunidad",
    },
    detail: {
      back: "VOLVER A", category: "Categoría", color: "Color", sizes: "Tallas disponibles",
      addToBag: "+ AÑADIR A LA BOLSA", saveToFavorites: "GUARDAR EN FAVORITOS", removeFromFavorites: "QUITAR DE FAVORITOS",
    },
    cart: {
      title: "TU BOLSA", empty: "Tu bolsa está vacía.", continue: "SIGUE COMPRANDO",
      size: "Talla", quantity: "Cant.", remove: "Eliminar", total: "TOTAL",
      taxNotice: "Impuestos incluidos. Gastos de envío calculados al final.",
      checkout: "IR AL PAGO", toastAdded: "Añadido al carrito:",
    },
    checkout: {
      success: { title: "¡GRACIAS!", message: "Tu pedido se ha realizado correctamente.", button: "CONTINUAR COMPRANDO" },
      cancel: { title: "PEDIDO CANCELADO", message: "Algo ha salido mal o has cancelado el pago.", button: "VOLVER A LA BOLSA" },
    },
    wishlist: {
      title: "WISHLIST", empty: "Todavía no tienes favoritos guardados.", discover: "DESCUBRIR PRODUCTOS",
      category: "Categoría", remove: "Quitar de favoritos", detail: "DETAIL", addToBag: "+ ADD",
    },
    social: {
      sidebar: { home: "INICIO", shop: "SHOP", brand: "ROB_THE_FAB", messages: "MENSAJES", discover: "DESCUBRE", savedLooks: "LOOKS GUARDADOS", logout: "CERRAR SESIÓN", settings: "AJUSTES" },
      feed: {
        title: "SOCIAL FEED", subtitle: "Descubre looks de la comunidad y guarda tus favoritos para después.",
        allLooks: "TODOS LOS LOOKS", savedOnly: "SOLO GUARDADOS", following: "SIGUIENDO",
        statsPosts: "POSTS", statsSaved: "GUARDADOS", noSavedInFeed: "NO HAY LOOKS GUARDADOS EN EL FEED",
        clearFilter: "MOSTRAR TODOS LOS LOOKS", postPlaceholder: "Escribe un nuevo post...",
        addImage: "AÑADIR IMAGEN", publish: "PUBLICAR", posting: "...",
        commentPrompt: "Escribe tu comentario", loadingMore: "CARGANDO MÁS...",
      },
      savedLooks: {
        title: "LOOKS GUARDADOS", subtitle: "Tus looks guardados de la comunidad social.",
        emptyTitle: "AÚN NO HAS GUARDADO LOOKS", emptyDescription: "Guarda looks desde Social Feed y aparecerán aquí.",
        backToFeed: "IR A SOCIAL FEED",
      },
      actions: {
        like: "ME GUSTA", comment: "COMENTA", shopLook: "SHOP ESTE LOOK",
        saveLook: "GUARDAR LOOK", saved: "GUARDADO", unsaveLook: "QUITAR DE LOOKS GUARDADOS",
        viewProfile: "VER PERFIL", messageAuthor: "MENSAJE",
      },
      postAlt: "Publicación de",
      comments: { empty: "No hay comentarios todavía.", now: "ahora", delete: "ELIMINAR", sending: "ENVIANDO...", send: "ENVIAR" },
      confirmDelete: "¿Estás seguro de que quieres eliminar esta publicación?",
    },
    messages: {
      title: "CHATS", searchPlaceholder: "Buscar conversación...", noThreads: "No hay conversaciones con esta búsqueda.",
      statuses: { online: "ONLINE", offline: "OFFLINE", typing: "ESCRIBIENDO..." },
      messageState: { sent: "ENVIADO", delivered: "ENTREGADO", read: "LEÍDO" },
      send: "ENVIAR", placeholder: "Escribe un mensaje...",
      topbar: { online: "ONLINE", offline: "OFFLINE" },
    },
    auth: {
      welcome: {
        title: "BIENVENIDO A ROB_THE_FAB", subtitle: "Descubre moda. Construye tu estilo. Conecta con la comunidad.",
        login: "INICIAR SESIÓN", loginDesc: "Accede a tu cuenta",
        register: "CREAR CUENTA", registerDesc: "Únete a la comunidad",
        guest: "EXPLORAR SIN CUENTA", guestDesc: "Explora y compra sin registrarte",
        note: "Esta plataforma guarda tus datos localmente en tu navegador.",
      },
      kicker: { login: "ACCESO A CUENTA", register: "CREAR CUENTA" },
      title: { login: "INICIA SESIÓN EN ROB_THE_FAB", register: "ÚNETE A ROB_THE_FAB" },
      description: {
        login: "Inicia sesión para acceder a tu perfil, feed social y artículos guardados.",
        register: "Crea una cuenta para vender artículos, conectar con la comunidad y guardar tus favoritos.",
      },
      fields: { name: "Nombre de usuario", email: "Correo", password: "Contraseña", confirm: "Repetir contraseña", bio: "Biografía", avatar: "Avatar" },
      placeholders: { name: "Ej: alex.rtf", email: "tu@correo.com", password: "Mínimo 6 caracteres", confirm: "Vuelve a escribirla", bio: "Cuéntale a la comunidad quién eres" },
      errors: {
        required: "Completa el correo y la contraseña.", nameRequired: "Introduce un nombre de usuario.",
        passwordLength: "La contraseña debe tener al menos 6 caracteres.", mismatch: "Las contraseñas no coinciden.",
        create: "No se ha podido crear la cuenta.", login: "No se ha podido iniciar sesión.",
      },
      submit: { login: "INICIAR SESIÓN", register: "REGISTRARSE", loginRegister: "INICIA SESIÓN / REGISTRARSE", validating: "VALIDANDO..." },
      footnote: { login: "¿No tienes cuenta?", register: "¿Ya tienes cuenta?" },
      switch: { login: "Inicia sesión", register: "Crea una" },
      avatarHelp: "Tu avatar se genera a partir de tu nombre de usuario y el estilo que elijas.",
      back: "Atrás", bioPlaceholder: "Cuéntale a la comunidad quién eres",
    },
    settings: {
      preferences: "PREFERENCIAS", title: "AJUSTES", visualTheme: "Tema visual",
      visualDescription: "Elige el estilo que mejor se adapte a tu experiencia.",
      returnToShop: "VOLVER A SHOP", language: "Idioma",
      languageDescription: "Cambia el texto de toda la interfaz.", chooseLanguage: "ELIGE IDIOMA", active: "ACTIVO",
      themes: {
        auto: { title: "AUTO", subtitle: "Sincroniza con la apariencia del sistema." },
        light: { title: "MODO CLARO", subtitle: "Superficies luminosas con contraste editorial." },
        dark: { title: "MODO OSCURO", subtitle: "Interfaz oscura con buena legibilidad." },
      },
    },
    profile: {
      uploadNewItem: "COLGAR NUEVO ARTÍCULO", yourItems: "MIS ARTÍCULOS",
      noItems: "Aún no has colgado ningún artículo.", startSelling: "COMIENZA A VENDER",
      loading: "Cargando tus productos...", totalItems: "Total de artículos",
      totalLikes: "Total de me gusta", confirmDelete: "¿Estás seguro de que quieres eliminar este producto?",
      toggleLike: "Alternar me gusta", deleteProduct: "Eliminar producto", close: "CERRAR",
      kicker: "PERFIL SOCIAL", updateError: "No se puede actualizar el perfil.",
    },
    uploadForm: {
      title: "VENDER TU ARTÍCULO", subtitle: "Comparte tus prendas de moda con la comunidad.",
      name: "Nombre del producto", namePlaceholder: "Por ejemplo, Chaqueta Vintage de Cuero",
      description: "Descripción", descriptionPlaceholder: "Describe tu artículo, condición, marca, etc.",
      gender: "Género", genderMen: "Hombre", genderWomen: "Mujer", genderKids: "Niños", genderUnisex: "Unisex",
      price: "Precio (€)", category: "Categoría", categoryClothing: "Ropa", categoryAccessories: "Accesorios",
      categoryBags: "Bolsas", categoryShoes: "Zapatos", categoryHome: "Decoración del hogar",
      imageUrl: "URL de la imagen", sizes: "Tallas disponibles",
      cancel: "CANCELAR", upload: "COLGAR ARTÍCULO", uploading: "COLGANDO...",
      submitError: "No se puede colgar el producto.", priceInvalid: "El precio debe ser un número positivo válido.",
      imageRequired: "La imagen del producto es obligatoria.", sizesRequired: "Por favor, selecciona al menos una talla.",
    },
    chatbot: {
      title: "ROB AI STYLIST",
      greeting: "¡Hola! Soy el asistente de ROB THE FAB. Puedo ayudarte con productos, pedidos y más. ¿Qué necesitas?",
      placeholder: "Pregunta sobre productos, carrito, envíos...",
      trigger: "¿NECESITAS AYUDA?", outOfScope: "Solo puedo ayudarte con temas de la tienda de moda.",
      goTo: "Abrir", subtitle: "ASISTENTE DE MODA",
    },
    notifications: { title: "NOTIFICACIONES", empty: "No hay notificaciones todavía." },
  },
  en: {
    brand: "ROB THE FAB",
    language: { label: "Language", ca: "Catalan", es: "Spanish", en: "English", fr: "French" },
    header: { menu: "MENU", close: "CLOSE", search: "SEARCH", wishlist: "WISHLIST", bag: "BAG", currency: "SPAIN / EUR" },
    nav: { home: "HOME", shop: "SHOP", socials: "SOCIAL FEED", news: "NEWS", wishlist: "WISHLIST", profile: "PROFILE", logout: "LOGOUT" },
    products: { results: "RESULTS", filters: "FILTERS", sort: "SORT", actions: { add: "+ ADD", detail: "DETAIL" } },
    cart: { title: "YOUR BAG", empty: "Your bag is empty.", checkout: "CHECKOUT", total: "TOTAL" },
    social: { feed: { title: "SOCIAL FEED", publish: "PUBLISH" } },
    auth: { submit: { login: "LOGIN", register: "REGISTER" } },
  },
  fr: {
    brand: "ROB THE FAB",
    language: { label: "Langue", ca: "Catalan", es: "Espagnol", en: "Anglais", fr: "Français" },
    header: { menu: "MENU", close: "FERMER", search: "RECHERCHER", wishlist: "WISHLIST", bag: "SAC", currency: "ESPAGNE / EUR" },
    nav: { home: "ACCUEIL", shop: "BOUTIQUE", socials: "SOCIAL FEED", news: "NOUVELLES", wishlist: "WISHLIST", profile: "PROFIL", logout: "DÉCONNEXION" },
    products: { results: "RÉSULTATS", filters: "FILTRES", sort: "TRIER", actions: { add: "+ AJOUTER", detail: "DÉTAIL" } },
    cart: { title: "VOTRE SAC", empty: "Votre sac est vide.", checkout: "PAIEMENT", total: "TOTAL" },
    social: { feed: { title: "SOCIAL FEED", publish: "PUBLIER" } },
    auth: { submit: { login: "CONNEXION", register: "S'INSCRIRE" } },
  },
};

const readValue = (source, path) =>
  path.split(".").reduce((current, segment) => current?.[segment], source);

export const normalizeLanguage = (value) => {
  return ["ca", "es", "en", "fr"].includes(value) ? value : DEFAULT_LANGUAGE;
};

export const getLanguageLabel = (language) => {
  return TRANSLATIONS[DEFAULT_LANGUAGE].language[normalizeLanguage(language)] || language.toUpperCase();
};

export const createTranslator = (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  const locale = TRANSLATIONS[normalizedLanguage] || TRANSLATIONS[DEFAULT_LANGUAGE];
  const fallbackLocale = TRANSLATIONS[DEFAULT_LANGUAGE];

  return (path, fallback = "") => {
    const value = readValue(locale, path) ?? readValue(fallbackLocale, path);
    return value ?? fallback;
  };
};

export const getLocalizedValue = (valueMap, language, fallback = "") => {
  if (!valueMap || typeof valueMap !== "object") return fallback;
  const normalizedLanguage = normalizeLanguage(language);
  return valueMap[normalizedLanguage] ?? valueMap[DEFAULT_LANGUAGE] ?? fallback;
};

export const localizeProduct = (product, language) => ({
  ...product,
  name: getLocalizedValue(product.nameByLang, language, product.name),
});

export const localizePost = (post, language) => ({
  ...post,
  desc: getLocalizedValue(post.descByLang, language, post.desc),
});
