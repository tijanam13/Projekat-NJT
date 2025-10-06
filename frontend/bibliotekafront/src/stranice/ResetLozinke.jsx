import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import http from "../api/http";
import "../css/Autentifikacija.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


export default function PasswordReset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const invalidToken = !token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    setLoading(true);
    try {
      await http.post("/auth/reset-password", { token, password: newPassword });
      setMessage("Lozinka je uspešno promenjena. Sada se možete prijaviti.");
      setTimeout(() => navigate("/prijava"), 2000);
    } catch (err) {
      setError(err?.response?.data || "Link je neispravan ili je istekao.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Podesi novu lozinku</h2>
        <p className="muted">Unesite novu lozinku i potvrdite je.</p>

        {invalidToken && (
          <div className="auth-alert">
            Link za promenu lozinke nije validan. Zatražite novi na stranici{" "}
            <a href="/forgot">Zaboravljena lozinka</a>.
          </div>
        )}

        {error && <div className="auth-alert">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        {!invalidToken && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Nova lozinka</label>
              <div className="password-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </div>
            </div>

            <div className="field">
              <label>Potvrdi lozinku</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </div>
            </div>

            <button className="btn-primary" disabled={loading}>
              {loading ? "Čuvanje..." : "Sačuvaj lozinku"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <a href="/prijava">Nazad na prijavu</a>
        </div>
      </div>
    </div>
  );
}