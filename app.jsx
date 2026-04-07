const { useState } = React;

// --- DATOS SIMULADOS (En Catalán) ---
const MOCK_PRODUCTS = [
    { id: 1, brand: "ROB THE FAB", name: "Jaqueta Clàssica Oversized", price: 120.00, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80" },
    { id: 2, brand: "STREETWEAR", name: "Samarreta Gràfica Heavy", price: 45.00, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
    { id: 3, brand: "ROB THE FAB", name: "Pantalons Cargo Utility", price: 89.00, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80" },
    { id: 4, brand: "ACCESSORY", name: "Cadena de Plata Cubana", price: 30.00, img: "https://images.unsplash.com/photo-1599643478524-fb5244098775?w=500&q=80" },
    { id: 5, brand: "SHOES", name: "Vambes Chunky Platform", price: 150.00, img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80" },
    { id: 6, brand: "ROB THE FAB", name: "Gorra de Llanar Knitted", price: 25.00, img: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&q=80" },
    { id: 7, brand: "STREETWEAR", name: "Armilla Denim Vintage", price: 95.00, img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&q=80" },
    { id: 8, brand: "ROB THE FAB", name: "Cinturó de Pell amb Tatxes", price: 40.00, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80" }
];

const MOCK_POSTS = [
    { id: 1, user: "RobTheCreator", likes: 1240, desc: "Passejos per la ciutat amb la nova col·lecció SS24. Ja disponible.", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
    { id: 2, user: "FabioStyles", likes: 892, desc: "Els detalls importen. Capes per al fred.", img: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=800&q=80" }
];

// --- COMPONENTES GLOBALES ---
const WindowOverlay = ({ label, offsetClass }) => (
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

const GlobalHeader = ({ changePage, cartCount }) => (
    <header className="main-header">
        <button className="burger-menu-btn" onClick={() => changePage('landing')}>← BACK</button>
        <div className="logo-center-header" onClick={() => changePage('shop')}>ROB THE FAB</div>
        <div className="header-actions">
            <button>SEARCH</button>
            <button onClick={() => changePage('cart')}>BAG ({cartCount})</button>
        </div>
    </header>
);

const GlobalFooter = () => (
    <footer className="main-app-footer">
        <div className="footer-column">
            <h3>GUIA DE COMPRA</h3>
            <ul><li>Cancel·lació i Devolució</li><li>Mètodes de Pagament</li><li>Informació d'Enviament</li><li>FAQs</li><li>Contacte</li></ul>
        </div>
        <div className="footer-column">
            <h3>MEMBRES</h3>
            <ul><li>El meu compte</li><li>Estat de la Comanda</li><li>Punts de Recompensa</li><li>Registre de Membre</li></ul>
        </div>
        <div className="footer-column">
            <h3>SOBRE NOSALTRES</h3>
            <ul><li>La història de ROB THE FAB</li><li>Carreres</li><li>Sostenibilitat</li></ul>
        </div>
    </footer>
);

// --- PÁGINA 1: PORTADA BRUTALISTA ACTUALIZADA (WFA + Logo) ---
const LandingPage = ({ changePage }) => (
    <div className="landing-page-brutalist">
        
        {/* LAS VENTANAS EMERGENTES HAN VUELTO 🎉 */}
        <div className="windows-absolute-wrapper">
            <WindowOverlay label="W" offsetClass="window-1" />
            <WindowOverlay label="F" offsetClass="window-2" />
            <WindowOverlay label="A" offsetClass="window-3" />
        </div>

        {/* Sección Visual Superior (W F A) */}
        <div className="glitch-visual-container">
            <div className="glitch-visual-text">
                <div className="glitch-text" data-text="W F A">W F A</div>
            </div>
            {/* Su reflejo */}
            <div className="glitch-visual-text reflection">
                <div className="glitch-text" data-text="W F A">W F A</div>
            </div>
        </div>

        {/* Logo Central ROB THE FAB Gigante */}
        <div className="main-logo-container">
            <h1 className="main-logo-glitch-text">ROB THE FAB</h1>
            <h1 className="main-logo-glitch-text logo-reflection">ROB THE FAB</h1>
        </div>
        
        {/* Botones SHOP / SOCIALS Gigantes */}
        <footer className="landing-nav-footer-brutalist">
            <div className="nav-btn-container border-right">
                <button onClick={() => changePage('shop')} className="nav-btn-brutalist glitch-text" data-text="SHOP">SHOP</button>
            </div>
            <div className="nav-btn-container">
                <button onClick={() => changePage('socials')} className="nav-btn-brutalist glitch-text" data-text="SOCIALS">SOCIALS</button>
            </div>
        </footer>
    </div>
);

// --- PÁGINA 2: CATEGORÍAS PRINCIPALES ---
const CategoryPage = ({ changePage, cartCount }) => {
    const categories = ["MENS", "WOMENS", "SHOES", "ACCESORIES"];
    return (
        <div className="category-page">
            <GlobalHeader changePage={changePage} cartCount={cartCount} />
            <main className="category-content-area">
                <h1 className="category-title">ROB THE FAB</h1>
                <h1 className="category-title gray-text">ROB THE FAB</h1>
                <div className="category-buttons-grid">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => changePage('products')} className="category-large-btn">{cat}</button>
                    ))}
                </div>
            </main>
            <GlobalFooter />
            <button className="chatbot-floating-bubble" title="Need Help?">💬</button>
        </div>
    );
};

// --- PÁGINA 3: TIENDA / PRODUCTOS ---
const ProductsPage = ({ changePage, cartCount, addToCart }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="category-page relative">
            <GlobalHeader changePage={changePage} cartCount={cartCount} />
            
            <div className="shop-toolbar">
                <button className="toolbar-btn" onClick={() => setIsFilterOpen(true)}>FILTRE +</button>
                <button className="toolbar-btn">ORDENA ▼</button>
            </div>

            <div className="products-grid">
                {MOCK_PRODUCTS.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-img">
                            <img src={product.img} alt={product.name} className="product-placeholder" />
                        </div>
                        <div className="product-info">
                            <div className="product-brand">{product.brand}</div>
                            <div className="product-name">{product.name}</div>
                            <div className="product-price-row">
                                <span className="product-price">{product.price.toFixed(2)}€</span>
                                <button className="add-btn" onClick={() => addToCart(product)}>+ ADD</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <GlobalFooter />

            {/* MODAL DE FILTROS */}
            {isFilterOpen && (
                <div className="filter-overlay" onClick={() => setIsFilterOpen(false)}>
                    <div className="filter-sidebar" onClick={e => e.stopPropagation()}>
                        <div className="filter-header">
                            <h2>FILTRES</h2>
                            <button className="close-filter" onClick={() => setIsFilterOpen(false)}>✕</button>
                        </div>
                        
                        <div className="filter-section">
                            <h3>CATEGORIA</h3>
                            <label className="filter-label"><input type="checkbox" /> Roba d'abric</label>
                            <label className="filter-label"><input type="checkbox" /> Samarretes</label>
                            <label className="filter-label"><input type="checkbox" /> Pantalons</label>
                        </div>

                        <div className="filter-section">
                            <h3>TALLA</h3>
                            <label className="filter-label"><input type="checkbox" /> S</label>
                            <label className="filter-label"><input type="checkbox" /> M</label>
                            <label className="filter-label"><input type="checkbox" /> L</label>
                        </div>

                        <button className="apply-filters-btn" onClick={() => setIsFilterOpen(false)}>APLICA FILTRES</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- PÁGINA 4: CARRITO ---
const CartPage = ({ changePage, cartItems, cartCount, removeFromCart }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="category-page">
            <GlobalHeader changePage={changePage} cartCount={cartCount} />
            <div className="cart-container">
                <h2 className="cart-title">LA TEVA BOSSA ({cartCount})</h2>
                
                {cartItems.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '4rem 0', fontSize: '1.5rem'}}>
                        La teva bossa està buida. <br/><br/>
                        <button className="toolbar-btn" onClick={() => changePage('products')}>CONTINUA COMPRANT</button>
                    </div>
                ) : (
                    <div>
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="cart-item-details">
                                    <img src={item.img} className="cart-item-img" style={{objectFit: 'cover'}} />
                                    <div>
                                        <p className="item-brand">{item.brand}</p>
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-meta">Talla: M | Qtat: 1</p>
                                        <button className="remove-btn" onClick={() => removeFromCart(index)}>Elimina</button>
                                    </div>
                                </div>
                                <div style={{fontWeight: '900', fontSize: '1.5rem'}}>{item.price.toFixed(2)}€</div>
                            </div>
                        ))}

                        <div className="cart-total-section">
                            <h2>TOTAL: {total.toFixed(2)}€</h2>
                            <p style={{color: '#666', marginBottom: '2rem'}}>Impostos inclosos. Despeses d'enviament calculades al final.</p>
                            <button className="checkout-btn">PASSA AL PAGAMENT</button>
                        </div>
                    </div>
                )}
            </div>
            <GlobalFooter />
        </div>
    );
};

// --- PÁGINA 5: RED SOCIAL (FEED) ---
const SocialFeedPage = ({ changePage }) => {
    const [posts, setPosts] = useState(MOCK_POSTS);

    const handleLike = (id) => {
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    };

    return (
        <div className="social-layout">
            <div className="social-sidebar">
                <button className="sidebar-link" onClick={() => changePage('landing')}>← INICI</button>
                <div style={{borderBottom: '2px solid black', margin: '1rem 0'}}></div>
                <button className="sidebar-link">ROB_THE_FAB</button>
                <button className="sidebar-link">MISSATGES (3)</button>
                <button className="sidebar-link">DESCOBREIX</button>
                <button className="sidebar-link">LOOKS DESATS</button>
                <button className="sidebar-link" style={{marginTop: 'auto', color: 'gray'}}>SETTINGS</button>
            </div>

            <div className="social-feed">
                {posts.map(post => (
                    <div key={post.id} className="social-post">
                        <div className="post-header">
                            <div className="user-avatar"></div>
                            <span>@{post.user}</span>
                        </div>
                        <img src={post.img} className="post-img" />
                        <div className="post-actions">
                            <button onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
                            <button>💬 COMENTA</button>
                            <button className="shop-look-btn">🛒 SHOP AQUEST LOOK</button>
                        </div>
                        <div style={{padding: '0 1.5rem 1.5rem 1.5rem', fontSize: '1.1rem'}}>
                            <strong>{post.user}</strong> {post.desc}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ESTADO GLOBAL Y RUTAS (APP) ---
const App = () => {
    // Estado para saber qué página mostrar
    const [currentPage, setCurrentPage] = useState('landing');
    
    // Estado para gestionar los productos añadidos al carrito (BAG)
    const [cartItems, setCartItems] = useState([]);
    
    const addToCart = (product) => {
        // Añade el nuevo producto a la lista existente del carrito
        setCartItems([...cartItems, product]);
        alert(`Afegit: ${product.name}`); 
    };

    const removeFromCart = (indexToRemove) => {
        // Elimina un producto de la bolsa basándose en su posición (index)
        setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div>
            {/* Lógica de enrutamiento nativa basada en estado */}
            {currentPage === 'landing' && <LandingPage changePage={setCurrentPage} />}
            {currentPage === 'shop' && <CategoryPage changePage={setCurrentPage} cartCount={cartItems.length} />}
            {currentPage === 'products' && <ProductsPage changePage={setCurrentPage} cartCount={cartItems.length} addToCart={addToCart} />}
            {currentPage === 'cart' && <CartPage changePage={setCurrentPage} cartItems={cartItems} cartCount={cartItems.length} removeFromCart={removeFromCart} />}
            {currentPage === 'socials' && <SocialFeedPage changePage={setCurrentPage} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);