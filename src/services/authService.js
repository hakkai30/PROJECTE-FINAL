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
    return null; // Supabase gestiona su propio token internamente
  },

  loadCurrentUser() {
    // Devuelve el usuario de la cache local (para renders inmediatos)
    return readJson(STORAGE_KEYS.currentUser, null);
  },

  async register({ name, email, password, bio = "", avatar = "" }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            bio,
            avatar
          }
        }
      });

      if (error) throw error;

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

      // Obtener datos extra de nuestra tabla pública (como bio, avatar)
      const { data: userRecord } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const publicUser = toPublicUser(data.user, userRecord);
      writeJson(STORAGE_KEYS.currentUser, publicUser);

      return { ok: true, user: publicUser };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  },

  async updateProfile({ bio = "", avatar = "" }) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("No hay una sesión activa.");
      
      const user = sessionData.session.user;

      // Actualizar en la tabla pública
      const { error: dbError } = await supabase
        .from('users')
        .update({ bio, avatar })
        .eq('id', user.id);

      if (dbError) throw dbError;

      // Actualizar en la metadata de autenticación
      await supabase.auth.updateUser({
        data: { bio, avatar }
      });

      // Obtener el registro actualizado
      const { data: userRecord } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const publicUser = toPublicUser(user, userRecord);
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
