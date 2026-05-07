import { supabase } from "../config/supabase";

// CRUD de los productos publicados por usuarios dentro de la comunidad.
export const userProductService = {
  async getAllUserProducts() {
    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getUserProductsByEmail(sellerEmail) {
    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .eq('seller_email', sellerEmail)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
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
    const { data, error } = await supabase
      .from('user_products')
      .insert([{
        name,
        description,
        gender,
        price,
        image,
        sizes,
        category,
        seller,
        seller_email: sellerEmail,
        is_sold: false
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteUserProduct(productId) {
    const { error } = await supabase
      .from('user_products')
      .delete()
      .eq('id', productId);

    if (error) throw new Error(error.message);
    return true;
  },

  async toggleUserProductLike(productId, { direction = "up" } = {}) {
    const increment = direction === "up" ? 1 : -1;
    
    const { data: product, error: fetchError } = await supabase
      .from('user_products')
      .select('likes')
      .eq('id', productId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const { data, error } = await supabase
      .from('user_products')
      .update({ likes: Math.max(0, (product.likes || 0) + increment) })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateProductStatus(productId, isSold) {
    const { data, error } = await supabase
      .from('user_products')
      .update({ is_sold: isSold })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
