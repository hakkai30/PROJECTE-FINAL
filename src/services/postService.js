const POSTS_API_URL = (import.meta.env.VITE_POSTS_API_URL || "http://localhost:3000").trim();

const getEndpointUrl = (path = "") => `${POSTS_API_URL}/api/posts${path}`;

const parseJsonBody = async (response) => {
  return response.json().catch(() => ({}));
};

const toErrorMessage = (body, fallback) => body?.error || fallback;

export const postService = {
  async getFeedPosts() {
    const response = await fetch(getEndpointUrl());
    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not load posts."));
    }

    return Array.isArray(body?.posts) ? body.posts : [];
  },

  async createPost({ text, imageUrl = "", user = "USER" }) {
    const response = await fetch(getEndpointUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, imageUrl, user }),
    });

    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not create post."));
    }

    return body?.post || null;
  },

  async toggleLikePost(postId, { direction = "up" } = {}) {
    const normalizedDirection = direction === "down" ? "down" : "up";
    const response = await fetch(
      getEndpointUrl(`/${encodeURIComponent(String(postId))}/like?direction=${normalizedDirection}`),
      {
        method: "PATCH",
      }
    );

    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not update like."));
    }

    return body?.post || null;
  },

  async addCommentToPost(postId, { text, user = "USER" }) {
    const response = await fetch(getEndpointUrl(`/${encodeURIComponent(String(postId))}/comments`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, user }),
    });

    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not add comment."));
    }

    return {
      post: body?.post || null,
      comment: body?.comment || null,
    };
  },

  async deleteCommentFromPost(postId, commentId) {
    const response = await fetch(
      getEndpointUrl(
        `/${encodeURIComponent(String(postId))}/comments/${encodeURIComponent(String(commentId))}`
      ),
      {
        method: "DELETE",
      }
    );

    const body = await parseJsonBody(response);

    if (!response.ok) {
      throw new Error(toErrorMessage(body, "Could not delete comment."));
    }

    return body?.post || null;
  },
};
