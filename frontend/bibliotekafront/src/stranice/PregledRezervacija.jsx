import React, { useState, useContext, useEffect, useCallback } from "react";
import { RezervacijaContext } from "../komponente/RezervacijaContext";
import { AuthContext } from "../komponente/AuthContext";
import axios from "axios";
import { Button } from "@mui/material";
import "../css/PregledRezervacija.css";

export default function PregledRezervacija() {
  const { stavkeRezervacije, ukloniStavku, setStavkeRezervacije } = useContext(RezervacijaContext);
  const { me } = useContext(AuthContext);

  const [rezervacije, setRezervacije] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStavke, setModalStavke] = useState([]);
  const [datumRezervacije] = useState(new Date());
  const [rokZaPreuzimanje] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const fetchRezervacije = useCallback(async () => {
    if (!me?.id) {
      setRezervacije([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/rezervacija/korisnik/${me.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRezervacije(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Greška prilikom učitavanja rezervacija:", err.response?.data || err);
      setRezervacije([]);
    }
  }, [me]);

  const potvrdiRezervaciju = async () => {
    if (!me) {
      alert("Niste prijavljeni.");
      return;
    }
    if (stavkeRezervacije.length === 0) {
      alert("Nema knjiga u korpi za rezervaciju.");
      return;
    }

    const payload = {
      datumRezervacije: datumRezervacije.toISOString(),
      rokZaPreuzimanje: rokZaPreuzimanje.toISOString(),
      stavke: stavkeRezervacije.map((item) => ({
        brojPrimeraka: item.kolicina,
        knjigaId: item.id
      }))
    };

    try {
      const token = localStorage.getItem("token");
      console.log("JWT token:", token);
      console.log("Payload za rezervaciju:", payload);

      const res = await axios.post("http://localhost:8080/api/rezervacija", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("Response backend:", res.data);
      alert("Rezervacija je uspešno potvrđena!");
      setStavkeRezervacije([]);
      fetchRezervacije();
    } catch (err) {
      console.error("Greška prilikom potvrde rezervacije:", err.response?.data || err);
      if (err.response) {
        console.log("Status code:", err.response.status);
        console.log("Headers:", err.response.headers);
        console.log("Data:", err.response.data);
      }
      alert("Došlo je do greške prilikom potvrde rezervacije.");
    }
  };

  const otkaziRezervaciju = async (rezId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/api/rezervacija/${rezId}/status?status=OTKAZANO`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRezervacije();
      alert("Rezervacija je uspešno otkazana!");
    } catch (e) {
      console.error("Greška prilikom otkazivanja rezervacije:", e.response?.data || e);
      alert("Došlo je do greške prilikom otkazivanja rezervacije.");
    }
  };

  const azurirajStatusIsteklo = useCallback(async (rezId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/api/rezervacija/${rezId}/status?status=ISTEKLO`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Status rezervacije ${rezId} ažuriran u ISTEKLO.`);
      fetchRezervacije();
    } catch (e) {
      console.error(`Greška prilikom ažuriranja statusa rezervacije ${rezId} u ISTEKLO:`, e.response?.data || e);
    }
  }, [fetchRezervacije]);


  useEffect(() => {
    fetchRezervacije();
  }, [fetchRezervacije]);


  useEffect(() => {
    const danas = new Date();
    rezervacije.forEach(rez => {
      const rok = new Date(rez.rokZaPreuzimanje);
      if (rez.status === "AKTIVNO" && danas > rok) {
        azurirajStatusIsteklo(rez.id);
      }
    });
  }, [rezervacije, azurirajStatusIsteklo]);


  const prikaziStatus = (rez) => {
    const danas = new Date();
    const rok = new Date(rez.rokZaPreuzimanje);

    if (rez.status === "OTKAZANO") return "OTKAZANO";
    if (rez.status === "PREUZETO") return "PREUZETO";

    if (rez.status === "AKTIVNO" && danas > rok) return "ISTEKLO";

    return rez.status;
  };

  const openModal = (stavke) => {
    setModalStavke(stavke);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalStavke([]);
  };

  return (
    <div className="pregled-rezervacija" style={{ padding: "20px" }}>
      <h1>Pregled i potvrda rezervacije</h1>

      <h2>Trenutna rezervacija</h2>
      {stavkeRezervacije.length === 0 ? (
        <p>Nema knjiga u trenutnoj rezervaciji.</p>
      ) : (
        <>
          <div className="scroll-table">
            <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%", minWidth: "900px" }}>
              <thead>
                <tr>
                  <th>Redni broj</th>
                  <th>Količina</th>
                  <th>Naziv knjige</th>
                  <th>Izdavač</th>
                  <th>Godina izdanja</th>
                  <th>Žanr</th>
                  <th>Autori</th>
                  <th>Slika</th>
                  <th>Opis</th>
                  <th>Ukloni</th>
                </tr>
              </thead>
              <tbody>
                {stavkeRezervacije.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.kolicina}</td>
                    <td>{item.naziv}</td>
                    <td>{item.izdavac}</td>
                    <td>{item.godinaIzdanja}</td>
                    <td>{item.zanr}</td>
                    <td>{item.autori?.map((a) => `${a.ime} ${a.prezime}`).join(", ") || "Nepoznato"}</td>
                    <td>
                      {item.slika ? (
                        <img src={item.slika} alt={item.naziv} style={{ width: "50px", height: "70px", objectFit: "cover" }} />
                      ) : (
                        "Nema slike"
                      )}
                    </td>
                    <td>{item.opis?.length > 20 ? item.opis.slice(0, 20) + "..." : item.opis || "Nema opisa"}</td>
                    <td>
                      <Button
                        onClick={() => ukloniStavku(item.id)}
                        sx={{ backgroundColor: "#c0392b", color: "white", "&:hover": { backgroundColor: "#e74c3c" }, borderRadius: 1 }}
                      >
                        Ukloni
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            <strong>Datum rezervacije:</strong> {datumRezervacije.toLocaleDateString()}
          </p>
          <p>
            <strong>Rok za preuzimanje:</strong> {rokZaPreuzimanje.toLocaleDateString()}
          </p>

          <Button
            onClick={potvrdiRezervaciju}
            disabled={stavkeRezervacije.length === 0}
            sx={{ backgroundColor: "#27ae60", color: "white", "&:hover": { backgroundColor: "#2ecc71" }, borderRadius: 1, marginBottom: "20px" }}
          >
            Potvrdi rezervaciju
          </Button>
        </>
      )}

      <h2>Sve rezervacije</h2>
      <div className="scroll-table">
        <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%", marginBottom: "20px", minWidth: "700px" }}>
          <thead>
            <tr>
              <th>Datum rezervacije</th>
              <th>Rok za preuzimanje</th>
              <th>Status</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {rezervacije.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>Nema postojećih rezervacija.</td>
              </tr>
            ) : (
              rezervacije.map((rez) => (
                <tr key={rez.id}>
                  <td>{new Date(rez.datumRezervacije).toLocaleDateString()}</td>
                  <td>{new Date(rez.rokZaPreuzimanje).toLocaleDateString()}</td>
                  <td>{prikaziStatus(rez)}</td>
                  <td>
                    <Button
                      onClick={() => openModal(rez.stavke)}
                      sx={{ backgroundColor: "#2980b9", color: "white", "&:hover": { backgroundColor: "#3498db" }, borderRadius: 1, marginRight: "5px" }}
                    >
                      Pogledaj stavke
                    </Button>
                    {prikaziStatus(rez) === "AKTIVNO" && (
                      <Button
                        onClick={() => otkaziRezervaciju(rez.id)}
                        sx={{ backgroundColor: "#c0392b", color: "white", "&:hover": { backgroundColor: "#e74c3c" }, borderRadius: 1 }}
                      >
                        Otkaži
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "15px",
            width: "600px",
            maxHeight: "60vh",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          <h3>Stavke rezervacije</h3>
          <div className="scroll-table">
            <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Redni broj</th>
                  <th>Količina</th>
                  <th>Naziv knjige</th>
                  <th>Autori</th>
                </tr>
              </thead>
              <tbody>
                {modalStavke.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>Nema stavki za ovu rezervaciju.</td>
                  </tr>
                ) : (
                  modalStavke.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.brojPrimeraka}</td>
                      <td>{item.knjiga?.naslov || "Nepoznato"}</td>
                      <td>
                        {item.knjiga?.autori
                          ?.map((ka) => `${ka.autor.ime} ${ka.autor.prezime}`)
                          .join(", ") || "Nepoznato"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Button
            onClick={closeModal}
            sx={{ backgroundColor: "#655a7c", color: "white", "&:hover": { backgroundColor: "#4a3f6e" }, borderRadius: 1, marginTop: "10px" }}
          >
            Zatvori
          </Button>
        </div>
      )}
    </div>
  );
}