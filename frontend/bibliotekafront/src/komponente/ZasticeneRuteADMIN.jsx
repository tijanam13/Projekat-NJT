import React from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet } from "react-router-dom";

export default function ZasticeneRuteADMIN() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <div style={{ padding: 40, textAlign: "center" }}>
      <h2>❌ Za pristup stranici morate biti prijavljeni kao admin. ❌</h2>
    </div>;
  }

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.role || [];

    if (!roles.includes("ADMIN")) {
      return <div style={{ padding: 40, textAlign: "center" }}>
        <h2>❌ Nemate pravo pristupa ovoj stranici. ❌</h2>
      </div>;
    }

    return <Outlet />;
  } catch (e) {
    return <div style={{ padding: 40, textAlign: "center" }}>
      <h2>❌ Nevažeći token. ❌</h2>
    </div>;
  }
}
