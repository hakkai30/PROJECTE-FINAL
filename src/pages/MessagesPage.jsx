import { useEffect, useMemo, useRef, useState } from "react";

const now = Date.now();

const INITIAL_THREADS = [
  {
    id: "aura",
    name: "@AURA.STUDIO",
    presence: "online",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Ei! Demà fem shooting. T'apuntes?",
        time: "10:24",
        ts: now - 1000 * 60 * 80,
      },
      {
        id: 2,
        sender: "me",
        text: "Sí! Puc portar el look negre oversized.",
        time: "10:26",
        ts: now - 1000 * 60 * 78,
        status: "read",
      },
      {
        id: 3,
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
        id: 1,
        sender: "them",
        text: "Has vist la nova col·lecció?",
        time: "09:01",
        ts: now - 1000 * 60 * 45,
      },
      {
        id: 2,
        sender: "me",
        text: "Sí, m'encanta la línia denim.",
        time: "09:05",
        ts: now - 1000 * 60 * 40,
        status: "delivered",
      },
      {
        id: 3,
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
        id: 1,
        sender: "them",
        text: "Quan puguis, envia'm el link del look.",
        time: "Ahir",
        ts: now - 1000 * 60 * 60 * 20,
      },
    ],
  },
];

const AUTO_REPLIES = {
  ca: ["M'encanta aquesta idea.", "Totalment, això queda increïble.", "Ho parlem després del fitting?", "Perfecte, t'escric en una estona."],
  es: ["Me encanta esta idea.", "Totalmente, queda increíble.", "¿Lo hablamos después del fitting?", "Perfecto, te escribo en un rato."],
  en: ["I love this idea.", "Absolutely, that looks incredible.", "Shall we talk after the fitting?", "Perfect, I'll text you in a bit."],
  fr: ["J'adore cette idée.", "Totalement, c'est incroyable.", "On en parle après l'essayage ?", "Parfait, je t'écris dans un instant."],
};

const getInitialThreads = (language) => {
  const copies = {
    ca: INITIAL_THREADS,
    es: [
      {
        id: "aura",
        name: "@AURA.STUDIO",
        presence: "online",
        messages: [
          { id: 1, sender: "them", text: "¡Ey! Mañana hacemos shooting. ¿Te apuntas?", time: "10:24", ts: now - 1000 * 60 * 80 },
          { id: 2, sender: "me", text: "¡Sí! Puedo llevar el look negro oversized.", time: "10:26", ts: now - 1000 * 60 * 78, status: "read" },
          { id: 3, sender: "them", text: "Perfecto, brutal. Nos vemos a las 17:00.", time: "10:27", ts: now - 1000 * 60 * 76 },
        ],
      },
      {
        id: "marta",
        name: "@MARTA.RTF",
        presence: "online",
        messages: [
          { id: 1, sender: "them", text: "¿Has visto la nueva colección?", time: "09:01", ts: now - 1000 * 60 * 45 },
          { id: 2, sender: "me", text: "Sí, me encanta la línea denim.", time: "09:05", ts: now - 1000 * 60 * 40, status: "delivered" },
          { id: 3, sender: "them", text: "¿Pasamos por la tienda este finde?", time: "09:06", ts: now - 1000 * 60 * 38 },
        ],
      },
      { id: "nil", name: "@NIL.FASHION", presence: "offline", messages: [{ id: 1, sender: "them", text: "Cuando puedas, envíame el link del look.", time: "Ayer", ts: now - 1000 * 60 * 60 * 20 }] },
    ],
    en: [
      {
        id: "aura",
        name: "@AURA.STUDIO",
        presence: "online",
        messages: [
          { id: 1, sender: "them", text: "Hey! We are doing a shoot tomorrow. Want in?", time: "10:24", ts: now - 1000 * 60 * 80 },
          { id: 2, sender: "me", text: "Yes! I can bring the oversized black look.", time: "10:26", ts: now - 1000 * 60 * 78, status: "read" },
          { id: 3, sender: "them", text: "Perfect, amazing. See you at 5 PM.", time: "10:27", ts: now - 1000 * 60 * 76 },
        ],
      },
      {
        id: "marta",
        name: "@MARTA.RTF",
        presence: "online",
        messages: [
          { id: 1, sender: "them", text: "Have you seen the new collection?", time: "09:01", ts: now - 1000 * 60 * 45 },
          { id: 2, sender: "me", text: "Yes, I love the denim line.", time: "09:05", ts: now - 1000 * 60 * 40, status: "delivered" },
          { id: 3, sender: "them", text: "Should we stop by the store this weekend?", time: "09:06", ts: now - 1000 * 60 * 38 },
        ],
      },
      { id: "nil", name: "@NIL.FASHION", presence: "offline", messages: [{ id: 1, sender: "them", text: "Whenever you can, send me the look link.", time: "Yesterday", ts: now - 1000 * 60 * 60 * 20 }] },
    ],
    fr: [
      {
        id: "aura",
        name: "@AURA.STUDIO",
        presence: "online",
        messages: [
          { id: 1, sender: "them", text: "Salut ! On fait un shooting demain. Tu viens ?", time: "10:24", ts: now - 1000 * 60 * 80 },
          { id: 2, sender: "me", text: "Oui ! Je peux apporter le look noir oversize.", time: "10:26", ts: now - 1000 * 60 * 78, status: "read" },
          { id: 3, sender: "them", text: "Parfait, génial. On se voit à 17h00.", time: "10:27", ts: now - 1000 * 60 * 76 },
        ],
      },
      {
        id: "marta",
        name: "@MARTA.RTF",
        presence: "online",
        messages: [
          { id: 1, sender: "them", text: "As-tu vu la nouvelle collection ?", time: "09:01", ts: now - 1000 * 60 * 45 },
          { id: 2, sender: "me", text: "Oui, j'adore la ligne denim.", time: "09:05", ts: now - 1000 * 60 * 40, status: "delivered" },
          { id: 3, sender: "them", text: "On passe en boutique ce week-end ?", time: "09:06", ts: now - 1000 * 60 * 38 },
        ],
      },
      { id: "nil", name: "@NIL.FASHION", presence: "offline", messages: [{ id: 1, sender: "them", text: "Quand tu peux, envoie-moi le lien du look.", time: "Hier", ts: now - 1000 * 60 * 60 * 20 }] },
    ],
  };

  return copies[language] || copies.ca;
};

const MessagesPage = ({ changePage, currentUser, onLogout, language = "ca", t }) => {
  const initialThreads = getInitialThreads(language);
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typingByThread, setTypingByThread] = useState({});
  const [unreadByThread, setUnreadByThread] = useState({ aura: 2, marta: 1, nil: 1 });
  const bottomRef = useRef(null);
  const activeThreadIdRef = useRef(activeThreadId);

  useEffect(() => {
    const nextThreads = getInitialThreads(language);
    setThreads(nextThreads);
    setActiveThreadId(nextThreads[0].id);
    setUnreadByThread({ aura: 2, marta: 1, nil: 1 });
    setTypingByThread({});
  }, [language]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId),
    [threads, activeThreadId]
  );

  const getThreadLastTs = (thread) => thread.messages[thread.messages.length - 1]?.ts || 0;

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => getThreadLastTs(b) - getThreadLastTs(a));
  }, [threads]);

  const filteredThreads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return sortedThreads;

    return sortedThreads.filter((thread) => {
      const lastMessage = thread.messages[thread.messages.length - 1]?.text || "";
      return (
        thread.name.toLowerCase().includes(query) ||
        lastMessage.toLowerCase().includes(query)
      );
    });
  }, [sortedThreads, searchTerm]);

  useEffect(() => {
    activeThreadIdRef.current = activeThreadId;
    setUnreadByThread((prev) => ({ ...prev, [activeThreadId]: 0 }));
  }, [activeThreadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThreadId, activeThread?.messages.length, typingByThread[activeThreadId]]);

  const pushMessage = (threadId, message) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId
          ? { ...thread, messages: [...thread.messages, message] }
          : thread
      )
    );
  };

  const updateMessageStatus = (threadId, messageId, status) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id !== threadId) return thread;

        return {
          ...thread,
          messages: thread.messages.map((msg) =>
            msg.id === messageId ? { ...msg, status } : msg
          ),
        };
      })
    );
  };

  const getStatusLabel = (threadId) => {
    if (typingByThread[threadId]) return t("messages.statuses.typing", "TYPING...");

    const thread = threads.find((item) => item.id === threadId);
    if (!thread) return t("messages.statuses.offline", "OFFLINE");

    return thread.presence === "online"
      ? t("messages.statuses.online", "ONLINE")
      : t("messages.statuses.offline", "OFFLINE");
  };

  const handleSendMessage = () => {
    const cleanMessage = messageInput.trim();
    if (!cleanMessage || !activeThread) return;

    const threadId = activeThread.id;
    const messageId = Date.now();

    const userMessage = {
      id: messageId,
      sender: "me",
      text: cleanMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      ts: Date.now(),
      status: "sent",
    };

    pushMessage(threadId, userMessage);
    setMessageInput("");

    setTimeout(() => updateMessageStatus(threadId, messageId, "delivered"), 350);
    setTimeout(() => updateMessageStatus(threadId, messageId, "read"), 1300);

    setTypingByThread((prev) => ({ ...prev, [threadId]: true }));

    const replies = AUTO_REPLIES[language] || AUTO_REPLIES.ca;
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
      setTypingByThread((prev) => ({ ...prev, [threadId]: false }));
      pushMessage(threadId, {
        id: Date.now() + 1,
        sender: "them",
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        ts: Date.now(),
      });

      if (activeThreadIdRef.current !== threadId) {
        setUnreadByThread((prev) => ({
          ...prev,
          [threadId]: (prev[threadId] || 0) + 1,
        }));
      }
    }, 1200);
  };

  const activeThreadStatusLabel = getStatusLabel(activeThreadId);

  return (
    <div className="social-layout messages-layout">
      <div className="social-sidebar">
        <button type="button" className="sidebar-link" onClick={() => changePage("landing")}>
          {t("messages.home", "HOME")}
        </button>
        <button type="button" className="sidebar-link" onClick={() => changePage("shop")}>
          {t("nav.shop", "SHOP")}
        </button>
        <div className="sidebar-divider" aria-hidden="true"></div>
        <button type="button" className="sidebar-link" onClick={() => changePage("socials")}>
          {t("social.sidebar.brand", "ROB_THE_FAB")}
        </button>
        <button type="button" className="sidebar-link sidebar-link-active" onClick={() => changePage("messages")}>
          {t("social.sidebar.messages", "MESSAGES")}
        </button>
        <button type="button" className="sidebar-link" onClick={() => changePage("saved-looks")}>
          {t("social.sidebar.savedLooks", "SAVED LOOKS")}
        </button>
        <p className="sidebar-user-chip">@{currentUser?.name || "USER"}</p>
        <button type="button" className="sidebar-link sidebar-logout" onClick={onLogout}>
          {t("social.sidebar.logout", "LOG OUT")}
        </button>
        <button
          type="button"
          className="sidebar-link sidebar-settings-link"
          onClick={() => changePage("settings")}
        >
          {t("social.sidebar.settings", "SETTINGS")}
        </button>
      </div>

      <div className="messages-main">
        <aside className="messages-threads-panel">
          <h2>{t("messages.title", "CHATS")}</h2>
          <input
            className="threads-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("messages.searchPlaceholder", "Search conversation...")}
          />

          {filteredThreads.map((thread) => {
            const preview = thread.messages[thread.messages.length - 1]?.text || "";
            const lastTime = thread.messages[thread.messages.length - 1]?.time || "";
            const isActive = thread.id === activeThreadId;
            const statusLabel = getStatusLabel(thread.id);
            const unreadCount = unreadByThread[thread.id] || 0;
            const presenceClass =
              statusLabel === t("messages.statuses.online", "ONLINE")
                ? "online"
                : statusLabel === t("messages.statuses.typing", "TYPING...")
                ? "typing"
                : "offline";

            return (
              <button
                key={thread.id}
                className={`thread-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActiveThreadId(thread.id);
                  setUnreadByThread((prev) => ({ ...prev, [thread.id]: 0 }));
                }}
              >
                <div className="thread-meta">
                  <strong>
                    {thread.name}
                    {unreadCount > 0 && <span className="thread-unread-badge">{unreadCount}</span>}
                  </strong>
                  <span>{lastTime}</span>
                </div>
                <p>{preview}</p>
                <small className={`thread-presence ${presenceClass}`}>{statusLabel}</small>
              </button>
            );
          })}

          {filteredThreads.length === 0 && <p className="threads-empty-state">{t("messages.noThreads", "No conversations match this search.")}</p>}
        </aside>

        <section className="messages-chat-panel">
          <header className="chat-topbar">
            <h3>{activeThread?.name}</h3>
            <span className={`topbar-status ${activeThreadStatusLabel === t("messages.statuses.offline", "OFFLINE") ? "offline" : "online"}`}>
              {activeThreadStatusLabel}
            </span>
          </header>

          <div className="chat-stream">
            {activeThread?.messages.map((msg) => (
              <div key={msg.id} className={`msg-bubble ${msg.sender}`}>
                <p>{msg.text}</p>
                <div className="message-meta-row">
                  <time>{msg.time}</time>
                  {msg.sender === "me" && (
                    <span className={`message-state ${msg.status || "sent"}`}>
                      {msg.status === "read"
                        ? t("messages.messageState.read", "READ")
                        : msg.status === "delivered"
                        ? t("messages.messageState.delivered", "DELIVERED")
                        : t("messages.messageState.sent", "SENT")}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {typingByThread[activeThreadId] && (
              <div className="msg-bubble them typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

          <div className="chat-compose">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t("messages.placeholder", "Write a message...")}
            />
            <button onClick={handleSendMessage}>{t("messages.send", "SEND")}</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MessagesPage;
