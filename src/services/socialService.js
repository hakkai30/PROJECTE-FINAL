import { authService } from "./authService";

const SOCIAL_API_URL = (import.meta.env.VITE_POSTS_API_URL || "http://localhost:3000").trim();

const getEndpointUrl = (path = "") => `${SOCIAL_API_URL}/api/social${path}`;

const parseJsonBody = async (response) => response.json().catch(() => ({}));
const toErrorMessage = (body, fallback) => body?.error || fallback;

const requestWithAuth = async (path, options = {}, fallbackMessage) => {
  const token = authService.getAuthToken?.() || "";
  const response = await fetch(getEndpointUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const body = await parseJsonBody(response);

  if (!response.ok) {
    throw new Error(toErrorMessage(body, fallbackMessage));
  }

  return body;
};

export const socialService = {
  async getProfile(handle) {
    const body = await requestWithAuth(
      `/profiles/${encodeURIComponent(String(handle || ""))}`,
      { method: "GET" },
      "Could not load profile."
    );

    return body?.profile || null;
  },

  async followProfile(handle) {
    const body = await requestWithAuth(
      `/profiles/${encodeURIComponent(String(handle || ""))}/follow`,
      { method: "POST" },
      "Could not follow profile."
    );

    return Boolean(body?.ok);
  },

  async unfollowProfile(handle) {
    const body = await requestWithAuth(
      `/profiles/${encodeURIComponent(String(handle || ""))}/follow`,
      { method: "DELETE" },
      "Could not unfollow profile."
    );

    return Boolean(body?.ok);
  },
};
