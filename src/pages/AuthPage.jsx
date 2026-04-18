import { useState } from "react";

const AuthPage = ({ changePage, onLogin, onRegister, pendingPage = "socials", t }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        const result = await onRegister({ name, email, password });
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
