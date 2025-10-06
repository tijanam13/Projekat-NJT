import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/PocetnaStranica.css";
import na_drini_cuprija from '../slike/slika7.png';
import mali_princ from '../slike/slika8.jpg';
import hari_poter from '../slike/slika2.jpg';
import seobe from '../slike/slika3.jpg';
import zivotinjska_farma from '../slike/slika4.jpg';
import zlocin_i_kazna from '../slike/slika5.jpg';
import proces from '../slike/slika6.jpg';


export default function Pocetna() {
  const navigate = useNavigate();

  const handlePogledajKnjige = () => {
    navigate("/rezervacija");
  };

  return (
    <div className="pocetna">
      <section className="hero">
        <h1>Dobrodošli u našu biblioteku</h1>
        <p>Istražite veliki izbor knjiga i pronađite svoju sledeću omiljenu priču.</p>
        <button className="cta" onClick={handlePogledajKnjige}>
          Pogledaj sve knjige
        </button>
      </section>

      <section id="knjige" className="knjige">
        <h2>Naše preporuke</h2>
        <div className="grid">
          <div className="knjiga">
            <img src={na_drini_cuprija} alt="Na Drini ćuprija" />
            <h3>Na Drini ćuprija</h3>
            <p>Ivo Andrić</p>
          </div>
          <div className="knjiga">
            <img src={mali_princ} alt="Mali princ" />
            <h3>Mali princ</h3>
            <p>Antoan de Sent Egziperi</p>
          </div>
          <div className="knjiga">
            <img src={hari_poter} alt="Hari Poter i Kamen mudrosti" />
            <h3>Hari Poter i Kamen mudrosti</h3>
            <p>Džoan K. Rouling</p>
          </div>
          <div className="knjiga">
            <img src={seobe} alt="Seobe" />
            <h3>Seobe</h3>
            <p>Miloš Crnjanski</p>
          </div>
          <div className="knjiga">
            <img src={zivotinjska_farma} alt="Životinjska farma" />
            <h3>Životinjska farma</h3>
            <p>Džordž Orvel</p>
          </div>
          <div className="knjiga">
            <img src={zlocin_i_kazna} alt="Zločin i kazna" />
            <h3>Zločin i kazna</h3>
            <p>Fjodor Mihailovič Dostojevski</p>
          </div>
          <div className="knjiga">
            <img src={proces} alt="Proces" />
            <h3>Proces</h3>
            <p>Franc Kafka</p>
          </div>
        </div>
      </section>
    </div>
  );
}