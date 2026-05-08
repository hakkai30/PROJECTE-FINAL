import { GlobalFooter, GlobalHeader } from "../../components/Layout";

const CategoryPage = ({
  changePage,
  cartCount,
  wishlistCount,
  onOpenProductDetail,
  theme,
  onToggleTheme,
  currentUser,
  onLogout,
  products = [],
}) => {
  const categories = [
    { label: "HOMBRE", page: "men" },
    { label: "MUJER", page: "women" },
    { label: "NIÑOS", page: "kids" },
    { label: "BOLSOS", page: "bags" },
    { label: "ACCESORIOS", page: "accessories" },
    { label: "HOGAR", page: "home" },
  ];

  return (
    <div className="category-page">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenProductDetail={onOpenProductDetail}
        theme={theme}
        onToggleTheme={onToggleTheme}
        currentUser={currentUser}
        onLogout={onLogout}
        products={products}
      />
      <main className="category-content-area">
        <p className="category-kicker">COLECCIONES</p>
        <h1 className="category-title">ROB THE FAB</h1>
        <p className="category-title gray-text" aria-hidden="true">
          ROB THE FAB
        </p>
        <div className="category-buttons-grid">
          {categories.map((cat) => (
            <button
              key={cat.page}
              onClick={() => changePage(cat.page)}
              className="category-large-btn"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
};

export default CategoryPage;
