import { GlobalFooter, GlobalHeader } from "../components/Layout";

const CategoryPage = ({
  changePage,
  cartCount,
  wishlistCount,
  onOpenProductDetail,
  theme,
  onToggleTheme,
  language,
  t,
}) => {
  const categories = [
    { label: t("category.categories.men", "MENS"), page: "men" },
    { label: t("category.categories.women", "WOMENS"), page: "women" },
    { label: t("category.categories.kids", "KIDS"), page: "kids" },
    { label: t("category.categories.bags", "BAGS"), page: "bags" },
    { label: t("category.categories.accessories", "ACCESSORIES"), page: "accessories" },
    { label: t("category.categories.home", "HOME"), page: "home" },
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
        language={language}
        t={t}
      />
      <main className="category-content-area">
        <p className="category-kicker">{t("category.kicker", "COLLECTIONS")}</p>
        <h1 className="category-title">{t("category.title", "ROB THE FAB")}</h1>
        <p className="category-title gray-text" aria-hidden="true">
          {t("category.title", "ROB THE FAB")}
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
      <GlobalFooter t={t} />
    </div>
  );
};

export default CategoryPage;
