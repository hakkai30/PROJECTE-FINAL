import mongoose from "mongoose";
import { MessageThread } from "../models/MessageThread.js";

const now = Date.now();

let threads = [
  {
    id: "aura",
    name: "@AURA.STUDIO",
    presence: "online",
    messages: [
      {
        id: "seed-1",
        sender: "them",
        text: "Ei! Demà fem shooting. T'apuntes?",
        time: "10:24",
        ts: now - 1000 * 60 * 80,
      },
      {
        id: "seed-2",
        sender: "me",
        text: "Sí! Puc portar el look negre oversized.",
        time: "10:26",
        ts: now - 1000 * 60 * 78,
        status: "read",
      },
      {
        id: "seed-3",
        sender: "them",
        text: "Perfecte, brutal. Ens veiem a les 17:00.",
        time: "10:27",
        ts: now - 1000 * 60 * 76,
      },
    ],
  },
  {
    id: "marta",
    name: "@MARTA.RTF",
    presence: "online",
    messages: [
      {
        id: "seed-4",
        sender: "them",
        text: "Has vist la nova col·lecció?",
        time: "09:01",
        ts: now - 1000 * 60 * 45,
      },
      {
        id: "seed-5",
        sender: "me",
        text: "Sí, m'encanta la línia denim.",
        time: "09:05",
        ts: now - 1000 * 60 * 40,
        status: "delivered",
      },
      {
        id: "seed-6",
        sender: "them",
        text: "Passem per botiga aquest finde?",
        time: "09:06",
        ts: now - 1000 * 60 * 38,
      },
    ],
  },
  {
    id: "nil",
    name: "@NIL.FASHION",
    presence: "offline",
    messages: [
      {
        id: "seed-7",
        sender: "them",
        text: "Quan puguis, envia'm el link del look.",
        time: "Ahir",
        ts: now - 1000 * 60 * 60 * 20,
      },
    ],
  },
];

const subscribers = new Set();

const AUTO_REPLIES = [
  "M'encanta aquesta idea.",
  "Totalment, això queda increïble.",
  "Ho parlem després del fitting?",
  "Perfecte, t'escric en una estona.",
];

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const createMessage = ({ sender, text, status }) => {
  const ts = Date.now();
  return {
    id: `${ts}-${Math.random().toString(36).slice(2, 8)}`,
    sender,
    text,
    time: formatTime(ts),
    ts,
    ...(status ? { status } : {}),
  };
};

const normalizeThreadId = (threadId) => String(threadId || "").trim().toLowerCase();

const createThreadFromId = (threadId) => {
  const normalizedId = normalizeThreadId(threadId);
  const displayName = normalizedId.replace(/^user:/, "").replace(/[-_]+/g, " ").toUpperCase() || "@USER";

  return {
    id: normalizedId,
    name: `@${displayName}`,
    presence: "online",
    messages: [],
  };
};

const ensureThread = (threadId) => {
  const normalizedId = normalizeThreadId(threadId);
  if (!normalizedId) return null;

  let thread = threads.find((item) => item.id === normalizedId);
  if (!thread) {
    thread = createThreadFromId(normalizedId);
    threads = [thread, ...threads];
  }

  return thread;
};

const isMongoReady = () => mongoose.connection.readyState === 1;

const seedThreadsIfNeeded = async () => {
  if (!isMongoReady()) return;

  const count = await MessageThread.countDocuments();
  if (count > 0) return;

  await MessageThread.insertMany(
    threads.map((thread) => ({
      threadId: thread.id,
      name: thread.name,
      presence: thread.presence,
      messages: thread.messages,
    }))
  );
};

const loadThreads = async () => {
  if (!isMongoReady()) return threads;

  await seedThreadsIfNeeded();
  const docs = await MessageThread.find().sort({ updatedAt: -1 }).lean();

  if (!docs.length) return threads;

  return docs.map((doc) => ({
    id: doc.threadId,
    name: doc.name,
    presence: doc.presence,
    messages: Array.isArray(doc.messages) ? doc.messages : [],
  }));
};

const upsertThread = async (thread) => {
  if (!isMongoReady()) return thread;

  await MessageThread.findOneAndUpdate(
    { threadId: thread.id },
    {
      threadId: thread.id,
      name: thread.name,
      presence: thread.presence,
      messages: thread.messages,
    },
    { upsert: true, new: true }
  );

  return thread;
};

const emitEvent = (payload) => {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const send of subscribers) {
    send(data);
  }
};

const pushThreadMessage = (threadId, message) => {
  const thread = threads.find((item) => item.id === threadId);
  if (!thread) return null;

  thread.messages = [...thread.messages, message];
  return thread;
};

export const getMessageThreads = async (_req, res) => {
  try {
    const storedThreads = await loadThreads();
    if (isMongoReady()) {
      threads = storedThreads;
    }

    return res.json({ threads: storedThreads });
  } catch {
    return res.status(500).json({ error: "Server error while fetching message threads." });
  }
};

export const createThreadMessage = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { text, sender = "me", user = "USER" } = req.body || {};

    if (!text?.trim()) {
      return res.status(400).json({ error: "Message text is required." });
    }

    const normalizedSender = sender === "them" ? "them" : "me";
    const message = createMessage({
      sender: normalizedSender,
      text: String(text).trim(),
      status: normalizedSender === "me" ? "sent" : undefined,
    });

    const thread = ensureThread(threadId);

    if (!thread) {
      return res.status(404).json({ error: "Thread not found." });
    }

    pushThreadMessage(thread.id, message);
    await upsertThread(thread);

    emitEvent({
      type: "message.created",
      threadId: thread.id,
      message,
      user,
    });

    if (normalizedSender === "me") {
      const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];

      setTimeout(() => {
        const reply = createMessage({
          sender: "them",
          text: randomReply,
        });

        const updated = pushThreadMessage(thread.id, reply);
        if (!updated) return;

        upsertThread(updated).catch(() => {});

        emitEvent({
          type: "message.created",
          threadId: thread.id,
          message: reply,
        });
      }, 1000);
    }

    return res.status(201).json({ message, threadId: thread.id, thread });
  } catch {
    return res.status(500).json({ error: "Server error while creating message." });
  }
};

export const streamMessages = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (data) => res.write(data);
  subscribers.add(send);

  send(`data: ${JSON.stringify({ type: "stream.ready" })}\n\n`);

  const heartbeat = setInterval(() => {
    send(`data: ${JSON.stringify({ type: "heartbeat", ts: Date.now() })}\n\n`);
  }, 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    subscribers.delete(send);
  });
};
