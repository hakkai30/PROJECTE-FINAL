const STORAGE_KEYS = {
  users: "rtf_auth_users",
  currentUser: "rtf_current_user",
  token: "rtf_auth_token",
};

const AUTH_ENDPOINTS = {
  register: "/api/auth/register",
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  profile: "/api/auth/profile",
};

const API_BASE_URL = (import.meta.env.VITE_AUTH_API_URL || "").trim();
const REMOTE_AUTH_ENABLED = import.meta.env.VITE_USE_REMOTE_AUTH === "true";

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const buildUserId = (email) => normalizeEmail(email);

const toPublicUser = (user) => ({
  id: user.id || buildUserId(user.email),
  name: user.name,
  email: user.email,
  bio: user.bio || "",
  avatar: user.avatar || "",
});

const canUseRemoteAuth = () => REMOTE_AUTH_ENABLED && Boolean(API_BASE_URL);

const getEndpointUrl = (path) => `${API_BASE_URL}${path}`;

const saveCurrentUser = (user) => {
  writeJson(STORAGE_KEYS.currentUser, user);
};

const saveToken = (token) => {
  if (!token) return;
  localStorage.setItem(STORAGE_KEYS.token, token);
};

const readToken = () => {
  return localStorage.getItem(STORAGE_KEYS.token) || "";
};

const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  localStorage.removeItem(STORAGE_KEYS.token);
};

const requestAuth = async (path, payload) => {
  const response = await fetch(getEndpointUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      error: body?.error || "Error d'autenticacio.",
    };
  }

  if (!body?.user?.email) {
    return {
      ok: false,
      error: "Resposta del servidor no valida.",
    };
  }

  return {
    ok: true,
    user: {
      id: body.user.id || buildUserId(body.user.email),
      name: body.user.name || body.user.email.split("@")[0],
      email: body.user.email,
      bio: body.user.bio || "",
      avatar: body.user.avatar || "",
    },
    token: body.token || "",
  };
};

const requestProfileUpdate = async (payload) => {
  const token = readToken();
  const response = await fetch(getEndpointUrl(AUTH_ENDPOINTS.profile), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      error: body?.error || "No s'ha pogut actualitzar el perfil.",
    };
  }

  if (!body?.user?.email) {
    return {
      ok: false,
      error: "Resposta del servidor no valida.",
    };
  }

  return {
    ok: true,
    user: {
      id: body.user.id || buildUserId(body.user.email),
      name: body.user.name || body.user.email.split("@")[0],
      email: body.user.email,
      bio: body.user.bio || "",
      avatar: body.user.avatar || "",
    },
  };
};

const registerLocal = ({ name, email, password, bio = "", avatar = "" }) => {
  const users = readJson(STORAGE_KEYS.users, []);
  const normalizedEmail = normalizeEmail(email);
  const alreadyExists = users.some((user) => user.email === normalizedEmail);

  if (alreadyExists) {
    return { ok: false, error: "Aquest correu ja esta registrat." };
  }

  const nextUser = {
    id: buildUserId(normalizedEmail),
    name: name.trim() || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    password,
    bio: String(bio || "").trim(),
    avatar: String(avatar || "").trim(),
  };

  const updatedUsers = [...users, nextUser];
  writeJson(STORAGE_KEYS.users, updatedUsers);
  localStorage.removeItem(STORAGE_KEYS.token);
  const publicUser = toPublicUser(nextUser);
  saveCurrentUser(publicUser);

  return { ok: true, user: publicUser };
};

const loginLocal = ({ email, password }) => {
  const users = readJson(STORAGE_KEYS.users, []);
  const normalizedEmail = normalizeEmail(email);

  const matchedUser = users.find(
    (user) => user.email === normalizedEmail && user.password === password
  );

  if (!matchedUser) {
    return { ok: false, error: "Credencials incorrectes." };
  }

  localStorage.removeItem(STORAGE_KEYS.token);
  const publicUser = toPublicUser(matchedUser);
  saveCurrentUser(publicUser);
  return { ok: true, user: publicUser };
};

const updateProfileLocal = ({ bio = "", avatar = "" }) => {
  const currentUser = readJson(STORAGE_KEYS.currentUser, null);
  if (!currentUser?.email) {
    return { ok: false, error: "No hi ha cap sessio activa." };
  }

  const normalizedEmail = normalizeEmail(currentUser.email);
  const users = readJson(STORAGE_KEYS.users, []);

  const updatedUsers = users.map((user) => {
    if (normalizeEmail(user.email) !== normalizedEmail) return user;
    return {
      ...user,
      bio: String(bio || "").trim(),
      avatar: String(avatar || "").trim(),
    };
  });

  writeJson(STORAGE_KEYS.users, updatedUsers);

  const updatedCurrentUser = {
    ...currentUser,
    bio: String(bio || "").trim(),
    avatar: String(avatar || "").trim(),
  };

  saveCurrentUser(updatedCurrentUser);
  return { ok: true, user: updatedCurrentUser };
};

export const authService = {
  getAuthToken() {
    return readToken();
  },

  loadCurrentUser() {
    const user = readJson(STORAGE_KEYS.currentUser, null);
    if (!user || !user.email) return null;
    return user;
  },

  async register(payload) {
    if (canUseRemoteAuth()) {
      try {
        const result = await requestAuth(AUTH_ENDPOINTS.register, payload);
        if (result.ok) {
          saveCurrentUser(result.user);
          saveToken(result.token);
        }
        return result;
      } catch {
        const localResult = registerLocal(payload);
        return {
          ...localResult,
          offlineFallback: true,
        };
      }
    }

    return registerLocal(payload);
  },

  async login(payload) {
    if (canUseRemoteAuth()) {
      try {
        const result = await requestAuth(AUTH_ENDPOINTS.login, payload);
        if (result.ok) {
          saveCurrentUser(result.user);
          saveToken(result.token);
        }
        return result;
      } catch {
        const localResult = loginLocal(payload);
        return {
          ...localResult,
          offlineFallback: true,
        };
      }
    }

    return loginLocal(payload);
  },

  async updateProfile(payload) {
    if (canUseRemoteAuth()) {
      try {
        const result = await requestProfileUpdate(payload);
        if (result.ok) {
          saveCurrentUser(result.user);
          const users = readJson(STORAGE_KEYS.users, []);
          const normalizedEmail = normalizeEmail(result.user.email);
          const existsLocally = users.some((user) => normalizeEmail(user.email) === normalizedEmail);

          if (existsLocally) {
            const mergedUsers = users.map((user) =>
              normalizeEmail(user.email) === normalizedEmail
                ? {
                    ...user,
                    bio: result.user.bio || "",
                    avatar: result.user.avatar || "",
                  }
                : user
            );
            writeJson(STORAGE_KEYS.users, mergedUsers);
          }
        }
        return result;
      } catch {
        const localResult = updateProfileLocal(payload);
        return {
          ...localResult,
          offlineFallback: true,
        };
      }
    }

    return updateProfileLocal(payload);
  },

  async logout() {
    if (canUseRemoteAuth()) {
      try {
        await fetch(getEndpointUrl(AUTH_ENDPOINTS.logout), {
          method: "POST",
        });
      } catch {
        // Ignore network errors and clear local session anyway.
      }
    }

    clearCurrentUser();
  },
};
