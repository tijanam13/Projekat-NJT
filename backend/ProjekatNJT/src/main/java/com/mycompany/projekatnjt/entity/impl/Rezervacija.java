package com.mycompany.projekatnjt.entity.impl;

import java.util.Date;
import java.util.List;
import jakarta.persistence.*;
import java.util.ArrayList;

@Entity
@Table(name = "rezervacija")
public class Rezervacija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Date datumRezervacije;
    @Column(nullable = false)
    private Date rokZaPreuzimanje;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private Status status;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "korisnikId", nullable = false)
    private Korisnik korisnik;
    @OneToMany(mappedBy = "rezervacija", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StavkaRezervacije> stavke = new ArrayList<>();

    public Rezervacija() {
    }

    public Rezervacija(Long id) {
        this.id = id;
    }

    public Rezervacija(Long id, Date datumRezervacije, Date rokZaPreuzimanje, Status status, Korisnik korisnik, List<StavkaRezervacije> stavke) {
        this.id = id;
        this.datumRezervacije = datumRezervacije;
        this.rokZaPreuzimanje = rokZaPreuzimanje;
        this.status = status;
        this.korisnik = korisnik;
        this.stavke = stavke;
    }

    public Rezervacija(Long id, Date datumRezervacije, Date rokZaPreuzimanje, Status status, Korisnik korisnik) {
        this.id = id;
        this.datumRezervacije = datumRezervacije;
        this.rokZaPreuzimanje = rokZaPreuzimanje;
        this.status = status;
        this.korisnik = korisnik;
    }

    public void dodajStavku(StavkaRezervacije item) {
        item.setRezervacija(this);
        this.stavke.add(item);
    }

    public void obrisiStavku(StavkaRezervacije item) {
        item.setRezervacija(null);
        this.stavke.remove(item);
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

    public Korisnik getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Korisnik korisnik) {
        this.korisnik = korisnik;
    }

    public List<StavkaRezervacije> getStavke() {
        return stavke;
    }

    public void setStavke(List<StavkaRezervacije> stavke) {
        this.stavke = stavke;
    }

}
