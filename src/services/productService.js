import { supabase } from "../config/supabase";

export const productService = {
  /**
   * Obtiene todos los productos de la base de datos.
   */
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Mapeamos los datos para que coincidan con el formato que ya usa la App
      return data.map(item => ({
        ...item,
        nameByLang: item.name_by_lang, // Adaptamos el nombre de la columna
      }));
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
      return [];
    }
  },

  /**
   * Obtiene productos por categoría.
   */
  async getProductsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        ...item,
        nameByLang: item.name_by_lang,
      }));
    } catch (error) {
      console.error(`Error al obtener productos de ${category}:`, error.message);
      return [];
    }
  },

  /**
   * Obtiene un solo producto por ID.
   */
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return {
        ...data,
        nameByLang: data.name_by_lang,
      };
    } catch (error) {
      console.error("Error al obtener producto:", error.message);
      return null;
    }
  }
};
