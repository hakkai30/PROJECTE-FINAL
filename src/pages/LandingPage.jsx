import { WindowOverlay } from "../components/Layout";

const LandingPage = ({ changePage }) => (
  <div className="landing-page-brutalist">
    <div className="windows-absolute-wrapper">
      <WindowOverlay label="W" offsetClass="window-1" />
      <WindowOverlay label="F" offsetClass="window-2" />
      <WindowOverlay label="A" offsetClass="window-3" />
    </div>

    <div className="glitch-visual-container">
      <div className="glitch-visual-text">
        <div className="glitch-text" data-text="W F A">
          W F A
        </div>
      </div>
      <div className="glitch-visual-text reflection">
        <div className="glitch-text" data-text="W F A">
          W F A
        </div>
      </div>
    </div>

    <div className="main-logo-container">
      <h1 className="main-logo-glitch-text">ROB THE FAB</h1>
      <h1 className="main-logo-glitch-text logo-reflection">ROB THE FAB</h1>
    </div>

    <footer className="landing-nav-footer-brutalist">
      <div className="nav-btn-container border-right">
        <button
          onClick={() => changePage("shop")}
          className="nav-btn-brutalist glitch-text"
          data-text="SHOP"
        >
          SHOP
        </button>
      </div>
      <div className="nav-btn-container">
        <button
          onClick={() => changePage("socials")}
          className="nav-btn-brutalist glitch-text"
          data-text="SOCIALS"
        >
          SOCIALS
        </button>
      </div>
    </footer>
  </div>
);

export default LandingPage;
