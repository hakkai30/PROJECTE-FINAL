import { supabase } from "../config/supabase";

// Gestión de hilos y mensajes de la parte social privada.
export const messageService = {
  async getThreads() {
    const { data, error } = await supabase
      .from('message_threads')
      .select(`
        *,
        messages (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async sendMessage(threadId, payload) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        thread_id: threadId,
        sender: payload.sender || "me",
        text: payload.text,
        time: payload.time || new Date().toLocaleTimeString(),
        ts: payload.ts || Date.now(),
        status: "sent"
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async markAsRead(messageId) {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('id', messageId);
    
    if (error) console.error("Could not mark message as read:", error);
  },

  subscribeToMessages(onInsert, onUpdate) {
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        onInsert?.(payload.new);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, payload => {
        onUpdate?.(payload.new);
      })
      .subscribe();

    return {
      close: () => {
        supabase.removeChannel(subscription);
      }
    };
  },
};
