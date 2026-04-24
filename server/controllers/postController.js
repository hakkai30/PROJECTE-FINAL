let posts = [
  {
    id: "seed-1",
    user: "RobTheCreator",
    likes: 1240,
    desc: "Passejos per la ciutat amb la nova col·lecció SS24. Ja disponible.",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    user: "FabioStyles",
    likes: 892,
    desc: "Els detalls importen. Capes per al fred.",
    img: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=800&q=80",
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getPostsSnapshot = () => {
  return Array.isArray(posts) ? [...posts] : [];
};

const createPostId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const createCommentId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const createPost = async (req, res) => {
  try {
    const { text, imageUrl = "", user = "USER" } = req.body || {};

    if (!text?.trim()) {
      return res.status(400).json({ error: "Post text is required." });
    }

    const nextPost = {
      id: createPostId(),
      user: String(user || "USER").trim() || "USER",
      likes: 0,
      desc: String(text).trim(),
      img: String(imageUrl || "").trim(),
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    posts = [nextPost, ...posts];

    return res.status(201).json({
      post: nextPost,
    });
  } catch {
    return res.status(500).json({ error: "Server error while creating post." });
  }
};

export const getFeedPosts = async (_req, res) => {
  try {
    return res.json({ posts });
  } catch {
    return res.status(500).json({ error: "Server error while fetching posts." });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const beforeCount = posts.length;
    posts = posts.filter((post) => post.id !== id);

    if (posts.length === beforeCount) {
      return res.status(404).json({ error: "Post not found." });
    }

    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Server error while deleting post." });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = posts.find((item) => item.id === id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const direction = req.query.direction === "down" ? -1 : 1;
    post.likes = Math.max(0, Number(post.likes || 0) + direction);
    post.updatedAt = new Date().toISOString();

    return res.json({
      liked: direction > 0,
      post,
    });
  } catch {
    return res.status(500).json({ error: "Server error while toggling like." });
  }
};

export const addCommentToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, user = "USER" } = req.body || {};

    if (!text?.trim()) {
      return res.status(400).json({ error: "Comment text is required." });
    }

    const post = posts.find((item) => item.id === id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const comment = {
      id: createCommentId(),
      user: String(user || "USER").trim() || "USER",
      text: String(text).trim(),
      createdAt: new Date().toISOString(),
    };

    post.comments = Array.isArray(post.comments) ? [...post.comments, comment] : [comment];
    post.updatedAt = new Date().toISOString();

    return res.status(201).json({
      comment,
      post,
    });
  } catch {
    return res.status(500).json({ error: "Server error while adding comment." });
  }
};

export const deleteCommentFromPost = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const post = posts.find((item) => item.id === id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const currentComments = Array.isArray(post.comments) ? post.comments : [];
    const nextComments = currentComments.filter((comment) => comment.id !== commentId);

    if (nextComments.length === currentComments.length) {
      return res.status(404).json({ error: "Comment not found." });
    }

    post.comments = nextComments;
    post.updatedAt = new Date().toISOString();

    return res.json({
      ok: true,
      post,
    });
  } catch {
    return res.status(500).json({ error: "Server error while deleting comment." });
  }
};
