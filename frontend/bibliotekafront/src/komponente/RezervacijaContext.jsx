import React, { createContext, useState, useEffect } from "react";

export const RezervacijaContext = createContext();

export function RezervacijaProvider({ children }) {
  const [stavkeRezervacije, setStavkeRezervacije] = useState(() => {
    return [];
  });

  useEffect(() => {
    localStorage.setItem("stavkeRezervacije", JSON.stringify(stavkeRezervacije));
  }, [stavkeRezervacije]);

  const dodajStavku = (stavka) => {
    setStavkeRezervacije(prev => {
      const postoji = prev.find(s => s.id === stavka.id);
      if (postoji) {
        return prev.map(s => s.id === stavka.id ? { ...s, kolicina: stavka.kolicina } : s);
      }
      return [...prev, {
        id: stavka.id,
        kolicina: stavka.kolicina,
        naziv: stavka.naziv,
        opis: stavka.opis,
        slika: stavka.slika,
        izdavac: stavka.izdavac,
        godinaIzdanja: stavka.godinaIzdanja,
        zanr: stavka.zanr,
        autori: stavka.autori
      }];
    });
  };

  const ukloniStavku = (id) => {
    setStavkeRezervacije(prev => prev.filter(s => s.id !== id));
  };

  const resetujStavke = () => {
    setStavkeRezervacije([]);
    localStorage.removeItem("stavkeRezervacije");
  };

  return (
    <RezervacijaContext.Provider value={{
      stavkeRezervacije,
      dodajStavku,
      ukloniStavku,
      setStavkeRezervacije,
      resetujStavke
    }}>
      {children}
    </RezervacijaContext.Provider>
  );
}
