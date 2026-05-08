import { useState } from "react";
import { X } from "lucide-react";
import { MOCK_PRODUCTS } from "../data/mockData";
import { localizeProduct } from "../data/i18n";

// Overlay de búsqueda a pantalla completa con resultados filtrados del catálogo.
const SearchOverlay = ({ isOpen, onClose, onOpenProductDetail, changePage, language, t }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const normalizedTerm = searchTerm.trim().toLowerCase();
  const searchResults = normalizedTerm
    ? MOCK_PRODUCTS.filter(
        (product) =>
          localizeProduct(product, language).name.toLowerCase().includes(normalizedTerm) ||
          product.brand.toLowerCase().includes(normalizedTerm) ||
          product.category.toLowerCase().includes(normalizedTerm)
      ).slice(0, 6)
    : [];

  const handleResultOpen = (product) => {
    if (onOpenProductDetail) {
      onOpenProductDetail(product);
    } else {
      changePage(product.category);
    }
    onClose();
    setSearchTerm("");
  };

  const handleClose = () => {
    onClose();
    setSearchTerm("");
  };

  return (
    <div className="search-fullscreen-overlay" role="dialog" aria-modal="true" aria-label={t("header.search", "SEARCH")}>
      <button className="close-search-btn" onClick={handleClose}>
        <X size={32} />
      </button>
      <div className="search-content">
        <input
          type="text"
          placeholder={t("header.typeToSearch", "ESCRIBE PARA BUSCAR...")}
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchResults.length > 0) {
              handleResultOpen(searchResults[0]);
            }
          }}
        />

        {normalizedTerm && (
          <div className="search-results-list">
            {searchResults.map((product) => (
              <button
                key={product.id}
                className="search-result-item"
                onClick={() => handleResultOpen(product)}
              >
                <img src={product.img} alt={localizeProduct(product, language).name} className="search-result-thumb" loading="lazy" />
                <div className="search-result-texts">
                  <span>{localizeProduct(product, language).name}</span>
                  <small>
                    {product.brand} / {product.category.toUpperCase()} / {product.price.toFixed(2)}€
                  </small>
                </div>
              </button>
            ))}
            {searchResults.length === 0 && (
              <p className="search-no-results">{t("header.noResults", "No se han encontrado resultados.")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
