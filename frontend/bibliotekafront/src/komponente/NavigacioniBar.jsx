import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "../css/NavigacioniBar.css";
import logo from "../slike/logo.png";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';


export default function Navbar() {
  const nav = useNavigate();
  const { me, authed, logout, hasRole } = useContext(AuthContext);

  const isAdmin = hasRole("ADMIN");
  const isKorisnik = hasRole("KORISNIK");

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="logo" className="navbar-logo" />
        <span className="navbar-title">Biblioteka</span>
      </div>

      <nav className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Početna</NavLink>

        {isAdmin && (
          <>
            <NavLink to="/autori" className={({ isActive }) => isActive ? "active-link" : ""}>Autori</NavLink>
            <NavLink to="/knjige" className={({ isActive }) => isActive ? "active-link" : ""}>Knjige</NavLink>
            <NavLink to="/upravljanje-rezervacijama" className={({ isActive }) => isActive ? "active-link" : ""}>Upravljanje Rezervacijama</NavLink>
          </>
        )}

        {isKorisnik && (
          <>
            <NavLink to="/rezervacija" className={({ isActive }) => isActive ? "active-link" : ""}>Rezervacija</NavLink>
            <NavLink to="/pregled-rezervacija" className={({ isActive }) => isActive ? "active-link icon-link" : "icon-link"}>
              <AutoStoriesIcon fontSize="large" />
            </NavLink>
          </>
        )}

        <NavLink to="/o-nama" className={({ isActive }) => isActive ? "active-link" : ""}>O nama</NavLink>
        <NavLink to="/kontakt" className={({ isActive }) => isActive ? "active-link" : ""}>Kontakt</NavLink>

      </nav>

      <div className="navbar-actions">
        {!authed ? (
          <>
            <NavLink to="/prijava" className="btn-outline">Prijava</NavLink>
            <NavLink to="/registracija" className="btn-outline">Registracija</NavLink>
          </>
        ) : (
          <>
            <span className="user-chip">{me?.korisnickoIme ?? "Korisnik"}</span>
            <button className="btn-outline" onClick={() => { logout(); nav("/prijava"); }}>Odjava</button>
          </>
        )}
      </div>
    </header>
  );
}