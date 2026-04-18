import { WindowOverlay } from "../components/Layout";

const LandingPage = ({ changePage, t }) => (
  <div className="landing-page-brutalist">
    <div className="windows-absolute-wrapper">
      <WindowOverlay label="W" offsetClass="window-1" />
      <WindowOverlay label="F" offsetClass="window-2" />
      <WindowOverlay label="A" offsetClass="window-3" />
    </div>

    <div className="glitch-visual-container">
      <p className="landing-kicker">WFA / 2026 COLLECTION</p>
      <div className="glitch-visual-text">
        <div className="glitch-text" data-text="ROB THE FAB">
          ROB THE FAB
        </div>
      </div>
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
          onClick={() => changePage("shop")}
          className="nav-btn-brutalist glitch-text"
          data-text="SHOP"
        >
          {t("landing.shop", "SHOP")}
        </button>
      </div>
      <div className="nav-btn-container">
        <button
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

export default LandingPage;
