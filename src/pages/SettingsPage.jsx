import { GlobalFooter, GlobalHeader } from "../components/Layout";
import { LANGUAGE_OPTIONS, getLanguageLabel } from "../data/i18n";

const THEMES = [
  {
    key: "auto",
    title: "AUTO",
    subtitle: "Sync with your system appearance",
  },
  {
    key: "light",
    title: "LIGHT MODE",
    subtitle: "Bright surfaces with crisp editorial contrast",
  },
  {
    key: "dark",
    title: "DARK MODE",
    subtitle: "Low-light interface with strong readability",
  },
];

const SettingsPage = ({
  changePage,
  cartCount,
  wishlistCount,
  theme,
  setTheme,
  onToggleTheme,
  language,
  setLanguage,
  t,
}) => {
  return (
    <div className="category-page">
      <GlobalHeader
        changePage={changePage}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        theme={theme}
        onToggleTheme={onToggleTheme}
        language={language}
        t={t}
      />

      <main className="settings-layout">
        <section className="settings-hero">
          <p className="collection-kicker">{t("settings.preferences", "PREFERENCES")}</p>
          <h1 className="collection-title">{t("settings.title", "SETTINGS")}</h1>
          <p className="settings-intro">
            {t(
              "settings.intro",
              "Adjust the visual style and interface language to match how you want to browse."
            )}
          </p>
        </section>

        <section className="settings-card">
          <h2>{t("settings.visualTheme", "Visual Theme")}</h2>
          <p>{t("settings.visualDescription", "Choose the style that feels best for your experience.")}</p>

          <div className="theme-options-grid">
            {THEMES.map((item) => {
              const resolvedTitle = t(`settings.themes.${item.key}.title`, item.title);
              const resolvedSubtitle = t(`settings.themes.${item.key}.subtitle`, item.subtitle);
              const isActive = theme === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`theme-option-card ${isActive ? "active" : ""}`}
                  onClick={() => setTheme(item.key)}
                >
                  <strong>{resolvedTitle}</strong>
                  <span>{resolvedSubtitle}</span>
                  {isActive && <small>{t("settings.active", "ACTIVE")}</small>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="settings-card">
          <h2>{t("settings.language", "Language")}</h2>
          <p>{t("settings.languageDescription", "Change the text of the full interface.")}</p>

          <div className="language-options-grid">
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = language === option.code;
              return (
                <button
                  key={option.code}
                  type="button"
                  className={`theme-option-card ${isActive ? "active" : ""}`}
                  onClick={() => setLanguage(option.code)}
                >
                  <strong>{getLanguageLabel(option.code)}</strong>
                  <span>{option.code.toUpperCase()}</span>
                  {isActive && <small>{t("settings.active", "ACTIVE")}</small>}
                </button>
              );
            })}
          </div>
        </section>

        <button type="button" className="toolbar-btn settings-return-btn" onClick={() => changePage("shop")}>
          {t("settings.returnToShop", "BACK TO SHOP")}
        </button>
      </main>

      <GlobalFooter t={t} />
    </div>
  );
};

export default SettingsPage;
