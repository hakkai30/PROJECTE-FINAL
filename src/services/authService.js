import { supabase } from "../config/supabase";

const STORAGE_KEYS = {
  currentUser: "rtf_current_user",
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

// Convierte el usuario de Supabase en un objeto simple que usa la app.
const toPublicUser = (supabaseUser, userRecord) => {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: userRecord?.name || supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
    bio: userRecord?.bio || supabaseUser.user_metadata?.bio || "",
    avatar: userRecord?.avatar || supabaseUser.user_metadata?.avatar || "",
  };
};

export const authService = {
  getAuthToken() {
    return null;
  },

  // Sesión local en memoria del navegador para no forzar login en cada recarga.
  loadCurrentUser() {
    return readJson(STORAGE_KEYS.currentUser, null);
  },

  /** Recupera la sesión activa de Supabase y sincroniza el localStorage */
  async restoreSession() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        localStorage.removeItem(STORAGE_KEYS.currentUser);
        return null;
      }

      const user = sessionData.session.user;

      const { data: userRecord } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const publicUser = toPublicUser(user, userRecord);
      writeJson(STORAGE_KEYS.currentUser, publicUser);
      return publicUser;
    } catch {
      return readJson(STORAGE_KEYS.currentUser, null);
    }
  },

  async register({ name, email, password, bio = "", avatar = "" }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, bio, avatar }
        }
      });

      if (error) throw error;

      // Sincronizar manualmente con la tabla pública de users
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: email,
          name: name,
          bio: bio,
          avatar: avatar
        });
      }

      const publicUser = toPublicUser(data.user, { name, bio, avatar });
      writeJson(STORAGE_KEYS.currentUser, publicUser);

      return { ok: true, user: publicUser };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  },

  async login({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Asegurar que existe en la tabla pública al loguearse
      const { data: userRecord } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (!userRecord) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          avatar: data.user.user_metadata?.avatar || ""
        });
      }

      const publicUser = toPublicUser(data.user, userRecord || data.user.user_metadata);
      writeJson(STORAGE_KEYS.currentUser, publicUser);

      return { ok: true, user: publicUser };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  },

  async updateProfile({ bio = "", avatar = "", avatarFile = null }) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("No hay una sesión activa.");
      
      const user = sessionData.session.user;
      let finalAvatarUrl = avatar;

      // Si el usuario ha subido un archivo, subirlo a Storage primero
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images') // Usamos el mismo bucket público
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
        
        finalAvatarUrl = urlData.publicUrl;
      }

      const { error: dbError } = await supabase
        .from('users')
        .update({ bio, avatar: finalAvatarUrl })
        .eq('id', user.id);

      if (dbError) throw dbError;

      await supabase.auth.updateUser({
        data: { bio, avatar: finalAvatarUrl }
      });

      const publicUser = toPublicUser(user, { ...user.user_metadata, bio, avatar: finalAvatarUrl });
      writeJson(STORAGE_KEYS.currentUser, publicUser);

      return { ok: true, user: publicUser };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  },

  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  },
};
