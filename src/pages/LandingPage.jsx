import { useState, useEffect } from "react";
import { WindowOverlay } from "../components/Layout";
import { getFashionNews } from "../services/newsService";

const LandingPage = ({ changePage, t, language = "es" }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getFashionNews(language).then(articles => {
      if (articles && articles.length >= 3) {
        setNews(articles.slice(0, 3));
      }
    });
  }, [language]);

  return (
    <div className="landing-page-brutalist">
      <div className="windows-absolute-wrapper" aria-hidden="true">
        <WindowOverlay label="W" offsetClass="window-1" article={news[0]} />
        <WindowOverlay label="F" offsetClass="window-2" article={news[1]} />
        <WindowOverlay label="A" offsetClass="window-3" article={news[2]} />
      </div>



      <div className="main-logo-container">
        <h1 className="main-logo-glitch-text">ROB THE FAB</h1>
        <p className="landing-tagline">
          {t("landing.tagline", "Wear the Story. Share the Change.")}
        </p>
      </div>

      <footer className="landing-nav-footer-brutalist">
        <div className="nav-btn-container border-right">
          <button
            type="button"
            onClick={() => changePage("shop")}
            className="nav-btn-brutalist glitch-text"
            data-text="SHOP"
          >
            {t("landing.shop", "SHOP")}
          </button>
        </div>
        <div className="nav-btn-container">
          <button
            type="button"
            onClick={() => changePage("socials")}
            className="nav-btn-brutalist glitch-text"
            data-text="SOCIALS"
          >
            {t("landing.socials", "SOCIALS")}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
