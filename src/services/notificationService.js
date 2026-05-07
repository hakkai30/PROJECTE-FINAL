import { supabase } from "../config/supabase";

// Notificaciones en tiempo real para likes, comentarios y follows.
export const notificationService = {
  async getNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:users!notifications_actor_id_fkey(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw new Error(error.message);
    return data || [];
  },

  async markAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw new Error(error.message);
  },

  async createNotification({ userId, actorId, type, content }) {
    if (userId === actorId) return; // No auto-notificar

    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        actor_id: actorId,
        type,
        content
      }]);

    if (error) console.warn("Could not create notification:", error);
  },

  subscribeToNotifications(userId, onNotification) {
    const subscription = supabase
      .channel(`public:notifications:user_id=eq.${userId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${userId}` 
      }, payload => {
        onNotification?.(payload.new);
      })
      .subscribe();

    return {
      close: () => {
        supabase.removeChannel(subscription);
      }
    };
  }
};
