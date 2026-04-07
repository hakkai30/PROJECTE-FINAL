import { GlobalFooter, GlobalHeader } from "../components/Layout";

const CategoryPage = ({ changePage, cartCount }) => {
  const categories = ["MENS", "WOMENS", "SHOES", "ACCESSORIES"];

  return (
    <div className="category-page">
      <GlobalHeader changePage={changePage} cartCount={cartCount} />
      <main className="category-content-area">
        <p className="category-kicker">COLLECTIONS</p>
        <h1 className="category-title">ROB THE FAB</h1>
        <h1 className="category-title gray-text">ROB THE FAB</h1>
        <div className="category-buttons-grid">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => changePage("products")}
              className="category-large-btn"
            >
              {cat}
            </button>
          ))}
        </div>
      </main>
      <GlobalFooter />
      <button className="chatbot-floating-bubble" title="Need Help?">
        💬
      </button>
    </div>
  );
};

export default CategoryPage;
