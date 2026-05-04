import { useState, useRef } from "react";
import { Upload, AlertCircle, Image as ImageIcon, X } from "lucide-react";
import { postService } from "../services/postService";

const UploadProductForm = ({
  currentUser,
  onSubmit,
  isLoading = false,
  error = "",
  onCancel = () => {},
  t,
}) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gender: "unisex",
    price: "",
    image: "",
    category: "clothing",
    sizes: ["ONE SIZE"],
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalError(t("uploadForm.errors.notImage", "Please select an image file."));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalError(t("uploadForm.errors.tooLarge", "Image must be less than 5MB."));
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setLocalError("");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    if (!selectedFile) {
      setLocalError(t("uploadForm.imageRequired", "Product image is required."));
      return;
    }

    if (formData.sizes.length === 0) {
      setLocalError(t("uploadForm.sizesRequired", "Please select at least one size."));
      return;
    }

    try {
      setIsUploadingImage(true);
      
      // 1. Subir la imagen a Supabase Storage
      const imageUrl = await postService.uploadImage(selectedFile);
      
      // 2. Enviar los datos del producto con la URL de la imagen
      await onSubmit({
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        seller: currentUser?.name || "USER",
        sellerEmail: currentUser?.email || "user@example.com",
      });
    } catch (err) {
      setLocalError(err.message || t("uploadForm.submitError", "Could not upload product."));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const displayError = localError || error;
  const isPending = isLoading || isUploadingImage;

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
            disabled={isPending}
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
            disabled={isPending}
            maxLength={500}
            rows={4}
          />
          <small className="char-count">
            {formData.description.length}/500
          </small>
        </div>

        <div className="form-row-2">
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
              disabled={isPending}
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
              disabled={isPending}
              step="0.01"
              min="0"
            />
          </div>
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
            disabled={isPending}
          >
            <option value="clothing">{t("uploadForm.categoryClothing", "Clothing")}</option>
            <option value="accessories">{t("uploadForm.categoryAccessories", "Accessories")}</option>
            <option value="bags">{t("uploadForm.categoryBags", "Bags")}</option>
            <option value="shoes">{t("uploadForm.categoryShoes", "Shoes")}</option>
            <option value="home">{t("uploadForm.categoryHome", "Home Decor")}</option>
          </select>
        </div>

        {/* Image Attachment */}
        <div className="form-group">
          <label>
            {t("uploadForm.image", "Product Image")}
            <span className="required">*</span>
          </label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
            disabled={isPending}
          />

          {!imagePreview ? (
            <div 
              className="file-upload-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={40} strokeWidth={1} />
              <p>{t("uploadForm.attachImage", "Click to attach image from device")}</p>
              <span>{t("uploadForm.maxSize", "Max 5MB - JPG, PNG")}</span>
            </div>
          ) : (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="upload-preview-img" />
              <button 
                type="button" 
                className="remove-image-btn"
                onClick={handleRemoveFile}
                disabled={isPending}
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="form-group">
          <label>{t("uploadForm.sizes", "Available Sizes")}</label>
          <div className="sizes-grid">
            {["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"].map((size) => (
              <label key={size} className="size-checkbox-pill">
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                  disabled={isPending}
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
            disabled={isPending}
          >
            {t("uploadForm.cancel", "CANCEL")}
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isPending}
          >
            <Upload size={18} aria-hidden="true" />
            {isPending
              ? t("uploadForm.uploading", "UPLOADING...")
              : t("uploadForm.upload", "UPLOAD ITEM")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProductForm;
