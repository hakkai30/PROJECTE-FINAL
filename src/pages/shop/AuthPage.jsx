import React, { useState } from "react";
import { LogIn, UserPlus, ShoppingBag } from "lucide-react";

const AuthPage = ({
  onLogin,
  onRegister,
  onContinueAsGuest,
  t,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await onLogin({ email, password });
        if (!res.ok) setFeedback(res.error);
      } else {
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
        const res = await onRegister({ name, email, password, avatar });
        if (!res.ok) setFeedback(res.error);
      }
    } catch (err) {
      setFeedback("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <h1>{isLogin ? t("auth.title.login", "INICIA SESSIÓ") : t("auth.title.register", "REGISTRE")}</h1>
        <p className="auth-description">
          {isLogin ? "Benvingut de nou a ROB THE FAB." : "Crea un compte i uneix-te a la comunitat."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label>
              {t("auth.fields.name", "Nom d'usuari")}
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          )}
          <label>
            {t("auth.fields.email", "Correu electrònic")}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            {t("auth.fields.password", "Contrasenya")}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {feedback && <p className="auth-feedback">{feedback}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "..." : (isLogin ? t("auth.submit.login", "ENTRAR") : t("auth.submit.register", "REGISTRAR-SE"))}
          </button>
        </form>

        <div className="auth-options-divider">
          <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? t("auth.switch.register", "No tens compte? Registra't") : t("auth.switch.login", "Ja tens compte? Entra")}
          </button>
          
          <button className="auth-guest-btn" onClick={onContinueAsGuest}>
            <ShoppingBag size={18} /> {t("auth.welcome.guest", "CONTINUAR COM A CONVIDAT")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
