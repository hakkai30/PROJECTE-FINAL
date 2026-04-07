import { useState } from "react";
import { GlobalFooter, GlobalHeader } from "../components/Layout";
import { MOCK_PRODUCTS } from "../data/mockData";

const ProductsPage = ({ changePage, cartCount, addToCart }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const sortedProducts = [...MOCK_PRODUCTS].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return a.id - b.id;
  });

  const handleSortSelect = (value) => {
    setSortBy(value);
    setIsSortOpen(false);
  };

  return (
    <div className="category-page relative">
      <GlobalHeader changePage={changePage} cartCount={cartCount} />

      <div className="shop-toolbar">
      </div>

      <section className="collection-intro">
        <p className="collection-kicker">NEW SEASON</p>
        <h2 className="collection-title">READY TO WEAR</h2>
      </section>

      <div className="products-grid">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-img">
              <img
                src={product.img}
                alt={product.name}
                className="product-placeholder"
              />
            </div>
            <div className="product-info">
              <div className="product-brand">{product.brand}</div>
              <div className="product-name">{product.name}</div>
              <div className="product-price-row">
                <span className="product-price">{product.price.toFixed(2)}€</span>
                <button className="add-btn" onClick={() => addToCart(product)}>
                  + ADD
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="filter-bottom-wrap">
        <div className="bottom-actions-bar">
          <button
            className="filter-bottom-btn is-filter"
            onClick={() => setIsFilterOpen(true)}
          >
            FILTERS
          </button>
          <button
            className="filter-bottom-btn is-sort"
            onClick={() => setIsSortOpen(true)}
          >
            SORT
          </button>
        </div>
      </div>
      <GlobalFooter />

      {isFilterOpen && (
        <div className="filter-overlay bottom-sheet-overlay">
          <div className="bottom-sheet-panel">
            <div className="bottom-sheet-grid">
              <div className="bottom-col">
                <h3>CATEGORIES</h3>
                <p>SWIMWEAR / UNDERWEAR</p>
              </div>
              <div className="bottom-col">
                <h3>COLORS</h3>
                <p>BLACK</p>
              </div>
              <div className="bottom-col">
                <h3>CLOTHING SIZE</h3>
                <p>XS</p>
                <p>S</p>
                <p>M</p>
                <p>L</p>
              </div>
            </div>

            <div className="bottom-sheet-actions">
              <button className="bottom-action-btn">RESET</button>
              <button
                className="bottom-action-btn is-close"
                onClick={() => setIsFilterOpen(false)}
              >
                CLOSE
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
                <h3>SORT BY</h3>
                <button
                  className={`sort-option-btn ${sortBy === "featured" ? "active" : ""}`}
                  onClick={() => handleSortSelect("featured")}
                >
                  BEST SELLERS
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "newest" ? "active" : ""}`}
                  onClick={() => handleSortSelect("newest")}
                >
                  NEWEST
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "price-asc" ? "active" : ""}`}
                  onClick={() => handleSortSelect("price-asc")}
                >
                  INCREASING PRICES
                </button>
                <button
                  className={`sort-option-btn ${sortBy === "price-desc" ? "active" : ""}`}
                  onClick={() => handleSortSelect("price-desc")}
                >
                  DECREASING PRICES
                </button>
              </div>
            </div>
            <div className="bottom-sheet-actions">
              <button className="bottom-action-btn" onClick={() => setSortBy("featured")}>
                RESET
              </button>
              <button
                className="bottom-action-btn is-close"
                onClick={() => setIsSortOpen(false)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
