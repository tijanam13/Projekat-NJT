import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import "../css/Autentifikacija.css";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ korisnickoIme: "", email: "", lozinka: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.korisnickoIme.trim() || !form.email.trim() || !form.lozinka.trim()) {
      return "Niste popunili sva polja.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Email nije validan (npr. ime@gmail.com).";
    if (form.lozinka.length < 6) return "Lozinka mora imati najmanje 6 karaktera.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    const validationError = validateForm();
    if (validationError) {
      setErr(validationError);
      return;
    }

    setLoading(true);

    try {
      await http.post("/auth/register", form);
      setOk("✅ Nalog je uspešno kreiran. Proverite svoj email i kliknite na dugme ili link za potvrdu registracije.");
    } catch (e) {
      const backendMessage = e?.response?.data?.message;
      setErr(backendMessage || "Neuspešna registracija.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Kreiraj nalog</h2>
        <p className="muted">Pridružite se našoj biblioteci</p>

        {err && <div className="auth-alert">{err}</div>}
        {ok && <div className="auth-success">{ok}</div>}

        {!ok && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Korisničko ime</label>
              <input
                type="text"
                value={form.korisnickoIme}
                onChange={handleChange("korisnickoIme")}
                placeholder="Korisničko ime"
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="text"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="Email (npr. ime@gmail.com)"
              />
            </div>

            <div className="field password-field">
              <label>Lozinka</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.lozinka}
                  onChange={handleChange("lozinka")}
                  placeholder="Lozinka (min 6 karaktera)"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </div>
            </div>

            <button className="btn-primary" disabled={loading}>
              {loading ? "Kreiranje…" : "Kreiraj nalog"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <span className="muted">Već imate nalog?</span>
          <a href="/prijava">Prijavite se</a>
        </div>
      </div>
    </div>
  );
}