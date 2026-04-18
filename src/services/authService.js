const STORAGE_KEYS = {
  users: "rtf_auth_users",
  currentUser: "rtf_current_user",
};

const AUTH_ENDPOINTS = {
  register: "/api/auth/register",
  login: "/api/auth/login",
  logout: "/api/auth/logout",
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

const toPublicUser = (user) => ({
  name: user.name,
  email: user.email,
});

const canUseRemoteAuth = () => REMOTE_AUTH_ENABLED && Boolean(API_BASE_URL);

const getEndpointUrl = (path) => `${API_BASE_URL}${path}`;

const saveCurrentUser = (user) => {
  writeJson(STORAGE_KEYS.currentUser, user);
};

const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
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
      name: body.user.name || body.user.email.split("@")[0],
      email: body.user.email,
    },
  };
};

const registerLocal = ({ name, email, password }) => {
  const users = readJson(STORAGE_KEYS.users, []);
  const normalizedEmail = normalizeEmail(email);
  const alreadyExists = users.some((user) => user.email === normalizedEmail);

  if (alreadyExists) {
    return { ok: false, error: "Aquest correu ja esta registrat." };
  }

  const nextUser = {
    id: Date.now(),
    name: name.trim() || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    password,
  };

  const updatedUsers = [...users, nextUser];
  writeJson(STORAGE_KEYS.users, updatedUsers);
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

  const publicUser = toPublicUser(matchedUser);
  saveCurrentUser(publicUser);
  return { ok: true, user: publicUser };
};

export const authService = {
  loadCurrentUser() {
    const user = readJson(STORAGE_KEYS.currentUser, null);
    if (!user || !user.email) return null;
    return user;
  },

  async register(payload) {
    if (canUseRemoteAuth()) {
      try {
        const result = await requestAuth(AUTH_ENDPOINTS.register, payload);
        if (result.ok) saveCurrentUser(result.user);
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
        if (result.ok) saveCurrentUser(result.user);
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
