// Pie de página global compartido por las secciones de tienda y social.
const Footer = ({ t }) => (
  <footer className="main-app-footer">
    <div className="footer-column">
      <h3>{t("footer.guideTitle", "GUÍA DE COMPRA")}</h3>
      <ul>
        {t("footer.guide", []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    <div className="footer-column">
      <h3>{t("footer.membersTitle", "MIEMBROS")}</h3>
      <ul>
        {t("footer.members", []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    <div className="footer-column">
      <h3>{t("footer.aboutTitle", "SOBRE NOSOTROS")}</h3>
      <ul>
        {t("footer.about", []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;
