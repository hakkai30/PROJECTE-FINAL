import { supabase } from "../config/supabase";
import { authService } from "./authService";

// Acciones de red social: seguir/dejar de seguir perfiles y guardar looks.
export const socialService = {
  async getProfile(handle) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', handle)
      .single();

    if (error) throw new Error("No se pudo cargar el perfil.");
    return data;
  },

  async followProfile(handle) {
    const currentUser = authService.loadCurrentUser();
    if (!currentUser) throw new Error("No hay sesión activa.");

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('following_handles')
      .eq('email', currentUser.email)
      .single();

    if (fetchError) throw new Error("No se pudo cargar el usuario.");

    const newFollowing = [...new Set([...(user.following_handles || []), handle])];

    const { error } = await supabase
      .from('users')
      .update({ following_handles: newFollowing })
      .eq('email', currentUser.email);

    if (error) throw new Error("No se pudo seguir el perfil.");
    return true;
  },

  async unfollowProfile(handle) {
    const currentUser = authService.loadCurrentUser();
    if (!currentUser) throw new Error("No hay sesión activa.");

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('following_handles')
      .eq('email', currentUser.email)
      .single();

    if (fetchError) throw new Error("No se pudo cargar el usuario.");

    const newFollowing = (user.following_handles || []).filter(h => h !== handle);

    const { error } = await supabase
      .from('users')
      .update({ following_handles: newFollowing })
      .eq('email', currentUser.email);

    if (error) throw new Error("No se pudo dejar de seguir el perfil.");
    return true;
  },

  async toggleSavedLook(postId) {
    const currentUser = authService.loadCurrentUser();
    if (!currentUser) throw new Error("No hay sesión activa.");

    const normalizedPostId = String(postId);

    // 1. Verificar si ya está guardado
    const { data: existing, error: checkError } = await supabase
      .from('saved_looks')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('post_id', normalizedPostId)
      .maybeSingle();

    if (checkError) throw new Error("Error al verificar guardado.");

    if (existing) {
      // 2. Si existe, lo borramos (Unsave)
      const { error: deleteError } = await supabase
        .from('saved_looks')
        .delete()
        .eq('id', existing.id);
      if (deleteError) throw new Error("No se pudo quitar de guardados.");
      return { isSaved: false };
    } else {
      // 3. Si no existe, lo insertamos (Save)
      const { error: insertError } = await supabase
        .from('saved_looks')
        .insert([{ user_id: currentUser.id, post_id: normalizedPostId }]);
      if (insertError) throw new Error("No se pudo guardar el look.");
      return { isSaved: true };
    }
  },

  async getSavedLookIds(userId) {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('saved_looks')
      .select('post_id')
      .eq('user_id', userId);

    if (error) {
      console.error("Error cargando guardados:", error);
      return [];
    }
    return data.map(item => String(item.post_id));
  }
};
