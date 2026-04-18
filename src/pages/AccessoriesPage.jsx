import ProductsPage from "./ProductsPage";

const AccessoriesPage = ({
  changePage,
  cartCount,
  addToCart,
  wishlistCount,
  wishlistIds,
  onToggleWishlist,
  onOpenProductDetail,
  theme,
  onToggleTheme,
  language,
  t,
}) => {
  return (
    <ProductsPage
      changePage={changePage}
      cartCount={cartCount}
      addToCart={addToCart}
      wishlistCount={wishlistCount}
      wishlistIds={wishlistIds}
      onToggleWishlist={onToggleWishlist}
      onOpenProductDetail={onOpenProductDetail}
      theme={theme}
      onToggleTheme={onToggleTheme}
      collectionKicker={t("category.categories.accessories", "ACCESSORIES")}
      collectionTitle={t("products.collection.readyToWear", "READY TO WEAR")}
      categoryKey="accessories"
      language={language}
      t={t}
    />
  );
};

export default AccessoriesPage;
