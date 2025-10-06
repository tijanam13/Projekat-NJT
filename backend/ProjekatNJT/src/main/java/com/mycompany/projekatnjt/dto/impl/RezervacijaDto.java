package com.mycompany.projekatnjt.dto.impl;

import com.mycompany.projekatnjt.entity.impl.Status;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

public class RezervacijaDto {

    private Long id;
    @NotNull(message = "Datum rezervacije je obavezan.")
    private Date datumRezervacije;
    @NotNull(message = "Datum isteka rezervacije je obavezan.")
    private Date rokZaPreuzimanje;
    private Status status;
    private KorisnikDto korisnik;
    @Valid
    @NotEmpty(message = "Rezervacija mora imati bar jednu stavku.")
    private List<StavkaRezervacijeDto> stavke;

    public RezervacijaDto() {
    }

    public RezervacijaDto(Long id, Date datumRezervacije, Date rokZaPreuzimanje, Status status, KorisnikDto korisnik, List<StavkaRezervacijeDto> stavke) {
        this.id = id;
        this.datumRezervacije = datumRezervacije;
        this.rokZaPreuzimanje = rokZaPreuzimanje;
        this.status = status;
        this.korisnik = korisnik;
        this.stavke = stavke;
    }

    public RezervacijaDto(Long id, Date datumRezervacije, Date rokZaPreuzimanje, Status status, KorisnikDto korisnik) {
        this.id = id;
        this.datumRezervacije = datumRezervacije;
        this.rokZaPreuzimanje = rokZaPreuzimanje;
        this.status = status;
        this.korisnik = korisnik;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDatumRezervacije() {
        return datumRezervacije;
    }

    public void setDatumRezervacije(Date datumRezervacije) {
        this.datumRezervacije = datumRezervacije;
    }

    public Date getRokZaPreuzimanje() {
        return rokZaPreuzimanje;
    }

    public void setRokZaPreuzimanje(Date rokZaPreuzimanje) {
        this.rokZaPreuzimanje = rokZaPreuzimanje;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public KorisnikDto getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(KorisnikDto korisnik) {
        this.korisnik = korisnik;
    }

    public List<StavkaRezervacijeDto> getStavke() {
        return stavke;
    }

    public void setStavke(List<StavkaRezervacijeDto> stavke) {
        this.stavke = stavke;
    }

}
