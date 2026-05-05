import { useState } from "react";
import { LogIn, UserPlus, ShoppingBag } from "lucide-react";

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

const AuthPage = ({
  changePage,
  onLogin,
  onRegister,
  onContinueAsGuest = () => {},
  pendingPage = "socials",
  t,
}) => {
  const [view, setView] = useState("welcome"); // welcome | login | register
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

    if (view === "register") {
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
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Register error:", error);
        setFeedback(t("auth.errors.create", "Could not create the account."));
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onLogin({ email, password });
      if (!result.ok) {
        setFeedback(result.error || t("auth.errors.login", "Could not sign in."));
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setFeedback(t("auth.errors.login", "Could not sign in."));
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-screen">
      {view === "welcome" ? (
        <div className="auth-welcome-card">
          <div className="auth-welcome-header">
            <h1 className="auth-welcome-title">{t("auth.welcome.title", "WELCOME TO ROB_THE_FAB")}</h1>
            <p className="auth-welcome-subtitle">
              {t("auth.welcome.subtitle", "Discover fashion. Build your style. Connect with the community.")}
            </p>
          </div>

          <div className="auth-welcome-options">
            <button
              type="button"
              className="auth-option-btn auth-option-login"
              onClick={() => {
                setView("login");
                setFeedback("");
              }}
            >
              <LogIn size={24} aria-hidden="true" />
              <div>
                <span className="auth-option-title">{t("auth.welcome.login", "SIGN IN")}</span>
                <span className="auth-option-desc">
                  {t("auth.welcome.loginDesc", "Access your account")}
                </span>
              </div>
            </button>

            <button
              type="button"
              className="auth-option-btn auth-option-register"
              onClick={() => {
                setView("register");
                setFeedback("");
              }}
            >
              <UserPlus size={24} aria-hidden="true" />
              <div>
                <span className="auth-option-title">{t("auth.welcome.register", "CREATE ACCOUNT")}</span>
                <span className="auth-option-desc">
                  {t("auth.welcome.registerDesc", "Join our community")}
                </span>
              </div>
            </button>

            <button
              type="button"
              className="auth-option-btn auth-option-guest"
              onClick={() => onContinueAsGuest()}
            >
              <ShoppingBag size={24} aria-hidden="true" />
              <div>
                <span className="auth-option-title">{t("auth.welcome.guest", "BROWSE AS GUEST")}</span>
                <span className="auth-option-desc">
                  {t("auth.welcome.guestDesc", "Explore & shop without account")}
                </span>
              </div>
            </button>
          </div>

          <p className="auth-welcome-note">
            {t("auth.welcome.note", "This platform stores your data locally in your browser.")}
          </p>
        </div>
      ) : (
        <div className="auth-card">
          <button
            type="button"
            className="auth-back-icon-btn"
            onClick={() => setView("welcome")}
            aria-label={t("auth.back", "Back")}
          >
            ←
          </button>

          <p className="auth-kicker">
            {view === "login"
              ? t("auth.kicker.login", "ACCOUNT ACCESS")
              : t("auth.kicker.register", "CREATE ACCOUNT")}
          </p>
          <h1>
            {view === "login"
              ? t("auth.title.login", "SIGN IN TO ROB_THE_FAB")
              : t("auth.title.register", "JOIN ROB_THE_FAB")}
          </h1>
          <p className="auth-description">
            {view === "login"
              ? t("auth.description.login", "Sign in to access your profile, social feed, and saved items.")
              : t("auth.description.register", "Create an account to sell items, connect with the community, and save your favorites.")}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {view === "register" && (
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

            {view === "register" && (
              <label>
                {t("auth.fields.confirm", "Repeat Password")}
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={t("auth.placeholders.confirm", "Type it again")}
                  disabled={isSubmitting}
                />
              </label>
            )}

            {view === "register" && (
              <label>
                {t("auth.fields.bio", "Bio")}
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder={t("auth.placeholders.bio", "Tell the community who you are")}
                  rows="3"
                  disabled={isSubmitting}
                />
              </label>
            )}

            {view === "register" && (
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
                ? (
                  <>
                    {t("auth.submit.validating", "PROCESSING...")}
                  </>
                )
                : view === "login"
                ? t("auth.submit.login", "SIGN IN")
                : t("auth.submit.register", "CREATE ACCOUNT")}
            </button>
          </form>

          <p className="auth-footnote">
            {view === "login"
              ? t("auth.footnote.login", "Don't have an account?")
              : t("auth.footnote.register", "Already have an account?")}
            <button
              type="button"
              className="auth-toggle-btn"
              onClick={() => {
                setView(view === "login" ? "register" : "login");
                setFeedback("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
            >
              {view === "login"
                ? t("auth.switch.register", "Create one")
                : t("auth.switch.login", "Sign in")}
            </button>
          </p>
        </div>
      )}
    </section>
  );
};

export default AuthPage;
