import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";

import { GlobalFooter, GlobalHeader } from "../../components/Layout";


// Vista de catálogo: combina filtros, ordenación y quick view en una sola pantalla.
const ProductsPage = ({
  changePage,
  cartCount,
  addToCart,
  wishlistCount = 0,
  wishlistIds = [],
  onToggleWishlist = () => {},
  onOpenProductDetail = () => {},
  theme,
  onToggleTheme,
  collectionKicker = "NUEVA TEMPORADA",
  collectionTitle = "READY TO WEAR",
  categoryKey = "all",
  currentUser = null,
  onLogout = () => {},
  products = [],
}) => {
  const { cat } = useParams();
  const activeCategory = cat || categoryKey;

  /** Un sol panel inferior: filtres o ordenació (mai els dos alhora). */
  const [activeSheet, setActiveSheet] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [maxPrice, setMaxPrice] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showUserProducts, setShowUserProducts] = useState(true);

  // Base del catálogo. Ahora mismo solo usa productos estáticos, pero aquí se podría mezclar inventario real.
  const combinedBaseProducts = useMemo(() => {
    return products;
  }, [products]);

  const baseProducts =
    activeCategory === "all" || activeCategory === "shop"
      ? combinedBaseProducts
      : combinedBaseProducts.filter((product) => product.category === activeCategory);

  const categoryMaxPrice = useMemo(() => {
    if (baseProducts.length === 0) return 0;
    return Math.max(...baseProducts.map((product) => product.price));
  }, [baseProducts]);

  const availableColors = useMemo(() => {
    return Array.from(new Set(baseProducts.map((product) => product.color))).sort();
  }, [baseProducts]);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(baseProducts.map((product) => product.brand))).sort();
  }, [baseProducts]);

  const availableSizes = useMemo(() => {
    return Array.from(
      new Set(baseProducts.flatMap((product) => product.sizes || []))
    );
  }, [baseProducts]);

  useEffect(() => {
    setSelectedBrand("all");
    setSelectedColor("all");
    setSelectedSize("all");
    setMaxPrice(categoryMaxPrice);
  }, [activeCategory, categoryMaxPrice]);

  const filteredProducts = baseProducts.filter((product) => {
    const brandOk = selectedBrand === "all" || product.brand === selectedBrand;
    const colorOk = selectedColor === "all" || product.color === selectedColor;
    const sizeOk = selectedSize === "all" || (product.sizes || []).includes(selectedSize);
    const priceOk = product.price <= maxPrice;

    return brandOk && colorOk && sizeOk && priceOk;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return a.id - b.id;
  });

  const handleSortSelect = (value) => {
    setSortBy(value);
    setActiveSheet(null);
  };

  const handleResetFilters = () => {
    setSelectedBrand("all");
    setSelectedColor("all");
    setSelectedSize("all");
    setMaxPrice(categoryMaxPrice);
  };

  // Chips que resumen los filtros activos para poder quitarlos rápido.
  const activeFilterChips = [
    selectedBrand !== "all" && {
      key: "brand",
      label: `Marca: ${selectedBrand}`,
      clear: () => setSelectedBrand("all"),
    },
    selectedColor !== "all" && {
      key: "color",
      label: `Color: ${selectedColor.toUpperCase()}`,
      clear: () => setSelectedColor("all"),
    },
    selectedSize !== "all" && {
      key: "size",
      label: `Talla: ${selectedSize}`,
      clear: () => setSelectedSize("all"),
    },
    maxPrice < categoryMaxPrice && {
      key: "price",
      label: `Máx.: ${maxPrice.toFixed(0)} EUR`,
      clear: () => setMaxPrice(categoryMaxPrice),
    },
  ].filter(Boolean);

  return (
    <div className="category-page relative">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        currentUser={currentUser}
        onOpenProductDetail={onOpenProductDetail}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
        products={products}
      />

      <div className="shop-toolbar">
      </div>

      {/* Introducción de la colección y contador de resultados. */}
      <section className="collection-intro">
        <p className="collection-kicker">{collectionKicker}</p>
        <h2 className="collection-title">{collectionTitle}</h2>
        <p className="collection-results">{sortedProducts.length} RESULTADOS</p>
      </section>

      {activeFilterChips.length > 0 && (
        <div className="active-filter-chips-wrap">
          {activeFilterChips.map((chip) => (
            <button key={chip.key} className="active-filter-chip" onClick={chip.clear}>
              {chip.label} ✕
            </button>
          ))}
          <button className="clear-all-filters-chip" onClick={handleResetFilters}>
            BORRAR TODO
          </button>
        </div>
      )}

      {/* Grid principal del catálogo con tarjetas clicables. */}
      <div className="products-grid">
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setQuickViewProduct(product)}
          >
            <button
              className={`wishlist-card-btn ${wishlistIds.includes(product.id) ? "active" : ""}`}
              aria-label={
                wishlistIds.includes(product.id)
                  ? "Quitar de favoritos"
                  : "Añadir a favoritos"
              }
              title={
                wishlistIds.includes(product.id)
                  ? "Quitar de favoritos"
                  : "Añadir a favoritos"
              }
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
            >
              <Heart
                size={16}
                fill={wishlistIds.includes(product.id) ? "currentColor" : "none"}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </button>
            <div className="product-img">
              <img
                src={product.img}
                alt={product.name}
                className="product-placeholder"
                loading="lazy"
              />
            </div>
            <div className="product-info">
              <div className="product-brand">{product.brand}</div>
              <button
                className="product-name product-name-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProductDetail(product);
                }}
              >
                {product.name}
              </button>
              <div className="product-price-row">
                <span className="product-price">{product.price.toFixed(2)}€</span>
                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  + ADD
                </button>
                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProductDetail(product);
                  }}
                >
                  DETALLES
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <p className="threads-empty-state" style={{ textAlign: "center", marginTop: "1rem" }}>
          No hay productos disponibles en esta sección.
        </p>
      )}

      {quickViewProduct && (
        <div className="quick-view-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="quick-view-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="quick-view-close" onClick={() => setQuickViewProduct(null)}>
              CERRAR
            </button>
            <div className="quick-view-grid">
              <img src={quickViewProduct.img} alt={quickViewProduct.name} className="quick-view-img" loading="lazy" />
              <div className="quick-view-content">
                <p className="product-brand">{quickViewProduct.brand}</p>
                <h3>{quickViewProduct.name}</h3>
                <p className="quick-view-price">{quickViewProduct.price.toFixed(2)}€</p>
                <p>Color: {quickViewProduct.color.toUpperCase()}</p>
                <p>Tallas: {(quickViewProduct.sizes || []).join(", ")}</p>
                <div className="quick-view-actions">
                  <button className="add-btn" onClick={() => addToCart(quickViewProduct)}>
                    + AÑADIR A LA BOLSA
                  </button>
                  <button
                    className={`quick-view-wishlist ${wishlistIds.includes(quickViewProduct.id) ? "active" : ""}`}
                    onClick={() => onToggleWishlist(quickViewProduct)}
                  >
                    {wishlistIds.includes(quickViewProduct.id)
                      ? "QUITAR DE FAVORITOS"
                      : "AÑADIR A FAVORITOS"}
                  </button>
                  <button
                    className="quick-view-wishlist"
                    onClick={() => {
                      setQuickViewProduct(null);
                      onOpenProductDetail(quickViewProduct);
                    }}
                  >
                    VER DETALLES
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="filter-bottom-wrap">
        <div className="bottom-actions-bar">
          <button
            type="button"
            className="filter-bottom-btn is-filter"
            onClick={() => setActiveSheet((prev) => (prev === "filter" ? null : "filter"))}
          >
            FILTROS
          </button>
          <button
            type="button"
            className="filter-bottom-btn is-sort"
            onClick={() => setActiveSheet((prev) => (prev === "sort" ? null : "sort"))}
          >
            ORDENAR
          </button>
        </div>
      </div>
      <GlobalFooter />

      {activeSheet === "filter" && (
        <div
          className="filter-overlay bottom-sheet-overlay"
          role="presentation"
          onClick={() => setActiveSheet(null)}
        >
          <div className="bottom-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-grid">
              <div className="bottom-col" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                <h3 id="filter-sheet-title" style={{ fontSize: "0.68rem", letterSpacing: "0.14em", marginBottom: "1rem" }}>FILTRAR POR TALLA</h3>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    className={`sort-option-btn ${selectedSize === "all" ? "active" : ""}`}
                    onClick={() => setSelectedSize("all")}
                  >
                    {selectedSize === "all" ? "- TODAS LAS TALLAS" : "TODAS LAS TALLAS"}
                  </button>
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`sort-option-btn ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {selectedSize === size ? `- ${size}` : size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bottom-sheet-actions">
              <button type="button" className="bottom-action-btn" onClick={handleResetFilters}>
                REINICIAR
              </button>
              <button
                type="button"
                className="bottom-action-btn is-close"
                onClick={() => setActiveSheet(null)}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSheet === "sort" && (
        <div
          className="filter-overlay bottom-sheet-overlay"
          role="presentation"
          onClick={() => setActiveSheet(null)}
        >
          <div className="bottom-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="sort-sheet-title" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-grid sort-grid">
              <div className="bottom-col">
                <h3 id="sort-sheet-title">ORDENAR</h3>
                <button
                  className={`sort-option-btn ${sortBy === "featured" ? "active" : ""}`}
                  onClick={() => handleSortSelect("featured")}
                >
                  DESTACADOS
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "newest" ? "active" : ""}`}
                  onClick={() => handleSortSelect("newest")}
                >
                  NOVEDADES
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "price-asc" ? "active" : ""}`}
                  onClick={() => handleSortSelect("price-asc")}
                >
                  PRECIO ASC
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "price-desc" ? "active" : ""}`}
                  onClick={() => handleSortSelect("price-desc")}
                >
                  PRECIO DESC
                </button>
              </div>
            </div>
            <div className="bottom-sheet-actions">
              <button type="button" className="bottom-action-btn" onClick={() => setSortBy("featured")}>
                REINICIAR
              </button>
              <button
                type="button"
                className="bottom-action-btn is-close"
                onClick={() => setActiveSheet(null)}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
