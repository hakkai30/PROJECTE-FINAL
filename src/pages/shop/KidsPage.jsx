import ProductsPage from "./ProductsPage";

const KidsPage = ({
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
      collectionKicker={t("category.categories.kids", "KIDS")}
      collectionTitle={t("products.collection.readyToWear", "READY TO WEAR")}
      categoryKey="kids"
      language={language}
      t={t}
    />
  );
};

export default KidsPage;
