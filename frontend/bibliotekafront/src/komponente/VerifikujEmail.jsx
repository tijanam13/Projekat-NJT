import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import http from "../api/http";
import { AuthContext } from "./AuthContext";

export default function VerifikujEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("❌ Token nije pronađen.");
      setLoading(false);
      const timer = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timer);
    }

    const verify = async () => {
      try {
        const res = await http.post("/auth/verify", { token: decodeURIComponent(token) });
        const { success, message, token: jwtToken, korisnik } = res.data;

        if (success && korisnik && jwtToken) {
          login(korisnik, jwtToken);
          setStatus("✅ Nalog je uspešno aktiviran!");
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          setStatus(`❌ ${message || "Neispravan token."}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (e) {
        setStatus("❌ Došlo je do greške prilikom povezivanja sa serverom.");
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setLoading(false);
        navigate("/");
      }
    };

    verify();
  }, [searchParams, navigate, login]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem" }}>🔄 Molimo sačekajte...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{status}</h2>
    </div>
  );
}