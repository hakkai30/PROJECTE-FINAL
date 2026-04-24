import { getPostsSnapshot } from "./postController.js";
import { User } from "../models/User.js";

const normalizeHandle = (value) => String(value || "").trim().replace(/^@/, "").toLowerCase();
const displayHandle = (value) => String(value || "").trim().replace(/^@/, "");
const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const inMemoryFollowing = new Map();
const inMemoryFollowers = new Map();

const ensureSet = (map, key) => {
  const normalizedKey = normalizeHandle(key);
  if (!normalizedKey) return null;
  if (!map.has(normalizedKey)) {
    map.set(normalizedKey, new Set());
  }
  return map.get(normalizedKey);
};

const applyFollowEdge = (sourceHandle, targetHandle) => {
  const normalizedSource = normalizeHandle(sourceHandle);
  const normalizedTarget = normalizeHandle(targetHandle);
  if (!normalizedSource || !normalizedTarget || normalizedSource === normalizedTarget) return;

  ensureSet(inMemoryFollowing, normalizedSource)?.add(normalizedTarget);
  ensureSet(inMemoryFollowers, normalizedTarget)?.add(normalizedSource);
};

const removeFollowEdge = (sourceHandle, targetHandle) => {
  const normalizedSource = normalizeHandle(sourceHandle);
  const normalizedTarget = normalizeHandle(targetHandle);
  if (!normalizedSource || !normalizedTarget || normalizedSource === normalizedTarget) return;

  ensureSet(inMemoryFollowing, normalizedSource)?.delete(normalizedTarget);
  ensureSet(inMemoryFollowers, normalizedTarget)?.delete(normalizedSource);
};

const getFollowerCount = (user, handle) => {
  const fromDb = Array.isArray(user?.followerHandles) ? user.followerHandles.length : 0;
  const fromMemory = ensureSet(inMemoryFollowers, handle)?.size || 0;
  return Math.max(fromDb, fromMemory);
};

const getFollowingCount = (user, handle) => {
  const fromDb = Array.isArray(user?.followingHandles) ? user.followingHandles.length : 0;
  const fromMemory = ensureSet(inMemoryFollowing, handle)?.size || 0;
  return Math.max(fromDb, fromMemory);
};

const buildProfilePayload = ({ targetUser, handle, viewerHandle, posts }) => {
  const normalizedHandle = normalizeHandle(handle);
  const postsByHandle = posts
    .filter((post) => normalizeHandle(post.user) === normalizedHandle)
    .slice(0, 24);

  const viewerFollowingFromDb = Array.isArray(viewerHandle?.dbFollowing)
    ? viewerHandle.dbFollowing.includes(normalizedHandle)
    : false;
  const viewerFollowingFromMemory = ensureSet(inMemoryFollowing, viewerHandle?.handle || "")?.has(normalizedHandle) || false;

  return {
    profile: {
      handle: displayHandle(targetUser?.name || handle),
      name: targetUser?.name ? `@${targetUser.name}` : `@${displayHandle(handle)}`,
      bio: targetUser?.bio || "Creative profile on ROB_THE_FAB.",
      avatar: targetUser?.avatar || targetUser?.image || "",
      followersCount: getFollowerCount(targetUser, normalizedHandle),
      followingCount: getFollowingCount(targetUser, normalizedHandle),
      posts: postsByHandle,
      postCount: postsByHandle.length,
      isFollowing: viewerFollowingFromDb || viewerFollowingFromMemory,
      isCurrentUser: normalizeHandle(viewerHandle?.handle) === normalizedHandle,
      email: normalizeHandle(viewerHandle?.handle) === normalizedHandle ? targetUser?.email || "" : "",
    },
  };
};

export const getProfile = async (req, res) => {
  try {
    const handle = displayHandle(req.params.handle || "");
    const normalizedHandle = normalizeHandle(handle);

    if (!normalizedHandle) {
      return res.status(400).json({ error: "Profile handle is required." });
    }

    const targetUser = await User.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(handle)}$`, "i") },
    }).lean();

    let viewer = null;
    if (req.user?.id) {
      viewer = await User.findById(req.user.id).lean();
    }

    const posts = getPostsSnapshot();

    return res.json(
      buildProfilePayload({
        targetUser,
        handle,
        viewerHandle: {
          handle: viewer?.name || req.user?.name || "",
          dbFollowing: viewer?.followingHandles || [],
        },
        posts,
      })
    );
  } catch {
    return res.status(500).json({ error: "Server error while fetching profile." });
  }
};

export const followProfile = async (req, res) => {
  try {
    const targetHandleRaw = displayHandle(req.params.handle || "");
    const targetHandle = normalizeHandle(targetHandleRaw);
    if (!targetHandle) {
      return res.status(400).json({ error: "Target profile handle is required." });
    }

    const currentUser = await User.findById(req.user?.id);
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sourceHandle = normalizeHandle(currentUser.name);
    if (!sourceHandle || sourceHandle === targetHandle) {
      return res.status(400).json({ error: "You cannot follow this profile." });
    }

    if (!Array.isArray(currentUser.followingHandles)) currentUser.followingHandles = [];
    if (!currentUser.followingHandles.includes(targetHandle)) {
      currentUser.followingHandles.push(targetHandle);
      await currentUser.save();
    }

    const targetUser = await User.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(targetHandleRaw)}$`, "i") },
    });

    if (targetUser) {
      if (!Array.isArray(targetUser.followerHandles)) targetUser.followerHandles = [];
      if (!targetUser.followerHandles.includes(sourceHandle)) {
        targetUser.followerHandles.push(sourceHandle);
        await targetUser.save();
      }
    }

    applyFollowEdge(sourceHandle, targetHandle);

    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Server error while following profile." });
  }
};

export const unfollowProfile = async (req, res) => {
  try {
    const targetHandleRaw = displayHandle(req.params.handle || "");
    const targetHandle = normalizeHandle(targetHandleRaw);
    if (!targetHandle) {
      return res.status(400).json({ error: "Target profile handle is required." });
    }

    const currentUser = await User.findById(req.user?.id);
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sourceHandle = normalizeHandle(currentUser.name);
    if (!sourceHandle || sourceHandle === targetHandle) {
      return res.status(400).json({ error: "You cannot unfollow this profile." });
    }

    currentUser.followingHandles = Array.isArray(currentUser.followingHandles)
      ? currentUser.followingHandles.filter((item) => item !== targetHandle)
      : [];
    await currentUser.save();

    const targetUser = await User.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(targetHandleRaw)}$`, "i") },
    });

    if (targetUser) {
      targetUser.followerHandles = Array.isArray(targetUser.followerHandles)
        ? targetUser.followerHandles.filter((item) => item !== sourceHandle)
        : [];
      await targetUser.save();
    }

    removeFollowEdge(sourceHandle, targetHandle);

    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Server error while unfollowing profile." });
  }
};
