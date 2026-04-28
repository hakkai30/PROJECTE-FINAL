let userProducts = [
  {
    id: "up-seed-1",
    seller: "RobTheCreator",
    sellerEmail: "rob@example.com",
    name: "Vintage Denim Jacket",
    description: "Classic blue denim jacket with minimal wear. Perfect condition.",
    gender: "men",
    price: 45.0,
    image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&q=80",
    sizes: ["S", "M", "L"],
    category: "clothing",
    likes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "up-seed-2",
    seller: "FabioStyles",
    sellerEmail: "fabio@example.com",
    name: "Leather Crossbody Bag",
    description: "Brown leather crossbody bag. Excellent condition, lightly used.",
    gender: "unisex",
    price: 35.0,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
    sizes: ["ONE SIZE"],
    category: "bags",
    likes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getUserProductsSnapshot = () => {
  return Array.isArray(userProducts) ? [...userProducts] : [];
};

const createProductId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createUserProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      gender = "unisex",
      price = 0,
      image = "",
      sizes = ["ONE SIZE"],
      category = "clothing",
      seller = "USER",
      sellerEmail = "user@example.com",
    } = req.body || {};

    if (!name?.trim()) {
      return res.status(400).json({ error: "Product name is required." });
    }

    if (!description?.trim()) {
      return res.status(400).json({ error: "Product description is required." });
    }

    if (price < 0) {
      return res.status(400).json({ error: "Price must be a positive number." });
    }

    const nextProduct = {
      id: createProductId(),
      seller: String(seller || "USER").trim() || "USER",
      sellerEmail: String(sellerEmail || "user@example.com")
        .trim()
        .toLowerCase(),
      name: String(name).trim(),
      description: String(description).trim(),
      gender: String(gender || "unisex").trim(),
      price: Number(price),
      image: String(image || "").trim(),
      sizes: Array.isArray(sizes) ? sizes : ["ONE SIZE"],
      category: String(category || "clothing").trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userProducts = [nextProduct, ...userProducts];

    return res.status(201).json({
      product: nextProduct,
    });
  } catch {
    return res
      .status(500)
      .json({ error: "Server error while creating product." });
  }
};

export const getUserProducts = async (_req, res) => {
  try {
    return res.json({ products: userProducts });
  } catch {
    return res
      .status(500)
      .json({ error: "Server error while fetching products." });
  }
};

export const getUserProductsByUser = async (req, res) => {
  try {
    const { sellerEmail } = req.params;

    if (!sellerEmail?.trim()) {
      return res.status(400).json({ error: "Seller email is required." });
    }

    const normalizedEmail = String(sellerEmail).trim().toLowerCase();
    const userProds = userProducts.filter(
      (prod) => prod.sellerEmail === normalizedEmail
    );

    return res.json({ products: userProds });
  } catch {
    return res
      .status(500)
      .json({ error: "Server error while fetching user products." });
  }
};

export const deleteUserProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const beforeCount = userProducts.length;
    userProducts = userProducts.filter((prod) => prod.id !== id);

    if (userProducts.length === beforeCount) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.json({ ok: true });
  } catch {
    return res
      .status(500)
      .json({ error: "Server error while deleting product." });
  }
};

export const toggleUserProductLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { direction = "up" } = req.query;

    const normalizedDirection = direction === "down" ? "down" : "up";
    const product = userProducts.find((prod) => prod.id === id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (normalizedDirection === "up") {
      product.likes = Number(product.likes || 0) + 1;
    } else {
      product.likes = Math.max(0, Number(product.likes || 0) - 1);
    }

    product.updatedAt = new Date().toISOString();

    return res.json({ product });
  } catch {
    return res.status(500).json({ error: "Server error while updating like." });
  }
};
