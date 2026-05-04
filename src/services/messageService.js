import { supabase } from "../config/supabase";

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
        status: payload.status || "sent"
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  subscribeToMessages(onEvent) {
    // Suscripción en tiempo real de Supabase
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        onEvent?.(payload.new);
      })
      .subscribe();

    // Emula el método close del EventSource original
    return {
      close: () => {
        supabase.removeChannel(subscription);
      }
    };
  },
};
