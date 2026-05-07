import { supabase } from "../config/supabase";
import { authService } from "./authService";
import { notificationService } from "./notificationService";

// Acciones de red social que no pertenecen al post en sí: seguir, guardar y ver perfiles.
export const socialService = {
  async getProfile(handle) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', handle)
      .single();

    if (error) throw new Error("Could not load profile.");
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

    // Trigger notification
    try {
      const { data: targetUser } = await supabase.from('users').select('id').eq('email', handle).single();
      if (targetUser) {
        await notificationService.createNotification({
          userId: targetUser.id,
          actorId: currentUser.id,
          type: 'follow',
          content: 'ha empezado a seguirte'
        });
      }
    } catch (e) { console.warn("Follow notif error", e); }

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
    if (!currentUser) return;

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('saved_post_ids')
      .eq('id', currentUser.id)
      .single();

    if (fetchError) throw new Error("No se pudo cargar la lista de guardados.");

    const currentSaved = user.saved_post_ids || [];
    const isSaved = currentSaved.includes(postId);
    
    const newSaved = isSaved 
      ? currentSaved.filter(id => id !== postId)
      : [...currentSaved, postId];

    const { error } = await supabase
      .from('users')
      .update({ saved_post_ids: newSaved })
      .eq('id', currentUser.id);

    if (error) throw new Error("No se pudo actualizar la lista de guardados.");
    return newSaved;
  }
};
