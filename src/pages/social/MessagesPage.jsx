import { useEffect, useMemo, useRef, useState } from "react";
import { GlobalFooter, GlobalHeader } from "../../components/Layout";
import { messageService } from "../../services/messageService";

const normalizeContactHandle = (value) => {
  const cleaned = String(value || "").trim().replace(/^@/, "");
  return cleaned ? `user:${cleaned.toLowerCase()}` : "";
};

const MessagesPage = ({
  changePage,
  currentUser,
  onLogout,
  onOpenProfile,
  pendingContact,
  onClearPendingContact,
  cartCount = 0,
  wishlistCount = 0,
  theme,
  onToggleTheme,
  language = "ca",
  t,
}) => {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typingByThread, setTypingByThread] = useState({});
  const [unreadByThread, setUnreadByThread] = useState({});
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [messagesError, setMessagesError] = useState("");
  const bottomRef = useRef(null);
  const activeThreadIdRef = useRef("");

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
    let isMounted = true;

    const loadThreads = async () => {
      setIsLoadingThreads(true);
      setMessagesError("");

      try {
        const result = await messageService.getThreads();
        if (!isMounted) return;

        setThreads(result);
        setActiveThreadId((prev) => prev || result[0]?.id || "");
      } catch (error) {
        if (!isMounted) return;
        setMessagesError(error.message || "Could not load message threads.");
      } finally {
        if (!isMounted) return;
        setIsLoadingThreads(false);
      }
    };

    loadThreads();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!pendingContact) return;

    const threadId = normalizeContactHandle(pendingContact.handle || pendingContact.name || pendingContact.id);
    if (!threadId) return;

    setThreads((prevThreads) => {
      const existingThread = prevThreads.find((thread) => thread.id === threadId);
      if (existingThread) return prevThreads;

      return [
        {
          id: threadId,
          name: `@${String(pendingContact.handle || pendingContact.name || pendingContact.id || "USER").replace(/^@/, "")}`,
          presence: "online",
          messages: [],
        },
        ...prevThreads,
      ];
    });

    setActiveThreadId(threadId);
    setUnreadByThread((prev) => ({ ...prev, [threadId]: 0 }));
    onClearPendingContact?.();
  }, [pendingContact, onClearPendingContact]);

  useEffect(() => {
    const eventSource = messageService.subscribeToMessages((payload) => {
      if (payload?.type !== "message.created") return;

      const threadId = String(payload.threadId || "");
      const incomingMessage = payload.message;

      if (!threadId || !incomingMessage?.id) return;

      setThreads((prevThreads) => {
        const existingThread = prevThreads.find((thread) => thread.id === threadId);

        if (!existingThread) {
          return [
            {
              id: threadId,
              name: `@${threadId.replace(/^user:/, "").toUpperCase()}`,
              presence: "online",
              messages: [incomingMessage],
            },
            ...prevThreads,
          ];
        }

        return prevThreads.map((thread) => {
          if (thread.id !== threadId) return thread;
          const alreadyExists = thread.messages.some((msg) => msg.id === incomingMessage.id);
          if (alreadyExists) return thread;
          return {
            ...thread,
            messages: [...thread.messages, incomingMessage],
          };
        });
      });

      if (incomingMessage.sender === "them") {
        setTypingByThread((prev) => ({ ...prev, [threadId]: false }));
      }

      if (activeThreadIdRef.current !== threadId && incomingMessage.sender === "them") {
        setUnreadByThread((prev) => ({
          ...prev,
          [threadId]: (prev[threadId] || 0) + 1,
        }));
      }

      setActiveThreadId((prev) => prev || threadId);
    });

    eventSource.onerror = () => {
      setMessagesError((prev) => prev || "Realtime stream disconnected. Reconnecting...");
    };

    eventSource.onopen = () => {
      setMessagesError("");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    activeThreadIdRef.current = activeThreadId;
    if (!activeThreadId) return;
    setUnreadByThread((prev) => ({ ...prev, [activeThreadId]: 0 }));
  }, [activeThreadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThreadId, activeThread?.messages.length, typingByThread[activeThreadId]]);

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

  const handleSendMessage = async () => {
    const cleanMessage = messageInput.trim();
    if (!cleanMessage || !activeThread) return;

    setMessagesError("");
    setMessageInput("");

    try {
      const message = await messageService.sendMessage(activeThread.id, {
        text: cleanMessage,
        sender: "me",
        user: currentUser?.name || "USER",
      });

      if (message?.id) {
        updateMessageStatus(activeThread.id, message.id, "delivered");
        setTimeout(() => updateMessageStatus(activeThread.id, message.id, "read"), 1000);
      }

      setTypingByThread((prev) => ({ ...prev, [activeThread.id]: true }));
    } catch (error) {
      setMessagesError(error.message || "Could not send message.");
      setMessageInput(cleanMessage);
      setTypingByThread((prev) => ({ ...prev, [activeThread.id]: false }));
    }
  };

  const activeThreadStatusLabel = getStatusLabel(activeThreadId);
  const openChatHint = pendingContact
    ? t("messages.openingDirectChat", "Opening direct chat...")
    : "";

  return (
    <div className="category-page">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        currentUser={currentUser}
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
        language={language}
        t={t}
      />
      <div className="social-layout messages-layout">

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

          {isLoadingThreads && (
            <p className="threads-empty-state">{t("messages.loading", "Loading chats...")}</p>
          )}

          {!isLoadingThreads && filteredThreads.map((thread) => {
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

          {!isLoadingThreads && filteredThreads.length === 0 && (
            <p className="threads-empty-state">{t("messages.noThreads", "No conversations match this search.")}</p>
          )}
        </aside>

        <section className="messages-chat-panel">
          <header className="chat-topbar">
            <h3>{activeThread?.name || t("messages.noThread", "SELECT A CHAT")}</h3>
            <span className={`topbar-status ${activeThreadStatusLabel === t("messages.statuses.offline", "OFFLINE") ? "offline" : "online"}`}>
              {activeThreadStatusLabel}
            </span>
          </header>

          {openChatHint && <p className="messages-error-banner">{openChatHint}</p>}

          {messagesError && <p className="messages-error-banner">{messagesError}</p>}

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
              disabled={!activeThreadId}
            />
            <button onClick={handleSendMessage} disabled={!activeThreadId || !messageInput.trim()}>
              {t("messages.send", "SEND")}
            </button>
          </div>
        </section>
      </div>
      </div>
      <GlobalFooter t={t} />
    </div>
  );
};

export default MessagesPage;
