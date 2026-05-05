import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { GlobalFooter, GlobalHeader } from "../../components/Layout";
import { MOCK_PRODUCTS } from "../../data/mockData";
import { localizeProduct } from "../../data/i18n";
import OptimizedImage from "../../components/OptimizedImage";

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
  collectionKicker = "NEW SEASON",
  collectionTitle = "READY TO WEAR",
  categoryKey = "all",
  currentUser = null,
  userProducts = [],
  language,
  t,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [maxPrice, setMaxPrice] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showUserProducts, setShowUserProducts] = useState(true);

  // Combina productos de tienda con productos de usuarios
  const combinedBaseProducts = useMemo(() => {
    const mockProds = MOCK_PRODUCTS;
    const userProds = (userProducts || []).map((prod) => ({
      ...prod,
      id: prod.id,
      brand: "COMMUNITY",
      color: prod.gender || "neutral",
      img: prod.image || "",
      category: prod.category || "clothing",
      isUserProduct: true,
      seller: prod.seller,
    }));
    return showUserProducts ? [...mockProds, ...userProds] : mockProds;
  }, [userProducts, showUserProducts]);

  const baseProducts =
    categoryKey === "all"
      ? combinedBaseProducts
      : combinedBaseProducts.filter((product) => product.category === categoryKey);

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
  }, [categoryKey, categoryMaxPrice]);

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

  const resolvedCollectionKicker = collectionKicker || t("products.collection.newSeason", "NEW SEASON");
  const resolvedCollectionTitle = collectionTitle || t("products.collection.readyToWear", "READY TO WEAR");

  const activeFilterChips = [
    selectedBrand !== "all" && {
      key: "brand",
      label: `${t("products.activeChips.brand", "Brand")}: ${selectedBrand}`,
      clear: () => setSelectedBrand("all"),
    },
    selectedColor !== "all" && {
      key: "color",
      label: `${t("products.activeChips.color", "Color")}: ${selectedColor.toUpperCase()}`,
      clear: () => setSelectedColor("all"),
    },
    selectedSize !== "all" && {
      key: "size",
      label: `${t("products.activeChips.size", "Size")}: ${selectedSize}`,
      clear: () => setSelectedSize("all"),
    },
    maxPrice < categoryMaxPrice && {
      key: "price",
      label: `${t("products.activeChips.max", "Max.")}: ${maxPrice.toFixed(0)} EUR`,
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
        language={language}
        t={t}
      />

      <div className="shop-toolbar">
      </div>

      <section className="collection-intro">
        <p className="collection-kicker">{resolvedCollectionKicker}</p>
        <h2 className="collection-title">{resolvedCollectionTitle}</h2>
        <p className="collection-results">{sortedProducts.length} {t("products.results", "RESULTS")}</p>
        
        {userProducts.length > 0 && (
          <div className="community-products-toggle">
            <label>
              <input
                type="checkbox"
                checked={showUserProducts}
                onChange={(e) => setShowUserProducts(e.target.checked)}
              />
              <span>{t("products.showCommunity", "Show community items")} ({userProducts.length})</span>
            </label>
          </div>
        )}
      </section>

      {activeFilterChips.length > 0 && (
        <div className="active-filter-chips-wrap">
          {activeFilterChips.map((chip) => (
            <button key={chip.key} className="active-filter-chip" onClick={chip.clear}>
              {chip.label} ✕
            </button>
          ))}
          <button className="clear-all-filters-chip" onClick={handleResetFilters}>
            {t("products.clearAll", "CLEAR ALL")}
          </button>
        </div>
      )}

      <div className="products-grid">
        {sortedProducts.map((product) => (
          (() => {
            const localizedProduct = localizeProduct(product, language);
            return (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setQuickViewProduct(product)}
          >
            <button
              className={`wishlist-card-btn ${wishlistIds.includes(product.id) ? "active" : ""}`}
              aria-label={
                wishlistIds.includes(product.id)
                  ? t("products.wishlist.remove", "Remove from wishlist")
                  : t("products.wishlist.add", "Add to wishlist")
              }
              title={
                wishlistIds.includes(product.id)
                  ? t("products.wishlist.remove", "Remove from wishlist")
                  : t("products.wishlist.add", "Add to wishlist")
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
              <OptimizedImage
                src={localizedProduct.img}
                alt={localizedProduct.name}
                className="product-placeholder"
                sizes="(max-width:600px) 100vw, 25vw"
              />
            </div>
            <div className="product-info">
              <div className="product-brand">{localizedProduct.brand}</div>
              <button
                className="product-name product-name-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProductDetail(product);
                }}
              >
                {localizedProduct.name}
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
                  {t("products.actions.add", "+ ADD")}
                </button>
                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProductDetail(product);
                  }}
                >
                  {t("products.actions.detail", "DETAIL")}
                </button>
              </div>
            </div>
          </div>
            );
          })()
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <p className="threads-empty-state" style={{ textAlign: "center", marginTop: "1rem" }}>
          {t("products.noProducts", "No products available in this section.")}
        </p>
      )}

      {quickViewProduct && (
        <div className="quick-view-overlay" onClick={() => setQuickViewProduct(null)}>
          <FocusTrap active={Boolean(quickViewProduct)} focusTrapOptions={{ clickOutsideDeactivates: true }}>
            <div className="quick-view-modal" role="dialog" aria-modal="true" aria-label={t("products.quickView.title", "Quick view")} onClick={(e) => e.stopPropagation()}>
              <button className="quick-view-close" onClick={() => setQuickViewProduct(null)}>
                {t("products.quickView.close", "CLOSE")}
              </button>
              <div className="quick-view-grid">
                <OptimizedImage src={localizeProduct(quickViewProduct, language).img} alt={localizeProduct(quickViewProduct, language).name} className="quick-view-img" sizes="(max-width:600px) 100vw, 40vw" />
                <div className="quick-view-content">
                  <p className="product-brand">{quickViewProduct.brand}</p>
                  <h3>{localizeProduct(quickViewProduct, language).name}</h3>
                  <p className="quick-view-price">{quickViewProduct.price.toFixed(2)}€</p>
                  <p>{t("products.quickView.color", "Color")}: {quickViewProduct.color.toUpperCase()}</p>
                  <p>{t("products.quickView.sizes", "Sizes")}: {(quickViewProduct.sizes || []).join(", ")}</p>
                  <div className="quick-view-actions">
                    <button className="add-btn" onClick={() => addToCart(quickViewProduct)}>
                      {t("products.quickView.addToBag", "+ ADD TO BAG")}
                    </button>
                    <button
                      className={`quick-view-wishlist ${wishlistIds.includes(quickViewProduct.id) ? "active" : ""}`}
                      onClick={() => onToggleWishlist(quickViewProduct)}
                    >
                      {wishlistIds.includes(quickViewProduct.id)
                        ? t("products.quickView.removeFromWishlist", "REMOVE FROM WISHLIST")
                        : t("products.quickView.addToWishlist", "ADD TO WISHLIST")}
                    </button>
                    <button
                      className="quick-view-wishlist"
                      onClick={() => {
                        setQuickViewProduct(null);
                        onOpenProductDetail(quickViewProduct);
                      }}
                    >
                      {t("products.quickView.viewDetails", "VIEW DETAILS")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </FocusTrap>
        </div>
      )}

      <div className="filter-bottom-wrap">
        <div className="bottom-actions-bar">
          <button
            className="filter-bottom-btn is-filter"
            onClick={() => setIsFilterOpen(true)}
          >
            {t("products.filters", "FILTERS")}
          </button>
          <button
            className="filter-bottom-btn is-sort"
            onClick={() => setIsSortOpen(true)}
          >
            {t("products.sort", "SORT")}
          </button>
        </div>
      </div>
      <GlobalFooter t={t} />

      {isFilterOpen && (
        <div className="filter-overlay bottom-sheet-overlay">
          <div className="bottom-sheet-panel">
            <div className="bottom-sheet-grid">
              <div className="bottom-col">
                <h3>{t("products.categories", "CATEGORIES")}</h3>
                <p>{categoryKey === "all" ? t("products.all", "ALL") : categoryKey.toUpperCase()}</p>
              </div>
              <div className="bottom-col">
                <h3>{t("products.brand", "BRAND")}</h3>
                <button
                  className={`sort-option-btn ${selectedBrand === "all" ? "active" : ""}`}
                  onClick={() => setSelectedBrand("all")}
                >
                  {t("products.allBrands", "ALL BRANDS")}
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
                <h3>{t("products.colors", "COLORS")}</h3>
                <button
                  className={`sort-option-btn ${selectedColor === "all" ? "active" : ""}`}
                  onClick={() => setSelectedColor("all")}
                >
                  {t("products.allColors", "ALL COLORS")}
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
                <h3>{t("products.size", "SIZE")}</h3>
                <button
                  className={`sort-option-btn ${selectedSize === "all" ? "active" : ""}`}
                  onClick={() => setSelectedSize("all")}
                >
                  {t("products.allSizes", "ALL SIZES")}
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
                <h3>{t("products.maxPrice", "MAX PRICE")}</h3>
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
                {t("products.bottomSheet.reset", "RESET")}
              </button>
              <button
                className="bottom-action-btn is-close"
                onClick={() => setIsFilterOpen(false)}
              >
                {t("products.bottomSheet.close", "CLOSE")}
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
                <h3>{t("products.sort", "SORT")}</h3>
                <button
                  className={`sort-option-btn ${sortBy === "featured" ? "active" : ""}`}
                  onClick={() => handleSortSelect("featured")}
                >
                  {t("products.sortOptions.featured", "BEST SELLERS")}
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "newest" ? "active" : ""}`}
                  onClick={() => handleSortSelect("newest")}
                >
                  {t("products.sortOptions.newest", "NEWEST")}
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "price-asc" ? "active" : ""}`}
                  onClick={() => handleSortSelect("price-asc")}
                >
                  {t("products.sortOptions.priceAsc", "PRICE ASC")}
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "price-desc" ? "active" : ""}`}
                  onClick={() => handleSortSelect("price-desc")}
                >
                  {t("products.sortOptions.priceDesc", "PRICE DESC")}
                </button>
              </div>
            </div>
            <div className="bottom-sheet-actions">
              <button className="bottom-action-btn" onClick={() => setSortBy("featured") }>
                {t("products.bottomSheet.reset", "RESET")}
              </button>
              <button
                className="bottom-action-btn is-close"
                onClick={() => setIsSortOpen(false)}
              >
                {t("products.bottomSheet.close", "CLOSE")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
