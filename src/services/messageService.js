const MESSAGES_API_URL = (import.meta.env.VITE_POSTS_API_URL || "http://localhost:3000").trim();

const getEndpointUrl = (path = "") => `${MESSAGES_API_URL}/api/messages${path}`;

const parseJsonBody = async (response) => {
  return response.json().catch(() => ({}));
};

const toErrorMessage = (body, fallback) => body?.error || fallback;

export const messageService = {
  async getThreads() {
    const response = await fetch(getEndpointUrl("/threads"));
    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not load threads."));
    }

    return Array.isArray(body?.threads) ? body.threads : [];
  },

  async sendMessage(threadId, payload) {
    const response = await fetch(getEndpointUrl(`/threads/${encodeURIComponent(String(threadId))}/messages`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not send message."));
    }

    return body?.message || null;
  },

  subscribeToMessages(onEvent) {
    const streamUrl = getEndpointUrl("/stream");
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        onEvent?.(payload);
      } catch {
        // Ignore malformed event payloads.
      }
    };

    return eventSource;
  },
};
