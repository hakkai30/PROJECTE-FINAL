import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";

const UploadProductForm = ({
  currentUser,
  onSubmit,
  isLoading = false,
  error = "",
  onCancel = () => {},
  t,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gender: "unisex",
    price: "",
    image: "",
    category: "clothing",
    sizes: ["ONE SIZE"],
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validaciones
    if (!formData.name.trim()) {
      setLocalError(t("uploadForm.nameRequired", "Product name is required."));
      return;
    }

    if (!formData.description.trim()) {
      setLocalError(t("uploadForm.descriptionRequired", "Product description is required."));
      return;
    }

    if (!formData.price || formData.price < 0) {
      setLocalError(t("uploadForm.priceInvalid", "Price must be a valid positive number."));
      return;
    }

    if (!formData.image.trim()) {
      setLocalError(t("uploadForm.imageRequired", "Product image is required."));
      return;
    }

    if (formData.sizes.length === 0) {
      setLocalError(t("uploadForm.sizesRequired", "Please select at least one size."));
      return;
    }

    try {
      await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        seller: currentUser?.name || "USER",
        sellerEmail: currentUser?.email || "user@example.com",
      });
    } catch (err) {
      setLocalError(err.message || t("uploadForm.submitError", "Could not upload product."));
    }
  };

  const displayError = localError || error;

  return (
    <div className="upload-form-container">
      <div className="upload-form-header">
        <h2>{t("uploadForm.title", "SELL YOUR ITEM")}</h2>
        <p className="upload-form-subtitle">
          {t(
            "uploadForm.subtitle",
            "Share your fashion pieces with our community. Fill in the details below."
          )}
        </p>
      </div>

      {displayError && (
        <div className="upload-form-error">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        {/* Product Name */}
        <div className="form-group">
          <label htmlFor="product-name">
            {t("uploadForm.name", "Product Name")}
            <span className="required">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("uploadForm.namePlaceholder", "e.g., Vintage Leather Jacket")}
            disabled={isLoading}
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="product-description">
            {t("uploadForm.description", "Description")}
            <span className="required">*</span>
          </label>
          <textarea
            id="product-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t("uploadForm.descriptionPlaceholder", "Describe your item, condition, brand, etc.")}
            disabled={isLoading}
            maxLength={500}
            rows={4}
          />
          <small className="char-count">
            {formData.description.length}/500
          </small>
        </div>

        {/* Gender */}
        <div className="form-group">
          <label htmlFor="product-gender">
            {t("uploadForm.gender", "Gender")}
            <span className="required">*</span>
          </label>
          <select
            id="product-gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="men">{t("uploadForm.genderMen", "Men")}</option>
            <option value="women">{t("uploadForm.genderWomen", "Women")}</option>
            <option value="kids">{t("uploadForm.genderKids", "Kids")}</option>
            <option value="unisex">{t("uploadForm.genderUnisex", "Unisex")}</option>
          </select>
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="product-price">
            {t("uploadForm.price", "Price (€)")}
            <span className="required">*</span>
          </label>
          <input
            id="product-price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            disabled={isLoading}
            step="0.01"
            min="0"
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="product-category">
            {t("uploadForm.category", "Category")}
          </label>
          <select
            id="product-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="clothing">{t("uploadForm.categoryClothing", "Clothing")}</option>
            <option value="accessories">{t("uploadForm.categoryAccessories", "Accessories")}</option>
            <option value="bags">{t("uploadForm.categoryBags", "Bags")}</option>
            <option value="shoes">{t("uploadForm.categoryShoes", "Shoes")}</option>
            <option value="home">{t("uploadForm.categoryHome", "Home Decor")}</option>
          </select>
        </div>

        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="product-image">
            {t("uploadForm.imageUrl", "Image URL")}
            <span className="required">*</span>
          </label>
          <input
            id="product-image"
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            disabled={isLoading}
          />
          {formData.image && (
            <div className="image-preview">
              <img
                src={formData.image}
                alt="Product preview"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="form-group">
          <label>{t("uploadForm.sizes", "Available Sizes")}</label>
          <div className="sizes-grid">
            {["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"].map((size) => (
              <label key={size} className="size-checkbox">
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                  disabled={isLoading}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("uploadForm.cancel", "CANCEL")}
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            <Upload size={18} aria-hidden="true" />
            {isLoading
              ? t("uploadForm.uploading", "UPLOADING...")
              : t("uploadForm.upload", "UPLOAD ITEM")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProductForm;
