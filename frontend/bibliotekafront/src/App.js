import './App.css';
import PocetnaStranica from './stranice/PocetnaStranica';
import { Footer } from './komponente/Footer';
import Autori from './stranice/Autori';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Prijava from './stranice/Prijava';
import Registracija from './stranice/Registracija';
import NavigacioniBar from './komponente/NavigacioniBar';
import ZasticeneRuteADMIN from './komponente/ZasticeneRuteADMIN';
import ZasticeneRuteKORISNIK from './komponente/ZasticeneRuteKORISNIK';
import VerifikujEmail from './komponente/VerifikujEmail';
import ZaboravljenaLozinka from './stranice/ZaboravljenaLozinka';
import ResetLozinke from './stranice/ResetLozinke';
import Knjige from './stranice/Knjige';
import Rezervacija from './stranice/Rezervacija';
import PregledRezervacija from './stranice/PregledRezervacija';
import ONama from './stranice/ONama';
import Kontakt from './stranice/Kontakt';
import UpravljanjeRezervacijama from './stranice/UpravljanjeRezervacijama';
import { RezervacijaProvider } from "./komponente/RezervacijaContext";
import { AuthProvider, AuthContext } from './komponente/AuthContext';
import { useContext, useEffect, useState } from 'react';

function AppContent() {
  const { me } = useContext(AuthContext);

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const userId = me?.id || null;

  const addToCart = (p) => setCart([...cart, p]);

  return (
    <BrowserRouter>
      <NavigacioniBar />
      <RezervacijaProvider>

        <Routes>
          <Route path="/" element={<PocetnaStranica />} />

          <Route element={<ZasticeneRuteADMIN />}>
            <Route path="/autori" element={<Autori />} />
            <Route path="/knjige" element={<Knjige />} />
            <Route path="/upravljanje-rezervacijama" element={<UpravljanjeRezervacijama />} />
          </Route>

          <Route element={<ZasticeneRuteKORISNIK />}>
            <Route path="/pregled-rezervacija" element={<PregledRezervacija cart={cart} setCart={setCart} userId={userId} />} />
            <Route path="/rezervacija" element={<Rezervacija />} />
          </Route>


          <Route path="/prijava" element={<Prijava onSuccess={() => window.location.href = '/'} />} />
          <Route path="/registracija" element={<Registracija onSuccess={() => window.location.href = '/'} />} />

          <Route path="/verifikuj" element={<VerifikujEmail />} />

          <Route path="/zaboravljena-lozinka" element={<ZaboravljenaLozinka />} />
          <Route path="/reset-lozinke" element={<ResetLozinke />} />

          <Route path="/knjige" element={<Knjige />} />
          <Route path="/rezervacija" element={<Rezervacija addToCart={addToCart} />} />
          <Route path="/pregled-rezervacija" element={<PregledRezervacija cart={cart} setCart={setCart} userId={userId} />} />
          <Route path="/o-nama" element={<ONama />} />
          <Route path="/kontakt" element={<Kontakt />} />

        </Routes>
      </RezervacijaProvider>
      <Footer />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;