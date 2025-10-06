import React, { useState } from "react";
import http from "../api/http";
import "../css/Autentifikacija.css";

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await http.post("/auth/forgot-password", { email });
      setMessage(
        "Ako postoji nalog sa ovom mejl adresom, poslat je link za promenu lozinke. Proverite inbox."
      );
    } catch (err) {
      setMessage(
        "Ako postoji nalog sa ovom mejl adresom, poslat je link za promenu lozinke. Proverite inbox."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Promena lozinke</h2>
        <p className="muted">
          Unesite Vašu mejl adresu, kako bismo Vam poslali link za promenu lozinke.
        </p>

        {error && <div className="auth-alert">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email adresa</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ime@domen.com"
              required
            />
          </div>

          <button className="btn-primary" disabled={loading}>
            {loading ? "Slanje..." : "Pošalji link za promenu lozinke"}
          </button>
        </form>

        <div className="auth-footer">
          <a href="/prijava">Nazad na prijavu</a>
        </div>
      </div>
    </div>
  );
}