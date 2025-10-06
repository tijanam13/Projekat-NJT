import "../css/ONama.css";
import bibliotekaSlika from "../slike/slika1.jpg";
export default function ONama() {
  return (
    <div className="onama-page">
      <div className="onama-container">
        <h1>O nama</h1>
        <div className="onama-content">
          <div className="onama-text">
            <p>
              Dobrodošli u našu biblioteku! Naša misija je da promovišemo
              čitanje i obrazovanje kroz bogat izbor knjiga za sve uzraste.
            </p>
            <p>
              Biblioteka je osnovana 2023. godine i od tada služimo lokalnoj
              zajednici, nudeći ne samo knjige već i različite edukativne i
              kulturne aktivnosti. Ovim sajtom želimo da našim korisnicima olakšamo pristup
              biblioteci i omogućimo jednostavnu rezervaciju knjiga putem
              onlajn platforme. Cilj nam je da proces rezervacije bude brz i
              praktičan, kako bi svaki ljubitelj knjiga mogao da uživa u
              omiljenim naslovima bez nepotrebnog čekanja.
            </p>
            <p>
              Naša vizija je da postanemo mesto gde se znanje i kreativnost
              susreću, a naši posetioci i čitaoci uvek osećaju dobrodošlicu.
            </p>
          </div>
          <div className="onama-image">
            <img src={bibliotekaSlika} alt="Naša biblioteka" />
          </div>
        </div>
      </div>
    </div>

  );
}