import React, { useState } from "react";
import "../css/Kontakt.css";
import http from "../api/http";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

export default function Kontakt() {
  const [email, setEmail] = useState("");
  const [poruka, setPoruka] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !poruka) {
      setStatus("❌ Molimo popunite oba polja.");
      return;
    }
    try {
      await http.post("auth/kontakt", { email, poruka });
      setStatus("✅ Poruka je uspešno poslata!");
      setEmail("");
      setPoruka("");
    } catch (err) {
      setStatus("❌ Došlo je do greške prilikom slanja poruke.");
    }
  };

  return (
    <div className="kontakt-container">
      <h1>Kontakt</h1>

      <div className="kontakt-info">
        <p><EmailIcon style={{ marginRight: "0.5rem" }} /> bibliotekainfo@gmail.com</p>
        <p><LocalPhoneIcon style={{ marginRight: "0.5rem" }} /> +381 63 123 4567</p>
      </div>

      <form className="kontakt-form" onSubmit={handleSubmit}>
        <label>
          Vaš email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Vaša poruka:
          <textarea
            value={poruka}
            onChange={(e) => setPoruka(e.target.value)}
            rows="5"
            required
          />
        </label>
        <button type="submit">Pošalji</button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
}