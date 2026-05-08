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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
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
    setIsSortOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedBrand("all");
    setSelectedColor("all");
    setSelectedSize("all");
    setMaxPrice(categoryMaxPrice);
  };

  // Si el padre no define títulos, usamos textos por defecto traducibles.
  const resolvedCollectionKicker = collectionKicker || t("products.collection.newSeason", "NEW SEASON");
  const resolvedCollectionTitle = collectionTitle || t("products.collection.readyToWear", "READY TO WEAR");

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
            className="filter-bottom-btn is-filter"
            onClick={() => setIsFilterOpen(true)}
          >
            FILTROS
          </button>
          <button
            className="filter-bottom-btn is-sort"
            onClick={() => setIsSortOpen(true)}
          >
            ORDENAR
          </button>
        </div>
      </div>
      <GlobalFooter />

      {isFilterOpen && (
        <div className="filter-overlay bottom-sheet-overlay">
          <div className="bottom-sheet-panel">
            <div className="bottom-sheet-grid">
              <div className="bottom-col">
                <h3>CATEGORÍAS</h3>
                <p>{activeCategory === "all" || activeCategory === "shop" ? "TODAS" : activeCategory.toUpperCase()}</p>
              </div>
              <div className="bottom-col">
                <h3>MARCA</h3>
                <button
                  className={`sort-option-btn ${selectedBrand === "all" ? "active" : ""}`}
                  onClick={() => setSelectedBrand("all")}
                >
                  TODAS LAS MARCAS
                </button>
                {availableBrands.map((brand) => (
                  <button
                    key={brand}
                    className={`sort-option-btn ${selectedBrand === brand ? "active" : ""}`}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
              <div className="bottom-col">
                <h3>COLORES</h3>
                <button
                  className={`sort-option-btn ${selectedColor === "all" ? "active" : ""}`}
                  onClick={() => setSelectedColor("all")}
                >
                  TODOS LOS COLORES
                </button>
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`sort-option-btn ${selectedColor === color ? "active" : ""}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="bottom-col">
                <h3>TALLA</h3>
                <button
                  className={`sort-option-btn ${selectedSize === "all" ? "active" : ""}`}
                  onClick={() => setSelectedSize("all")}
                >
                  TODAS LAS TALLAS
                </button>
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`sort-option-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="bottom-col">
                <h3>PRECIO MÁXIMO</h3>
                <p className="filter-price-readout">{maxPrice.toFixed(2)} EUR</p>
                <input
                  className="filter-price-slider"
                  type="range"
                  min="0"
                  max={categoryMaxPrice || 0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="bottom-sheet-actions">
              <button className="bottom-action-btn" onClick={handleResetFilters}>
                REINICIAR
              </button>
              <button
                className="bottom-action-btn is-close"
                onClick={() => setIsFilterOpen(false)}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {isSortOpen && (
        <div className="filter-overlay bottom-sheet-overlay">
          <div className="bottom-sheet-panel">
            <div className="bottom-sheet-grid sort-grid">
              <div className="bottom-col">
                <h3>ORDENAR</h3>
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
              <button className="bottom-action-btn" onClick={() => setSortBy("featured") }>
                REINICIAR
              </button>
              <button
                className="bottom-action-btn is-close"
                onClick={() => setIsSortOpen(false)}
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
