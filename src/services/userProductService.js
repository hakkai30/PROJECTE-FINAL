const USER_PRODUCTS_API_URL = (
  import.meta.env.VITE_USER_PRODUCTS_API_URL || "http://localhost:3000"
).trim();

const getEndpointUrl = (path = "") => `${USER_PRODUCTS_API_URL}/api/user-products${path}`;

const parseJsonBody = async (response) => {
  return response.json().catch(() => ({}));
};

const toErrorMessage = (body, fallback) => body?.error || fallback;

export const userProductService = {
  async getAllUserProducts() {
    const response = await fetch(getEndpointUrl());
    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not load user products."));
    }

    return Array.isArray(body?.products) ? body.products : [];
  },

  async getUserProductsByEmail(sellerEmail) {
    const encoded = encodeURIComponent(String(sellerEmail || "").trim());
    const response = await fetch(getEndpointUrl(`/seller/${encoded}`));
    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(
        toErrorMessage(body, "Could not load seller products.")
      );
    }

    return Array.isArray(body?.products) ? body.products : [];
  },

  async createUserProduct({
    name,
    description,
    gender = "unisex",
    price = 0,
    image = "",
    sizes = ["ONE SIZE"],
    category = "clothing",
    seller = "USER",
    sellerEmail = "user@example.com",
  }) {
    const response = await fetch(getEndpointUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        gender,
        price,
        image,
        sizes,
        category,
        seller,
        sellerEmail,
      }),
    });

    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not create product."));
    }

    return body?.product || null;
  },

  async deleteUserProduct(productId) {
    const response = await fetch(getEndpointUrl(`/${encodeURIComponent(String(productId))}`), {
      method: "DELETE",
    });

    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not delete product."));
    }

    return body?.ok || false;
  },

  async toggleUserProductLike(productId, { direction = "up" } = {}) {
    const normalizedDirection = direction === "down" ? "down" : "up";
    const response = await fetch(
      getEndpointUrl(
        `/${encodeURIComponent(String(productId))}/like?direction=${normalizedDirection}`
      ),
      {
        method: "PATCH",
      }
    );

    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not update like."));
    }

    return body?.product || null;
  },
};
