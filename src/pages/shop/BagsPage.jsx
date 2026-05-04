import ProductsPage from "./ProductsPage";

const BagsPage = ({
  changePage,
  cartCount,
  addToCart,
  wishlistCount,
  wishlistIds,
  onToggleWishlist,
  onOpenProductDetail,
  theme,
  onToggleTheme, currentUser,
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
      onOpenProductDetail={onOpenProductDetail} currentUser={currentUser}
      theme={theme}
      onToggleTheme={onToggleTheme}
      collectionKicker={t("category.categories.bags", "BAGS")}
      collectionTitle={t("products.collection.readyToWear", "READY TO WEAR")}
      categoryKey="bags"
      language={language}
      t={t}
    />
  );
};

export default BagsPage;
