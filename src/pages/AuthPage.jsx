import { useState } from "react";

const AVATAR_STYLES = [
  { id: "midnight", label: "MIDNIGHT", from: "#111111", to: "#4a4a4a" },
  { id: "ember", label: "EMBER", from: "#9f1d14", to: "#ff8a3d" },
  { id: "ocean", label: "OCEAN", from: "#0c4a6e", to: "#38bdf8" },
  { id: "forest", label: "FOREST", from: "#14532d", to: "#7ddc8c" },
];

const getInitials = (value) => {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "RT";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const buildAvatar = (seed, style) => {
  const initials = getInitials(seed);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${style.from}" />
          <stop offset="100%" stop-color="${style.to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#g)" />
      <circle cx="80" cy="80" r="58" fill="rgba(255,255,255,0.08)" />
      <text x="80" y="94" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="700" letter-spacing="2" fill="#ffffff">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const AuthPage = ({ changePage, onLogin, onRegister, pendingPage = "socials", t }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatarStyle, setAvatarStyle] = useState(AVATAR_STYLES[0].id);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setFeedback("");

    if (!email.trim() || !password.trim()) {
      setFeedback(t("auth.errors.required", "Fill in email and password."));
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setFeedback(t("auth.errors.nameRequired", "Enter a username."));
        return;
      }

      if (password.length < 6) {
        setFeedback(t("auth.errors.passwordLength", "Password must be at least 6 characters."));
        return;
      }

      if (password !== confirmPassword) {
        setFeedback(t("auth.errors.mismatch", "Passwords do not match."));
        return;
      }

      setIsSubmitting(true);
      try {
        const selectedStyle = AVATAR_STYLES.find((style) => style.id === avatarStyle) || AVATAR_STYLES[0];
        const avatar = buildAvatar(name || email, selectedStyle);
        const result = await onRegister({ name, email, password, bio, avatar });
        if (!result.ok) {
          setFeedback(result.error || t("auth.errors.create", "Could not create the account."));
        }
      } catch {
        setFeedback(t("auth.errors.create", "Could not create the account."));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onLogin({ email, password });
      if (!result.ok) {
        setFeedback(result.error || t("auth.errors.login", "Could not sign in."));
      }
    } catch {
      setFeedback(t("auth.errors.login", "Could not sign in."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <p className="auth-kicker">{t("auth.kicker", "SOCIAL ACCESS")}</p>
        <h1>{t("auth.title", "ENTER ROB_THE_FAB SOCIAL")}</h1>
        <p className="auth-description">
          {t("auth.description", "To access the Social Web you must sign in or create an account. This version is frontend only and stores data in your browser.")}
        </p>

        <div className="auth-mode-switch" role="tablist" aria-label="Mode autenticacio">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setFeedback("");
            }}
          >
            {t("auth.login", "LOGIN")}
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setFeedback("");
            }}
          >
            {t("auth.register", "REGISTER")}
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              {t("auth.fields.name", "Username")}
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t("auth.placeholders.name", "Ex: alex.rtf")}
                disabled={isSubmitting}
              />
            </label>
          )}

          <label>
            {t("auth.fields.email", "Email")}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("auth.placeholders.email", "you@email.com")}
              disabled={isSubmitting}
            />
          </label>

          <label>
            {t("auth.fields.password", "Password")}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("auth.placeholders.password", "Minimum 6 characters")}
              disabled={isSubmitting}
            />
          </label>

          {mode === "register" && (
            <label>
              {t("auth.fields.confirm", "Repeat password")}
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={t("auth.placeholders.confirm", "Type it again")}
                disabled={isSubmitting}
              />
            </label>
          )}

          {mode === "register" && (
            <label>
              {t("auth.fields.bio", "Bio")}
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder={t("auth.placeholders.bio", "Short bio for your profile")}
                disabled={isSubmitting}
                rows="3"
              />
            </label>
          )}

          {mode === "register" && (
            <div className="auth-avatar-picker">
              <span className="auth-avatar-label">{t("auth.fields.avatar", "Avatar")}</span>
              <div className="auth-avatar-options" role="radiogroup" aria-label={t("auth.fields.avatar", "Avatar")}>
                {AVATAR_STYLES.map((style) => {
                  const avatarSrc = buildAvatar(name || email, style);
                  const isActive = avatarStyle === style.id;

                  return (
                    <button
                      key={style.id}
                      type="button"
                      className={`auth-avatar-option${isActive ? " active" : ""}`}
                      onClick={() => setAvatarStyle(style.id)}
                      disabled={isSubmitting}
                      aria-pressed={isActive}
                    >
                      <img src={avatarSrc} alt="" />
                      <span>{style.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="auth-avatar-help">
                {t("auth.avatarHelp", "Your avatar is generated from your username and the style you choose.")}
              </p>
            </div>
          )}

          {feedback && <p className="auth-feedback">{feedback}</p>}

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting
              ? t("auth.submit.validating", "VALIDATING...")
              : mode === "login"
              ? t("auth.submit.login", "ENTER")
              : t("auth.submit.register", "CREATE ACCOUNT")}
          </button>
        </form>

        <p className="auth-footnote">
          {t("auth.destinationLabel", "Destination")}: {pendingPage === "messages" ? t("auth.destination.messages", "MESSAGES") : t("auth.destination.socials", "SOCIAL FEED")}
        </p>

        <button type="button" className="auth-back-btn" onClick={() => changePage("landing")}>
          {t("auth.back", "BACK TO HOME")}
        </button>
      </div>
    </section>
  );
};

export default AuthPage;
