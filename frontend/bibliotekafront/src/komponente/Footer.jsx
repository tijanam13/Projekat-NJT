import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import logo from "../slike/logo.png";

export function Footer() {
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const linkStyle = (link) => ({
    color: activeLink === link ? "#AB92BF" : "rgba(206, 249, 242, 1)",
    textDecoration: "none",
    transition: "color 0.3s",
  });

  const iconStyle = (icon) => ({
    color: activeLink === icon ? "#AB92BF" : "rgba(206, 249, 242, 1)",
    fontSize: "1.3rem",
    transition: "color 0.3s",
  });

  return (
    <footer style={styles.footer}>
      <div style={styles.top}>
        <div style={styles.logoSection}>
          <img src={logo} alt="Biblioteka Logo" style={styles.logo} />
          <p style={styles.copyright}>© 2025 Biblioteka. Sva prava zadržana.</p>
          <p style={styles.contact}>Kontakt: info@biblioteka.rs</p>
        </div>

        <div style={styles.linksSection}>
          <h4 style={styles.sectionTitle}>Korisni linkovi</h4>
          <ul style={styles.linksList}>
            <li>
              <a href="/prijava" style={linkStyle("/prijava")} onClick={() => handleLinkClick("/prijava")}>Prijava</a>
            </li>
            <li>
              <a href="/registracija" style={linkStyle("/registracija")} onClick={() => handleLinkClick("/registracija")}>Registracija</a>
            </li>
            <li>
              <a href="/kontakt" style={linkStyle("/kontakt")} onClick={() => handleLinkClick("/kontakt")}>Kontakt</a>
            </li>
            <li>
              <a href="/o-nama" style={linkStyle("/o-nama")} onClick={() => handleLinkClick("/o-nama")}>O nama</a>
            </li>
          </ul>
        </div>

        <div style={styles.socialSection}>
          <h4 style={styles.sectionTitle}>Pratite nas</h4>
          <div style={styles.icons}>
            <a href="https://facebook.com" onClick={() => handleLinkClick("facebook")} style={iconStyle("facebook")}><FaFacebookF /></a>
            <a href="https://instagram.com" onClick={() => handleLinkClick("instagram")} style={iconStyle("instagram")}><FaInstagram /></a>
            <a href="https://twitter.com" onClick={() => handleLinkClick("twitter")} style={iconStyle("twitter")}><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        <p>Napravila: Tijana Milosavljević 2022/0009</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#655a7c",
    color: "#fff",
    padding: "20px 15px",
    fontFamily: "'Arial', sans-serif",
    width: "100%",
  },
  top: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  logoSection: {
    flex: "1 1 200px",
    marginBottom: "10px",
  },
  logo: {
    width: "60px",
    marginBottom: "8px",
  },
  linksSection: {
    flex: "1 1 180px",
    marginBottom: "10px",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    marginBottom: "8px",
  },
  linksList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    fontSize: "1rem",
  },
  socialSection: {
    flex: "1 1 180px",
    marginBottom: "10px",
  },
  icons: {
    display: "flex",
    gap: "12px",
  },
  bottom: {
    borderTop: "1px solid rgba(255,255,255,0.3)",
    paddingTop: "8px",
    textAlign: "center",
    fontSize: "0.9rem",
  },
  copyright: {
    fontSize: "0.85rem",
  },
  contact: {
    fontSize: "0.85rem",
  },
};