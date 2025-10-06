import React, { useState, useContext } from "react";
import { AuthContext } from "../komponente/AuthContext";
import http from "../api/http";
import "../css/Autentifikacija.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Login({ onSuccess }) {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ korisnickoIme: "", lozinka: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.korisnickoIme.trim() || !form.lozinka.trim()) {
      setErr("Niste popunili sva polja.");
      return;
    }
    if (form.lozinka.length < 6) {
      setErr("Lozinka mora imati najmanje 6 karaktera.");
      return;
    }

    setLoading(true);
    try {
      const loginRes = await http.post("/auth/login", form);
      const token = loginRes.data.token;

      if (!token) throw new Error("Token nije dobijen od servera.");

      localStorage.setItem("token", token);

      const meRes = await http.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(meRes.data, token);

      if (typeof onSuccess === "function") onSuccess(meRes.data);
    } catch (e) {
      const backendMsg = e?.response?.data?.message || "";
      if (backendMsg.includes("korisničko ime")) {
        setErr("Neuspešna prijava: korisničko ime nije pronađeno ili je pogrešno.");
      } else if (backendMsg.includes("email")) {
        setErr("Neuspešna prijava: email nije pronađen ili je pogrešan.");
      } else if (backendMsg.includes("lozinka")) {
        setErr("Neuspešna prijava: lozinka nije ispravna.");
      } else {
        setErr("Neuspešna prijava. Proverite unesene podatke.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Dobrodošli nazad</h2>
        <p className="muted">Prijavite se da nastavite</p>

        {err && <div className="auth-alert">{err}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="field">
            <label>Korisničko ime</label>
            <input
              type="text"
              autoComplete="username"
              value={form.korisnickoIme}
              onChange={(e) =>
                setForm((f) => ({ ...f, korisnickoIme: e.target.value }))
              }
              placeholder="Korisničko ime"
            />
          </div>

          <div className="field">
            <label>Lozinka</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.lozinka}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lozinka: e.target.value }))
                }
                placeholder="Lozinka"
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
            {loading ? "Prijavljivanje…" : "Prijava"}
          </button>
        </form>

        <div className="auth-footer">
          <a href="/zaboravljena-lozinka">Zaboravili ste lozinku?</a>
          <span className="muted">Nemate nalog?</span>
          <a href="/registracija">Registrujte se</a>
        </div>
      </div>
    </div>
  );
}
