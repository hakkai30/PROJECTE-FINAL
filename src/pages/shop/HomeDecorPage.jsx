import ProductsPage from "./ProductsPage";

const HomeDecorPage = ({
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
      collectionKicker={t("category.categories.home", "HOME")}
      collectionTitle={t("products.collection.readyToWear", "READY TO WEAR")}
      categoryKey="home"
      language={language}
      t={t}
    />
  );
};

export default HomeDecorPage;
