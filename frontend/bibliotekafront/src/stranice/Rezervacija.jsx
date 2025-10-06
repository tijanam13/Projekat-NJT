import React, { useEffect, useState, useContext } from "react";
import http from "../api/http";
import "../css/Rezervacija.css";
import { RezervacijaContext } from "../komponente/RezervacijaContext";
import { Button } from "@mui/material";

export default function Rezervacija() {
  const [knjige, setKnjige] = useState([]);
  const [korpa, setKorpa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [autori, setAutori] = useState([]);
  const [filterZanr, setFilterZanr] = useState("");
  const [filterAutor, setFilterAutor] = useState("");

  const { stavkeRezervacije, dodajStavku, ukloniStavku } = useContext(RezervacijaContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [odabranaKnjiga, setOdabranaKnjiga] = useState(null);

  const zanrovi = [
    "Novela", "Pripovetka", "Poezija", "Drama", "Satira", "Esej",
    "Ljubavni roman", "Kriminalistički roman", "Triler", "Horor",
    "Naučna fantastika", "Psihološki roman", "Istorijski roman",
    "Ratni roman", "Avanturistički roman", "Detektivski roman"
  ];

  const fetchKnjigeFilter = async (zanrValue = filterZanr, autorValue = filterAutor) => {
    setLoading(true);
    try {
      const params = {};
      if (zanrValue) params.zanr = zanrValue.replace(/ /g, "_");
      if (autorValue) params.autorId = autorValue;

      const res = await http.get("/knjiga/filter", { params });
      const data = Array.isArray(res.data) ? res.data : [];

      setKnjige(
        data.map((x) => ({
          id: x.id,
          naziv: x.naslov ?? x.naziv ?? "",
          izdavac: x.izdavac ?? "",
          godinaIzdanja: x.godinaIzdanja ?? x.godina_izdanja ?? "Nepoznato",
          brojDostupnihPrimeraka: x.brojDosupnihPrimeraka ?? x.brojDostupnihPrimeraka ?? 0,
          zanr: x.zanr ? x.zanr.replace(/_/g, " ") : "Nepoznato",
          autor: (x.autori ?? []).map(a => ({ ime: a.ime, prezime: a.prezime })) || [],
          slika: x.slika ?? "",
          opis: x.opis ?? ""
        }))
      );
    } catch (e) {
      console.error("Greška prilikom učitavanja knjiga:", e);
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnjigeFilter();

    const fetchAutori = async () => {
      try {
        const res = await http.get("/autori");
        setAutori(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Greška prilikom učitavanja autora:", e);
      }
    };
    fetchAutori();
  }, []);

  const handleAddToKorpa = (knjiga, kolicina) => {
    const exists = korpa.find(item => item.id === knjiga.id);
    if (exists) {
      setKorpa(
        korpa.map(item =>
          item.id === knjiga.id ? { ...item, kolicina } : item
        )
      );
    } else {
      setKorpa([...korpa, { ...knjiga, kolicina }]);
    }

    const stavkaPostoji = stavkeRezervacije.find(item => item.id === knjiga.id);
    if (stavkaPostoji) {
      stavkaPostoji.kolicina = kolicina;
    } else {
      dodajStavku({
        id: knjiga.id,
        naziv: knjiga.naziv,
        kolicina,
        izdavac: knjiga.izdavac,
        godinaIzdanja: knjiga.godinaIzdanja,
        zanr: knjiga.zanr,
        autori: knjiga.autor,
        slika: knjiga.slika,
        opis: knjiga.opis
      });
    }
  };

  const handleRemoveFromKorpa = (knjigaId) => {
    setKorpa(korpa.filter(item => item.id !== knjigaId));
    ukloniStavku(knjigaId);
  };

  const openModal = (knjiga) => {
    setOdabranaKnjiga(knjiga);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setOdabranaKnjiga(null);
  };

  const OpisKnige = ({ opis }) => {
    const [prikaziVise, setPrikaziVise] = useState(false);
    if (!opis) return null;
    const kratkiOpis = opis.length > 20 ? opis.slice(0, 20) + "..." : opis;

    return (
      <div style={{
        maxHeight: prikaziVise ? "200px" : "50px",
        overflowY: prikaziVise ? "auto" : "hidden",
        padding: "5px",
        backgroundColor: "#ab92bfff",
        borderRadius: "5px",
        marginBottom: "10px",
      }}>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {prikaziVise ? opis : kratkiOpis}
        </div>
        {opis.length > 20 && (
          <button
            style={{ backgroundColor: "transparent", border: "none", color: "#655a7c", cursor: "pointer", marginTop: "5px" }}
            onClick={() => setPrikaziVise(!prikaziVise)}
          >
            {prikaziVise ? "Prikaži manje" : "Prikaži više"}
          </button>
        )}
      </div>
    );
  };

  const handleResetFilters = () => {
    setFilterAutor("");
    setFilterZanr("");
    fetchKnjigeFilter("", "");
  };

  return (
    <div className="rezervacija-container">
      <h1>Rezervacija knjiga</h1>

      <div className="filter-container">
        <div className="filter-item">
          <label>Pronađi knjige po žanru</label>
          <select value={filterZanr} onChange={e => setFilterZanr(e.target.value)}>
            <option value="">Svi žanrovi</option>
            {zanrovi.map(z => (
              <option key={z} value={z.replace(/ /g, "_")}>{z}</option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Pronađi knjige po autoru</label>
          <select value={filterAutor} onChange={e => setFilterAutor(e.target.value)}>
            <option value="">Svi autori</option>
            {autori.map(a => <option key={a.id} value={a.id}>{a.ime} {a.prezime}</option>)}
          </select>
        </div>
        <Button
          onClick={() => fetchKnjigeFilter(filterZanr, filterAutor)}
          sx={{ backgroundColor: "#655a7c", color: "white", "&:hover": { backgroundColor: "#4a3f6e" }, borderRadius: 1 }}
        >
          Pretraži
        </Button>
        <Button
          onClick={handleResetFilters}
          sx={{ backgroundColor: "#655a7c", color: "white", "&:hover": { backgroundColor: "#4a3f6e" }, borderRadius: 1, marginLeft: "10px" }}
        >
          Osveži
        </Button>
      </div>

      <div className="knjige-lista">
        {knjige.length > 0 ? knjige.map(knjiga => (
          <div className="knjiga-item" key={knjiga.id}>
            <div className="image-container" onClick={() => openModal(knjiga)}>
              <img
                src={knjiga.slika}
                alt={knjiga.naziv}
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
              <div className="hover-overlay">Klikni za prikaz detalja</div>
            </div>
            <h3>{knjiga.naziv}</h3>
            <p style={{ fontSize: "0.9rem", color: "#655a7c" }}>
              {knjiga.autor.length > 0
                ? knjiga.autor.map(a => `${a.ime} ${a.prezime}`).join(", ")
                : "Nepoznato"}
            </p>
            <div style={{ display: "flex", gap: "5px", marginTop: "5px", alignItems: "center" }}>
              <input
                type="number"
                min="1"
                max={knjiga.brojDostupnihPrimeraka}
                value={korpa.find(item => item.id === knjiga.id)?.kolicina || 1}
                onChange={e => handleAddToKorpa(knjiga, parseInt(e.target.value))}
                style={{
                  width: "60px",
                  height: "35px",
                  fontSize: "1rem",
                  backgroundColor: "#ab92bfff",
                  border: "2px solid #655a7c",
                  borderRadius: "5px",
                  textAlign: "center",
                  color: "#fff"
                }}
              />
              {!stavkeRezervacije.find(item => item.id === knjiga.id) ? (
                <Button
                  onClick={() => handleAddToKorpa(knjiga, 1)}
                  sx={{ backgroundColor: "#655a7c", color: "white", "&:hover": { backgroundColor: "#4a3f6e" }, borderRadius: 1 }}
                >
                  Rezerviši
                </Button>
              ) : (
                <Button
                  onClick={() => handleRemoveFromKorpa(knjiga.id)}
                  sx={{ backgroundColor: "#655a7c", color: "white", "&:hover": { backgroundColor: "#4a3f6e" }, borderRadius: 1 }}
                >
                  Ukloni
                </Button>
              )}
            </div>
          </div>
        )) : (!loading && (
          <p style={{ textAlign: "center", color: "#655a7c", marginTop: "1rem", gridColumn: "1 / -1" }}>
            Ne postoje knjige za date kriterijume.
          </p>
        ))}
      </div>

      {modalOpen && odabranaKnjiga && (
        <div className="modal-form" style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#afc1d6ff",
          padding: "20px",
          borderRadius: "15px",
          width: "480px",
          maxHeight: "85vh",
          overflowY: "auto",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column"
        }}>
          <img src={odabranaKnjiga.slika} alt={odabranaKnjiga.naziv} style={{ width: "180px", height: "220px", objectFit: "cover", marginBottom: "10px", alignSelf: "center" }} />
          <h2>{odabranaKnjiga.naziv}</h2>
          <p><strong>Autor(i):</strong> {odabranaKnjiga.autor.length > 0 ? odabranaKnjiga.autor.map(a => `${a.ime} ${a.prezime}`).join(", ") : "Nepoznato"}</p>
          <p><strong>Izdavač:</strong> {odabranaKnjiga.izdavac}</p>
          <p><strong>Žanr:</strong> {odabranaKnjiga.zanr}</p>
          <p><strong>Godina izdavanja:</strong> {odabranaKnjiga.godinaIzdanja}</p>
          <p><strong>Dostupno:</strong> {odabranaKnjiga.brojDostupnihPrimeraka}</p>
          <OpisKnige opis={odabranaKnjiga.opis} />
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={closeModal}
              sx={{ backgroundColor: "#655a7c", color: "white", "&:hover": { backgroundColor: "#4a3f6e" }, borderRadius: 1 }}
            >
              Nazad
            </Button>
          </div>
        </div>
      )}

      <div className="korpa-preview">
        <h2>Rezervisano ({stavkeRezervacije.length})</h2>
        {stavkeRezervacije.map((item, idx) => (
          <div key={idx} className="korpa-item">
            <span>{item.naziv}</span>
            <span>Količina: {item.kolicina}</span>
          </div>
        ))}
      </div>
    </div>
  );
}