import React, { useState } from "react";
import { LogIn, UserPlus, ShoppingBag } from "lucide-react";

const AuthPage = ({
  onLogin,
  onRegister,
  onContinueAsGuest,
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
        <h1>{isLogin ? "INICIAR SESIÓN" : "REGISTRO"}</h1>
        <p className="auth-description">
          {isLogin ? "Bienvenido de nuevo a ROB THE FAB." : "Crea una cuenta y únete a la comunidad."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label>
              Nombre de usuario
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          )}
          <label>
            Correo electrónico
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {feedback && <p className="auth-feedback">{feedback}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "..." : (isLogin ? "ENTRAR" : "REGISTRARSE")}
          </button>
        </form>

        <div className="auth-options-divider">
          <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "¿No tienes cuenta? Regístrate aquí." : "¿Ya tienes cuenta? Entra"}
          </button>
          
          <button className="auth-guest-btn" onClick={onContinueAsGuest}>
            Continuar como invitado <ShoppingBag size={14}/> 
          </button>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
