import React from "react";
import { GlobalFooter, GlobalHeader } from "../../components/Layout";
import { LANGUAGE_OPTIONS, getLanguageLabel } from "../../data/i18n";

const SettingsPage = ({
  changePage,
  cartCount,
  wishlistCount,
  theme,
  setTheme,
  language,
  setLanguage,
  t,
  currentUser,
  onLogout,
}) => {
  return (
    <div className="category-page">
      <GlobalHeader {...{ changePage, cartCount, wishlistCount, theme, language, t, currentUser, onLogout }} />
      <main className="settings-layout">
        <section className="settings-hero">
          <p className="collection-kicker">{t("settings.preferences", "PREFERÈNCIES")}</p>
          <h1 className="collection-title">{t("settings.title", "AJUSTES")}</h1>
        </section>

        <section className="settings-card">
          <h2>{t("settings.visualTheme", "Tema visual")}</h2>
          <div className="theme-options-grid">
            {["auto", "light", "dark"].map(tk => (
              <button 
                key={tk} 
                className={`theme-option-card ${theme === tk ? "active" : ""}`} 
                onClick={() => setTheme(tk)}
              >
                <strong>{tk.toUpperCase()}</strong>
                {theme === tk && <small>{t("settings.active", "ACTIU")}</small>}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-card">
          <h2>{t("settings.language", "Idioma")}</h2>
          <div className="language-options-grid">
            {LANGUAGE_OPTIONS.map(opt => (
              <button 
                key={opt.code} 
                className={`theme-option-card ${language === opt.code ? "active" : ""}`} 
                onClick={() => setLanguage(opt.code)}
              >
                <strong>{getLanguageLabel(opt.code)}</strong>
                {language === opt.code && <small>{t("settings.active", "ACTIU")}</small>}
              </button>
            ))}
          </div>
        </section>

        <button className="toolbar-btn" onClick={() => changePage("shop")}>
          {t("settings.returnToShop", "TORNAR A SHOP")}
        </button>
      </main>
      <GlobalFooter t={t} />
    </div>
  );
};

export default SettingsPage;
